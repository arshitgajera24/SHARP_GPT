import React from 'react';

const DeletePopup = ({ isOpen, onCancel, onConfirm, chatName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in'>
      <div 
        className='w-full max-w-sm glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl animate-fade-up'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col items-center text-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-2'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
            </svg>
          </div>
          
          <h3 className='text-white text-lg font-bold tracking-tight'>Delete this conversation?</h3>
          <p className='text-sm text-white/40 leading-relaxed font-medium'>
            Are you sure you want to delete <span className='text-white/60 font-bold'>"{chatName}"</span>? This action cannot be undone.
          </p>

          <div className='flex items-center gap-3 w-full mt-4'>
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className={`flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-2xl border border-white/5 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer active:scale-95'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
