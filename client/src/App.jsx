import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from "react-router-dom"
import Chatbox from './components/Chatbox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets.js'
import "./assets/prism.css"
import Loading from './pages/Loading.jsx'
import Login from './pages/Login.jsx'
import { useAppContext } from './context/AppContext.jsx'
import {Toaster} from "react-hot-toast"

const App = () => {

  const { user, loadingUser } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation();

  if(pathname === "/loading" || loadingUser) return <Loading />

  return (
    <>
    <Toaster />
      
      {user ? (
        <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className="flex h-screen w-screen">
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<Chatbox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
      ) : (
        <div className='relative overflow-hidden bg-[#02040a] flex items-center justify-center h-screen w-screen'>
          {/* Superior Background Mesh */}
          <div className='absolute inset-0 bg-linear-to-tr from-[#1a0a2e] via-[#0d0416] to-[#1a0a2e] opacity-80' />
          
          {/* High-Visibility Animated Orbs with Refined Timing */}
          <div className='absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/25 rounded-full blur-[120px] animate-aurora [animation-duration:15s]' />
          <div className='absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/25 rounded-full blur-[120px] animate-aurora [animation-delay:4s] [animation-duration:20s]' />
          <div className='absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-magenta-500/15 rounded-full blur-[100px] animate-aurora [animation-delay:8s] [animation-duration:25s]' />

          {/* Superior Synchronized Travelling Particles */}
          <div className='absolute inset-0 pointer-events-none'>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className='absolute w-[3px] h-[3px] bg-white rounded-full animate-travel shadow-[0_0_10px_#A78BFA,0_0_20px_#A78BFA]'
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: '15s'
                }}
              />
            ))}
          </div>





          {/* Grainy Noise Overlay for Depth */}
          <div className='absolute inset-0 opacity-[0.04] pointer-events-none bg-[url("https://grainy-gradients.vercel.app/noise.svg")]' />
          
          <Login />
        </div>
      )}



      
    </>
  );
}

export default App
