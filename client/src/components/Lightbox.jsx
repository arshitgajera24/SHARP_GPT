import React, { useState, useRef } from 'react';
import { assets } from '../assets/assets';
import { Download, X } from 'lucide-react';

const Lightbox = ({ image, onClose, prompt }) => {
  if (!image) return null;

  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef(null);

  // React-powered Download Logic using Blobs
  const handleDownload = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sharp-gpt-${Date.now()}.png`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl transition-all duration-300 ${image ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      {/* Brilliant White Close Button */}
      <button 
        onClick={onClose}
        className='absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer z-60 group text-white'
      >
        <X className='w-5 h-5' />
      </button>

      <div className='flex flex-col items-center gap-6 w-full h-full max-w-5xl justify-center'>
        {/* Main Image Container */}
        <div 
          className='relative flex-1 flex items-center justify-center overflow-hidden w-full'
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            ref={imgRef}
            src={image} 
            alt="Generated Result" 
            className={`max-w-full max-h-[70vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Refined Control Bar */}
        <div 
          className='w-full max-w-lg glass-dark px-6 py-3 rounded-full animate-slide-down border border-white/10 shadow-2xl flex items-center justify-between gap-4'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex flex-col'>
            <h3 className='text-white text-xs font-bold tracking-tight'>Visual Intelligence Output</h3>
            <p className='text-[9px] text-white/30 uppercase tracking-widest font-black'>1024 x 1024 • PNG</p>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
            className='flex items-center gap-2 px-6 py-2 bg-white text-black text-xs font-black rounded-full hover:bg-gray-200 transition-all cursor-pointer active:scale-95 shadow-lg'
          >
            <Download className='w-4 h-4 text-black' strokeWidth={3} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
