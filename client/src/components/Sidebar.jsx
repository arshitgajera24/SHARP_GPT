import React, { useState, useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets.js';
import moment from "moment"
import toast from 'react-hot-toast';
import DeletePopup from './DeletePopup';
import { X, LayoutDashboard, Image as GalleryIcon, Settings, LogOut, Plus, Search, Diamond, Moon, Sun, Menu, Trash2, Gem } from 'lucide-react';

const Sidebar = ({ isMenuOpen, setIsMenuOpen}) => {

  const { chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, config, setChats, fetchUsersChat, setToken } = useAppContext();
  const [search, setSearch] = useState("");
  const [pulse, setPulse] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, chat: null, loading: false });
  const prevCreditsRef = useRef(user?.credits);

  useEffect(() => {
    if (user?.credits !== prevCreditsRef.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 2000);
      prevCreditsRef.current = user?.credits;
      return () => clearTimeout(timer);
    }
  }, [user?.credits]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null)
    toast.success("Log out Successfully");
  }

  const handleDeleteClick = (e, chat) => {
    e.stopPropagation();
    setDeleteModal({ open: true, chat, loading: false });
  }

  const confirmDelete = async () => {
    const chatId = deleteModal.chat?._id;
    if (!chatId) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      const {data} = await axios.post("/api/chat/delete", {chatId}, config);
      if(data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        await fetchUsersChat();
        toast.success(data.message);
        setDeleteModal({ open: false, chat: null, loading: false });
      } else {
        toast.error(data.message)
        setDeleteModal(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      toast.error(error.message);
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  }

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Toggle Button */}
      {!isMenuOpen && (
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className='absolute top-4 left-4 p-2 bg-white/5 dark:bg-white/5 not-dark:bg-black/5 rounded-xl border border-white/10 dark:border-white/10 not-dark:border-black/10 cursor-pointer md:hidden z-40 transition-all active:scale-90'
        >
          <Menu className='w-5 h-5 text-white dark:text-white not-dark:text-black' />
        </button>
      )}

      <div className={`flex flex-col h-screen min-w-[280px] w-72 not-dark:bg-white p-4 dark:bg-[#0c0c0c] border-r border-[#80609F]/30 backdrop-blur-lg dark:backdrop-blur-3xl transition-transform duration-500 max-md:fixed top-0 left-0 z-30 ${!isMenuOpen && "max-md:-translate-x-full"}`}>
        {/* Delete Confirmation Popup */}
        <DeletePopup 
          isOpen={deleteModal.open}
          chatName={deleteModal.chat?.messages[0]?.content.slice(0, 20) || deleteModal.chat?.name}
          isLoading={deleteModal.loading}
          onCancel={() => setDeleteModal({ open: false, chat: null, loading: false })}
          onConfirm={confirmDelete}
        />
        {/* Logo */}
        <img src={theme === "dark" ? assets.gpt_main_dark : assets.gpt_main_removebg} onClick={() => navigate("/")} alt="" className="w-full max-w-40 cursor-pointer mb-2" />

        {/* New Chat Button */}
        <button onClick={() => { createNewChat(); setIsMenuOpen(false); }} className='flex justify-center items-center w-full py-2 mt-4 text-white bg-linear-to-r from-[#A456F7] to-[#3D81F6] text-xs font-black rounded-xl cursor-pointer group transition-all active:scale-95 shadow-md shadow-purple-500/20'>
          <Plus className='mr-1.5 w-3.5 h-3.5' strokeWidth={3} /> New Chat
        </button>

        {/* Search Conversations */}
        <div className='flex items-center gap-2 px-3 py-1.5 mt-3 border border-gray-200 dark:border-white/5 rounded-xl focus-within:border-purple-500/40 bg-white/5 transition-all'>
          <Search className='w-3 h-3 text-gray-500' />
          <input type="text" onChange={(e) => setSearch(e.target.value)} value={search} placeholder='Search Intel...' className='text-[11px] placeholder:text-gray-600 outline-none w-full bg-transparent dark:text-white not-dark:text-black' />
        </div>

        {/* Recent Chats Section */}
        <div className='flex items-center justify-between mt-5 mb-2'>
           { chats.length > 0 && <p className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-500/80'>Intelligence History</p> }
        </div>

        <div className='flex-1 overflow-y-auto pr-1 text-sm space-y-1.5 scrollbar-hide'>
          {
            chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
              <div key={chat._id} onClick={() => { navigate("/"); setSelectedChat(chat); setIsMenuOpen(false); }} className='p-2 px-3 dark:bg-[#57317C]/5 border border-gray-100 dark:border-[#80609F]/10 rounded-xl cursor-pointer flex justify-between items-center group transition-all hover:border-purple-500/30 hover:bg-purple-500/5 select-none'>
                <div className='flex-1 min-w-0'>
                  <p className='truncate w-full dark:text-primary/90 not-dark:text-black/80 text-[12px] font-medium'>{chat.messages.length > 0 ? chat.messages[0].content : chat.name}</p>
                  <p className='text-[9px] text-gray-500/60 dark:text-[#B1A6C0]/50 font-bold uppercase tracking-wider'>{moment(chat.updatedAt).fromNow()}</p>
                </div>
                <Trash2 onClick={e => handleDeleteClick(e, chat)} className='w-3.5 h-3.5 text-red-500/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500' />
              </div>
            ))
          }
        </div>

        {/* Bottom Navigation Section */}
        <div className='mt-4 pt-4 border-t border-white/5 space-y-2'>
          {/* Community Images */}
          <div onClick={() => { navigate("/community"); setIsMenuOpen(false); }} className='flex items-center gap-2.5 px-3 py-2 border border-gray-100 dark:border-white/5 rounded-xl cursor-pointer hover:bg-white/5 transition-all group'>
            <GalleryIcon className='w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors' />
            <p className='text-[11px] font-bold dark:text-primary/70 not-dark:text-black/70'>Community Gallery</p>
          </div>

          {/* Credit/Intelligence */}
          <div 
            onClick={() => { navigate("/credits"); setIsMenuOpen(false); }} 
            className={`flex items-center gap-2.5 px-3 py-2 border border-gray-100 dark:border-white/5 rounded-xl cursor-pointer transition-all ${user?.credits < 10 ? 'animate-border-glow border-purple-500/50 bg-purple-500/5' : pulse ? 'pulse-glow border-purple-500/50 bg-purple-500/10' : 'hover:bg-white/5'}`}
          >
            <Gem className={`w-4 h-4 text-purple-500 transition-transform ${pulse || user?.credits < 10 ? 'scale-110' : ''}`} />
            <div className='flex flex-col'>
              <p className='text-[11px] font-black dark:text-primary not-dark:text-black'>Credits: {user?.credits}</p>
              <p className='text-[8px] text-gray-500/60 uppercase font-black tracking-widest'>
                {user?.credits < 10 ? "Purchase Credits to Continue" : "Available Access"}
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className='flex items-center justify-between px-3 py-2 border border-gray-100 dark:border-white/5 rounded-xl bg-white/5'>
            <div className='flex items-center gap-2.5'>
              {theme === 'dark' ? <Moon className='w-4 h-4 text-purple-400' /> : <Sun className='w-4 h-4 text-amber-500' />}
              <p className='text-[11px] dark:text-primary not-dark:text-black font-bold'>Dark Theme</p>
            </div>
            <label className='relative inline-flex cursor-pointer'>
              <input onChange={() => setTheme(theme === "dark" ? "light" : "dark")} type="checkbox" className='sr-only peer' checked={theme === "dark"} />
              <div className='w-8 h-4.5 bg-gray-200 dark:bg-white/10 rounded-full peer-checked:bg-purple-600 transition-all'></div>
              <span className='absolute left-1 top-1 w-2.5 h-2.5 bg-white dark:bg-white/40 rounded-full transition-transform peer-checked:translate-x-3.5 peer-checked:bg-white'></span>
            </label>
          </div>

          {/* User Profile */}
          <div className='flex items-center gap-3 p-2 px-3 border border-gray-100 dark:border-white/10 rounded-xl bg-white/5 group'>
            <img src={assets.user_icon} alt="" className='w-6 h-6 rounded-full border border-white/10' />
            <div className='flex-1 min-w-0'>
               <p className='text-[11px] dark:text-primary not-dark:text-black truncate font-black'>{user ? user.name : "Sign In"}</p>
               <p className='text-[9px] text-gray-500 truncate font-medium'>{user?.email}</p>
            </div>
            { user && <LogOut onClick={logout} className='w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-red-500 transition-colors' /> }
          </div>
        </div>

        <button 
          onClick={() => setIsMenuOpen(false)} 
          className='absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-full cursor-pointer md:hidden transition-all text-white'
        >
          <X className='w-4 h-4' />
        </button>
      </div>
    </>
  );

}

export default Sidebar
