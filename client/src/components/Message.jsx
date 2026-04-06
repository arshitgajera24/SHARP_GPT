import Prism from "prismjs"
import { Copy, Check, Download, X } from "lucide-react"
import { useState, useEffect } from "react"
import Markdown from "react-markdown"
import moment from "moment"
import { assets } from "../assets/assets"

const Message = ({message, onImageClick}) => {

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='animate-fade-up'>
      {
        message.role === "user" ? (
          <div className='flex items-start justify-end my-3 gap-3 group'>
            <div className='flex flex-col gap-1 p-2 px-4 bg-white/5 dark:bg-white/5 not-dark:bg-gray-100/80 border border-white/5 dark:border-white/5 not-dark:border-gray-200/50 rounded-2xl rounded-tr-none max-w-[85%] md:max-w-xl transition-all hover:bg-white/8 relative'>
              <p className='text-sm dark:text-primary not-dark:text-black/80 leading-relaxed'>{message.content}</p>
              
              <div className='flex items-center justify-between gap-4 mt-0.5 opacity-60'>
                <span className='text-[9px] text-gray-500 dark:text-[#B1A6C0] font-bold uppercase tracking-widest'>{moment(message.timestamp).fromNow()}</span>
                
                {/* Action Bar */}
                <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button onClick={copyToClipboard} className='p-0.5 hover:bg-white/10 rounded cursor-pointer transition-all'>
                    {copied ? (
                      <Check className='text-green-500 w-3 h-3 font-bold' />
                    ) : (
                      <Copy className='text-gray-400 w-3 h-3' />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <img src={assets.user_icon} className='w-7 h-7 rounded-full border border-purple-500/10 mt-1' alt="" />
          </div>
        ) : (
          <div className='flex items-start justify-start my-3 gap-3 group'>
            <div className='inline-flex flex-col gap-1 p-2 px-3.5 max-w-[85%] md:max-w-xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-2xl rounded-tl-none transition-all hover:border-purple-500/30'>
              {
                message.isImage ? (
                  <div 
                    className='relative group/img cursor-pointer' 
                    onClick={() => onImageClick && onImageClick(message.content, message.prompt)}
                  >
                    <img src={message.content} className='w-full max-w-sm rounded-xl transition-all group-hover/img:brightness-110' alt="" />
                    <div className='absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center rounded-xl'>
                       <div className='p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20'>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                         </svg>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className='text-sm dark:text-primary leading-relaxed reset-tw'>
                    <Markdown>{message.content}</Markdown>
                  </div>
                )
              }
              
              <div className='flex items-center justify-between gap-4 mt-0.5 opacity-60'>
                <span className='text-[9px] text-gray-500 dark:text-[#B1A6C0] font-bold uppercase tracking-widest'>{moment(message.timestamp).fromNow()}</span>
                
                {/* Action Bar */}
                <div className='flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                   <button onClick={copyToClipboard} className='p-0.5 hover:bg-white/10 rounded cursor-pointer transition-all' title="Copy">
                    {copied ? (
                      <Check className='text-green-500 w-3 h-3 font-bold' />
                    ) : (
                      <Copy className='text-white/40 w-3 h-3' />
                    )}
                   </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Message;
