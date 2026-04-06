import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets.js';
import Message from './Message.jsx';
import toast from 'react-hot-toast';
import { SendHorizontal, Sparkles, Palette, BrainCircuit } from 'lucide-react';

import Lightbox from './Lightbox.jsx';

const Chatbox = () => {

  const {selectedChat, theme, user, axios, config, setUser} = useAppContext();

  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text"); // "text" or "image"
  const [isPublished, setIsPublished] = useState(false);
  
  // Lightbox State
  const [lightboxData, setLightboxData] = useState({ open: false, url: '', prompt: '' });

  const inspirationCards = [
    { title: "Quantum Dreams", prompt: "Explain quantum entanglement like I'm five.", icon: <Sparkles className="w-6 h-6 text-purple-400" /> },
    { title: "Masterpiece", prompt: "Generate a cyberpunk neon city in the rain, 8k, cinematic.", icon: <Palette className="w-6 h-6 text-pink-400" /> },
    { title: "Logical Zen", prompt: "Provide a 5-step strategy to improve daily focus.", icon: <BrainCircuit className="w-6 h-6 text-blue-400" /> }
  ];

  const onSubmitHandler = async (e) => {
    try {
      if(e) e.preventDefault();
      if(!user) return toast("Login to Send Message");
      if(!prompt.trim()) return;

      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");
      if (textareaRef.current) textareaRef.current.style.height = 'auto';

      setMessages(prev => [...prev, { role: "user", content: promptCopy, timestamp: Date.now(), isImage: false, }])

      const {data} = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, prompt: promptCopy, isPublished}, config)

      if(data.success)
      {
        setMessages(prev => [...prev, data.reply]);
        if(mode === "image")
        {
          setUser(prev => ({...prev, credits: prev.credits - 2}))
        }
        else
        {
          setUser(prev => ({...prev, credits: prev.credits - 1}))
        }
      }
      else
      {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      console.error("Message Error:", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Textarea Auto-grow
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  useEffect(() => {
    if(selectedChat)
    {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat])

  useEffect(() => {
    if(containerRef.current)
    {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, loading])

  return (
    <div className="flex-1 flex flex-col h-full w-full max-w-5xl mx-auto relative px-4">
      {/* Lightbox Component */}
      <Lightbox
        image={lightboxData.url}
        prompt={lightboxData.prompt}
        onClose={() => setLightboxData({...lightboxData, open: false, url: ""})}
      />

      {/* Chat Messages Area */}
      <div
        ref={containerRef}
        className="flex-1 py-8 overflow-y-auto scrollbar-hide space-y-4"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center animate-fade-up px-4">
            <img
              src={theme === "dark" ? assets.gpt_main_dark : assets.gpt_main_removebg}
              className="w-full max-w-64 mb-6 opacity-80"
              alt="SHARP GPT"
            />

            <h2 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent pb-2 mb-4 text-center tracking-tight dark:from-white not-dark:from-black not-dark:to-black/30">
              Design Your Intelligence.
            </h2>
            <p className="text-white/20 dark:text-white/20 not-dark:text-black/20 text-sm mb-12 text-center max-w-sm font-medium">
              Select a mode and begin your creative journey with SHARP GPT.
            </p>

            {/* Inspiration Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {inspirationCards.map((card, i) => (
                <div
                  key={i}
                  onClick={() => setPrompt(card.prompt)}
                  className="bg-white/5 dark:bg-white/5 not-dark:bg-gray-50 p-5 rounded-2xl border border-white/5 dark:border-white/5 not-dark:border-gray-200 hover:border-purple-500/30 cursor-pointer group transition-all active:scale-95 shadow-sm hover:shadow-md"
                >
                  <span className="mb-2 block">{card.icon}</span>
                  <h4 className="text-white dark:text-white not-dark:text-black font-bold text-xs mb-1">
                    {card.title}
                  </h4>
                  <p className="text-[10px] text-white/30 dark:text-white/30 not-dark:text-black/30 line-clamp-2 leading-relaxed">
                    {card.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            onImageClick={(url, pr) =>
              setLightboxData({open: true, url, prompt: pr || message.content})
            }
          />
        ))}

        {/* Shimmer Loading State */}
        {loading && (
          <div className="flex items-start gap-4 my-6 opacity-70">
            <div className="w-24 h-10 bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-2xl rounded-tl-none shimmer-loading overflow-hidden" />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="pb-4 pt-2 bg-transparent w-full">
        {/* Publish Checkbox (Only for Image Mode) */}
        {mode === "image" && (
          <div className="flex justify-center mb-2 animate-fade-up">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 dark:bg-white/5 not-dark:bg-gray-100 rounded-full border border-white/5 dark:border-white/5 not-dark:border-gray-200 cursor-pointer hover:bg-white/10 transition-all">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded accent-purple-500 cursor-pointer"
                onChange={(e) => setIsPublished(e.target.checked)}
                checked={isPublished}
              />
              <span className="text-[10px] text-white/40 dark:text-white/40 not-dark:text-black/60 font-bold uppercase tracking-widest">
                Publish to community gallery
              </span>
            </label>
          </div>
        )}

        <form
          onSubmit={onSubmitHandler}
          className="relative max-w-4xl mx-auto bg-white/5 dark:bg-white/5 not-dark:bg-white border border-white/10 dark:border-white/10 not-dark:border-gray-200 rounded-3xl p-1.5 pr-2.5 flex items-end gap-2 focus-within:border-purple-500/40 transition-all shadow-2xl"
        >
          {/* Mode Switcher */}
          <div className="flex bg-black/20 dark:bg-black/20 not-dark:bg-gray-100 p-1 rounded-2xl self-center ml-1 border border-white/5 dark:border-white/5 not-dark:border-gray-200">
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === "text" ? 'bg-white text-black shadow-lg scale-105' : 'text-white/30 dark:text-white/30 not-dark:text-black/40 hover:text-white dark:hover:text-white not-dark:hover:text-black'}`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setMode("image")}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === "image" ? 'bg-white text-black shadow-lg scale-105' : 'text-white/30 dark:text-white/30 not-dark:text-black/40 hover:text-white dark:hover:text-white not-dark:hover:text-black'}`}
            >
              Image
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmitHandler();
              }
            }}
            placeholder={mode === "text" ? "Message SHARP GPT..." : "Imagine amazing things..."}
            className="flex-1 bg-transparent border-none outline-none text-white/80 dark:text-white/80 not-dark:text-black/80 text-sm py-3 px-3 scrollbar-hide resize-none leading-relaxed"
            required
          />

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all mb-0.5 shrink-0 ${loading || !prompt.trim() ? "opacity-20 cursor-not-allowed" : 'bg-[#57317C] dark:bg-[#57317C] text-white hover:bg-purple-700 hover:scale-105 active:scale-95 shadow-xl cursor-pointer shadow-purple-500/10'}`}
          >
            <SendHorizontal className='w-5 h-5' />
          </button>
        </form>

        <p className="text-[9px] text-center text-white/10 dark:text-white/20 not-dark:text-black/20 mt-2 uppercase tracking-widest font-medium">
          SHARP GPT is AI and can make mistakes. Please double-check Responses.
        </p>
      </div>
    </div>
  );
}

export default Chatbox
