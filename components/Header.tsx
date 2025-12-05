import React from 'react';

interface HeaderProps {
  isMuted: boolean;
  toggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMuted, toggleMute }) => {
  return (
    <header className="sticky top-0 z-20 bg-opacity-60 backdrop-blur-xl border-b border-white/5 bg-[#030014]/40">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 group cursor-default">
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-fuchsia-500 rounded-full opacity-60 blur-md group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="relative w-full h-full bg-black/50 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <span className="text-white font-display font-bold text-lg">A</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-fuchsia-200 tracking-wider">AURA</h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
           <button 
            onClick={toggleMute}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              isMuted 
                ? 'bg-white/5 text-slate-400 hover:bg-white/10' 
                : 'bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/20 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
            }`}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : (
               <div className="relative flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
               </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};