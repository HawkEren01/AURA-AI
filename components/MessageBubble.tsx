import React from 'react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
      <div className={`flex max-w-[90%] sm:max-w-[80%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold transition-transform duration-300 group-hover:scale-105 ${
          isUser 
            ? 'bg-slate-800 text-slate-300 border border-slate-700' 
            : 'bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
        }`}>
          {isUser ? 'YOU' : 'AI'}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className={`relative px-6 py-4 text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap shadow-lg ${
            isUser 
              ? 'bg-[#1e1e2e]/80 text-white rounded-2xl rounded-tr-sm border border-white/10' 
              : 'bg-gradient-to-b from-white/10 to-white/5 text-slate-100 rounded-2xl rounded-tl-sm border border-white/5 backdrop-blur-md'
          }`}>
            
            {message.image && (
              <div className="mb-4 overflow-hidden rounded-lg border border-white/10">
                <img src={message.image} alt="Uploaded content" className="max-w-full h-auto max-h-80 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            
            <div className="font-light tracking-wide">
               {message.text}
            </div>
          </div>
          
          <span className={`text-[10px] mt-2 text-slate-500 font-medium opacity-0 group-hover:opacity-60 transition-opacity uppercase tracking-widest ${isUser ? 'text-right pr-1' : 'text-left pl-1'}`}>
            {isUser ? 'User' : 'AURA'}
          </span>
        </div>

      </div>
    </div>
  );
};