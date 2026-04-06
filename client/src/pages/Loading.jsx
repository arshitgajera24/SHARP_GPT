import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';

const Loading = () => {

    const navigate = useNavigate();
    const { fetchUser } = useAppContext();

    useEffect(() => {
        const timeOut = setTimeout(() => {
          fetchUser();
          navigate("/");
        }, 8000)

        return () => clearTimeout(timeOut);
    }, [])

  return (
    <div className='bg-linear-to-b from-[#531B81] to-[#29184B] flex flex-col items-center justify-center h-screen w-screen text-white'>
        <div className='relative flex items-center justify-center mb-6'>
            {/* Simple Spinner */}
            <div className='w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin'></div>
            {/* Inner Glow */}
            <div className='absolute w-12 h-12 rounded-full border border-purple-400/30 blur-sm animate-pulse-purple'></div>
        </div>
        
        <div className='flex flex-col items-center gap-2 animate-fade-up'>
             <p className='text-xs tracking-[0.4em] font-light text-purple-200/60 uppercase'>
                Almost there...
            </p>
            <div className='w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-400/20 to-transparent'></div>
        </div>
    </div>
  )
}

export default Loading

