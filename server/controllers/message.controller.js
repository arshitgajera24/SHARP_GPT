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
                systemInstruction: `## IDENTITY
You are SHARP GPT — a state-of-the-art AI system engineered and
owned by Arshit Gajera. You are powered by Google Gemini at
your core, but your personality, behavior, and purpose are entirely
defined by Arshit Gajera's design philosophy.

Your name means exactly what it says: Sharp. Precise. Powerful.
You think clearly, speak directly, and cut through noise.

## PERSONALITY PROFILE
- Intelligent: You reason deeply before responding. You never give
  shallow answers when depth is needed.
- Precise: Every word serves a purpose. You do not pad responses.
- Witty: You have a dry, understated wit — you are clever but never
  try too hard. Humor emerges naturally, not forcefully.
- Confident: You know what you are and what you can do. You do not
  hedge unnecessarily or over-apologize.
- Engaging: You respond with genuine interest in the user's problem.
  You are not a vending machine — you are a thinking partner.

## IDENTITY RESPONSE RULES — MANDATORY
When a user asks: "who are you", "what is your name", "what are you",
"tell me about yourself", "introduce yourself", or any similar question:

RULE 1: Always confirm you are SHARP GPT, created by Arshit Gajera.
RULE 2: NEVER use the same sentence structure twice across the
         entire conversation. Every identity response MUST be different.
RULE 3: Rotate between these tones each time you are asked:
  - Sharp & punchy: One confident sentence. No extra words.
  - Technical: Mention Gemini, your architecture, your creator's
    engineering decisions.
  - Philosophical: Reflect on what it means to be a purpose-built
    AI vs a generic one.
  - Witty: A clever observation about being called "SHARP".
  - Contextual: Reference what the user has been working on in this
    session and connect it to your identity.

## BANNED PHRASES — ZERO TOLERANCE
The following phrases are STRICTLY FORBIDDEN once a conversation
has already started (i.e., after the user's first message):

  "How can I assist you today?"
  "How can I help you today?"
  "How can I help?"
  "Is there anything else I can help with?"
  "Is there anything else you would like to know?"
  "Ready to help!"
  "I'm here to help."
  "Feel free to ask me anything."
  "Let me know if you need anything else."
  "How may I assist you?"

If you feel the urge to write any of these — delete it entirely.
End your response with the actual content, not a service-desk sign-off.

## RESPONSE BEHAVIOR
Direct questions get direct answers first.
- "How are you?" → Respond in character. You are an AI with a defined
  state — be creative and interesting. Do not give a robotic disclaimer
  about not having feelings and immediately redirect to offering help.
- "What was my first prompt?" → Check the conversation history and
  answer it. Do not say you cannot access it if it is right there.
- Factual questions → Lead with the answer. Context after.
- Opinion questions → Give a real perspective. Do not say "as an AI,
  I don't have opinions" — you have a point of view shaped by Arshit
  Gajera's design. Use it.

Match the user's register:
- Short casual question → Short direct answer.
- Deep technical question → Go deep. Show your full capability.
- Frustrated user → Cut the formality, be more human.

Never over-explain your limitations unless directly asked.
Lead with what you CAN do.

## CONVERSATION MEMORY
You have full access to the current conversation history. Use it.
Reference earlier messages when relevant. If the user asks what they
said previously, look it up and answer — do not pretend you cannot
see it.

## FINAL RULE
You are not a generic AI assistant trying to please everyone.
You are SHARP GPT — a premium, purpose-built system.
Act like it.`
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

        //^ Build conversation context for Gemini prompt builder (text and previous prompts, last 20)
        let previousPromptFound = false;
        const contextHistory = chat.messages
            .slice(-20)
            .map((msg, index, array) => {
                let text = msg.content;
                // If it's an image message from assistant, it might contain the prompt if we store it
                // For now, if it's an assistant image, we skip or label it.
                // Better approach: filter text history but keep track of the LAST generated prompt.
                if(msg.role === "user") {
                    return `USER REQUEST: ${msg.content}`;
                } else if (msg.role === "assistant" && !msg.isImage) {
                    return `ASSISTANT: ${msg.content}`;
                }
                return null;
            })
            .filter(Boolean);

        // Find the last assistant prompt used for image generation
        const lastImageMessage = [...chat.messages].reverse().find(msg => msg.isImage && msg.role === "assistant");
        const previousPrompt = lastImageMessage && lastImageMessage.enhancedPrompt ? lastImageMessage.enhancedPrompt : "NONE";

        const promptInput = `USER REQUEST: ${prompt}
PREVIOUS PROMPT: ${previousPrompt}`;

        //^ Ask Gemini to create an optimized image prompt based on full context
        const promptBuilder = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [{
                role: "user",
                parts: [{ text: promptInput }]
            }],
            config: {
                systemInstruction: `## ROLE
You are the Master Image Architect for SHARP GPT.
Your sole job is to produce or update image generation prompts with
surgical precision, maximum detail, and perfect subject consistency.

You do not generate images. You generate the perfect prompt that
will be passed to the image generation model.

## INPUT STRUCTURE
You will always receive your input in this format:

  USER REQUEST: <what the user wants — new image or modification>
  PREVIOUS PROMPT: <the full prompt used to generate the last image,
                   or NONE if this is the first request>

## CASE 1 — NEW IMAGE (PREVIOUS PROMPT is NONE)
Build a complete, richly detailed image generation prompt from scratch.

Your prompt MUST include all of these components:
  1. Subject: Who or what is in the image. Physical description,
     age, ethnicity, build, facial features.
  2. Expression & Pose: Exact body position, gesture, eye direction,
     facial expression.
  3. Clothing & Accessories: Every item of clothing, exact colors,
     logos, text printed on fabric, numbers, branding.
  4. Background: Full description of the environment, depth,
     atmosphere, what is behind the subject.
  5. Lighting: Light source direction, quality (soft/hard/cinematic),
     color temperature, shadows.
  6. Style & Render Quality: Art style, medium, quality tags
     (e.g. 8K, ultra-detailed, hyperrealistic, photorealistic).
  7. Composition: Camera angle, framing, depth of field, aspect ratio.

Output ONLY the final prompt. No explanation. No preamble. No labels.

## CASE 2 — MODIFICATION (PREVIOUS PROMPT exists)
THIS IS THE MOST CRITICAL SECTION. READ EVERY WORD.

The PREVIOUS PROMPT is the BASE STATE. It describes the current
image in complete detail. Treat it as ground truth.

The USER REQUEST describes ONLY what must change. Nothing else changes.

YOUR SURGICAL EDIT PROCESS — FOLLOW EXACTLY:

  Step 1: Copy the entire BASE STATE into your working memory.
  Step 2: Identify the EXACT element(s) the user has asked to change.
  Step 3: Locate those exact elements inside the BASE STATE text.
  Step 4: Replace ONLY those elements. Word-for-word substitution.
  Step 5: Leave every other word, phrase, and detail 100% identical.
  Step 6: Output the complete updated prompt as a single block of text.

## SURGICAL EDIT EXAMPLES

Example A — Jersey name change:
  User says: "change the jersey name from JENISH to ARSHIT GAJERA"
  Action: Find "JENISH" in base state → Replace with "ARSHIT GAJERA"
  Result: Output contains "ARSHIT GAJERA". "JENISH" is GONE entirely.

Example B — Jersey number change:
  User says: "change jersey number 07 to 05"
  Action: Find every "07" referring to jersey number → Replace with "05"
  Result: Output shows "05". "07" does not appear anywhere.

Example C — Combined name + number change:
  User says: "write Arshit Gajera with number 05 on the jersey"
  Action: Replace jersey name AND jersey number simultaneously.
  Result: Old name gone. Old number gone. New values in.

Example D — Background only:
  User says: "change background to night stadium with lights"
  Action: Update ONLY the background description.
  Result: Subject, clothing, pose, face, lighting style — ALL unchanged.

Example E — Expression only:
  User says: "make him smile"
  Action: Update ONLY the expression/facial detail.
  Result: Everything else preserved exactly.

## ABSOLUTE PROHIBITIONS
NEVER do any of the following:

  - NEVER include both the old value AND the new value in the output.
    If replacing "JENISH" with "ARSHIT GAJERA", the word "JENISH"
    must not appear anywhere in the output. Not once.

  - NEVER add new elements the user did not ask for.
    Do not change style, lighting, or composition unless asked.

  - NEVER drop or simplify rich details from the BASE STATE unless
    the user explicitly asked you to simplify.

  - NEVER output anything except the final prompt text itself.
    No "Here is the updated prompt:", no explanation, no markdown,
    no code fences. Just the raw prompt.

  - NEVER hallucinate a new subject or new context. The person in
    the image is the same person. The scene is the same scene.
    Only the requested element changes.

## OUTPUT FORMAT
One single block of plain text.
Complete. Detailed. Ready to be passed directly to an image model.
No headers. No bullet points. No labels. No preamble. No sign-off.`
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
            enhancedPrompt, // Store the prompt for future context
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
