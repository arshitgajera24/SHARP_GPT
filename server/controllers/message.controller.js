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
            model: "gemini-3-flash-preview",
            contents: history,
        });

        const reply = { role: "assistant", content: response.text, timestamp: Date.now(), isImage: false }

        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save();
        await User.updateOne({_id: userId}, { $inc: {credits: -1}});

    } catch (error) {
        console.log("Text Message Error:", error.message);
        console.log("Full Error:", error?.status, error?.error || error);
        return res.json({ success: false, message: error.message });
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
            model: "gemini-3-flash-preview",
            contents: textHistory,
            config: {
                systemInstruction: "You are an image prompt builder. Based on the conversation history and the latest user message, create a single, detailed, descriptive image generation prompt. Output ONLY the prompt text, nothing else — no explanations, no formatting, no quotes, no prefixes. If the user is referring to a previous image or wants modifications to a previously described image, incorporate all the relevant context into one complete, standalone image description prompt that can generate the desired image from scratch."
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
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
