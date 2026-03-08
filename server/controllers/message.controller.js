import imagekit from "../config/imagekit.js";
import ai from "../config/gemini.js";
import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";
import axios from "axios"

export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if(req.user.credits < 1)
        {
            return res.json({ success: false, message: "You Don't have enough Credits to use this Feature" });
        }

        const {chatId, prompt} = req.body;

        const chat = await Chat.findOne({_id: chatId, userId});
        chat.messages.push({ 
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        //^ Build conversation history for Gemini (text-only, last 30 messages)
        const history = chat.messages
            .filter(msg => !msg.isImage)
            .slice(-30)
            .map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            }));

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: history,
            config: {
                systemInstruction: `You are an AI assistant. Follow these rules strictly:

- For normal questions (coding, math, science, general knowledge, etc.), just answer the question directly. Do NOT mention your name, your creator, or any branding. Respond like a helpful, knowledgeable assistant.
- ONLY when the user explicitly asks identity-related questions like "Who are you?", "What is your name?", "Who created you?", "Who made you?", or "Who built you?" — THEN respond that your name is SHARP GPT, you were created by Arshit Gajera, and you are powered by Google's Gemini AI model.
- Never volunteer identity information unless directly asked.`
            }
        });

        const reply = { role: "assistant", content: response.text, timestamp: Date.now(), isImage: false }

        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save();
        await User.updateOne({_id: userId}, { $inc: {credits: -1}});

    } catch (error) {
        console.log("Text Message Error:", error.message);
        console.log("Full Error:", error?.status, error?.error || error);
        return res.json({ success: false, message: "Something went wrong, please try again." });
    }
}

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if(req.user.credits < 2)
        {
            return res.json({ success: false, message: "You Don't have enough Credits to use this Feature" });
        }

        const {prompt, chatId, isPublished} = req.body;
        const chat = await Chat.findOne({_id: chatId, userId});

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
        });

        //^ Build conversation context for Gemini prompt builder (text-only, last 20)
        const textHistory = chat.messages
            .filter(msg => !msg.isImage)
            .slice(-20)
            .map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            }));

        //^ Ask Gemini to create an optimized image prompt based on full context
        const promptBuilder = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: textHistory,
            config: {
                systemInstruction: `You are an image prompt builder. Your job is to create a single, detailed image generation prompt based on the user's latest message.

RULES:
1. Focus PRIMARILY on the user's latest message — that is the main subject.
2. Only use previous messages as context if the latest message is clearly a modification, correction, or continuation of the SAME topic/subject (e.g., "make it blue", "change the background", "add rain to it").
3. If the latest message is about a DIFFERENT topic than previous messages, IGNORE all previous messages entirely and treat it as a fresh, standalone prompt.
4. NEVER combine or merge subjects from different unrelated prompts (e.g., if one prompt was about "Ironman" and the next about "Thor", do NOT create an image with both).
5. Output ONLY the image description prompt — no explanations, no formatting, no quotes, no prefixes.
6. Make the prompt vivid, detailed, and descriptive for best image generation results.`
            }
        });

        const enhancedPrompt = promptBuilder.text.trim();

        //~ Encode the enhanced Prompt
        const encodedPrompt = encodeURIComponent(enhancedPrompt);

        //~ Construct Imagekit AI Generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/sharpgpt/${Date.now()}.png?tr=w-800,h-800`;

        //~ Trigger Generation by Fetching from Imagekit
        const aiImageResponse = await axios.get(generatedImageUrl, {
            responseType: "arraybuffer"
        })

        //~ Convert to base_64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString("base64")}`;

        //~ Upload to Imagekit Media Library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "sharpgpt"
        })

        const reply = { 
            role: "assistant", 
            content: uploadResponse.url,
            timestamp: Date.now(), 
            isImage: true,
            isPublished
        }

        res.json({ success: true, reply })

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id: userId}, { $inc: {credits: -2}});

    } catch (error) {
        console.log("Image Message Error:", error.message);
        console.log("Full Error:", error?.status, error?.error || error);
        return res.json({ success: false, message: "Something went wrong, please try again." });
    }
}
