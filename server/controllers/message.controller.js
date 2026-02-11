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

<<<<<<< HEAD
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
=======
        const {choices} = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
>>>>>>> d6973a2d66346cbfb437c9403ad5c540bb5ae600
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

        //~ Encode the Prompt
        const encodedPrompt = encodeURIComponent(prompt);

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
