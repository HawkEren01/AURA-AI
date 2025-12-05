import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputArea } from './components/InputArea';
import { Message, Role } from './types';
import { sendMessageToGemini, initializeChat } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hello, I am AURA. Systems are online and ready to assist you."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    initializeChat();
    
    // Initial welcome, but wait for voices to load
    const speakWelcome = () => {
       speak("Hello, I am AURA. Systems are online.");
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      speakWelcome();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        speakWelcome();
        // Remove listener to avoid repeating on every voice change
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
    
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (isMuted) return;
    
    // Cancel previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Prefer Google US English or similar standard voices for a AURA-like feel
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                           voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) ||
                           voices.find(v => v.lang === 'en-US') || 
                           voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.pitch = 1.0; 
    utterance.rate = 1.0;
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  const handleSendMessage = async (text: string, image?: string) => {
    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      role: Role.USER,
      text,
      image
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    window.speechSynthesis.cancel(); // Stop speaking if user interrupts

    try {
      const aiMessageId = (Date.now() + 1).toString();
      const initialAiMessage: Message = {
        id: aiMessageId,
        role: Role.MODEL,
        text: '',
        isThinking: true
      };
      setMessages(prev => [...prev, initialAiMessage]);

      const stream = await sendMessageToGemini(text, image);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, text: fullText, isThinking: false } 
              : msg
          )
        );
      }

      // Speak the full response once done
      if (fullText) {
        speak(fullText);
      }
      
    } catch (error) {
      console.error("Error communicating with AURA:", error);
      const errorMsg = "I apologize, connection interrupted. Please try again.";
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: Role.MODEL, 
          text: errorMsg 
        }
      ]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen text-slate-200 font-sans selection:bg-purple-500/30 selection:text-white relative z-10">
      
      <Header isMuted={isMuted} toggleMute={toggleMute} />
      
      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar scroll-smooth">
        <div className="max-w-5xl mx-auto flex flex-col justify-end min-h-full py-4 pb-20">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isLoading && messages[messages.length - 1]?.role !== Role.MODEL && (
             <div className="flex justify-start w-full mb-8 animate-pulse">
                <div className="flex gap-4 max-w-[85%] items-center">
                   <div className="w-10 h-10 rounded-full bg-[#1c1c3d] flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                     <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="h-px w-8 bg-purple-500/30"></span>
                     <span className="text-xs font-display tracking-widest text-purple-400 uppercase">Processing</span>
                   </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      <InputArea onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default App;