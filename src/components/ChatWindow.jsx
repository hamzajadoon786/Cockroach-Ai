import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { MessageItem } from './MessageItem';
import { InputBox } from './InputBox';
import { Sparkles, Code, Image as ImageIcon, Zap } from 'lucide-react';

export const ChatWindow = () => {
  const { activeChat, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const quickPrompts = [
    { icon: <Code className="w-4 h-4 text-brand-500" />, title: 'Write Full Stack Code', prompt: 'Write a modern React component using Tailwind CSS.' },
    { icon: <ImageIcon className="w-4 h-4 text-purple-400" />, title: 'Generate AI Artwork', prompt: 'Cyberpunk cityscape illuminated with neon rain lights' },
    { icon: <Zap className="w-4 h-4 text-amber-400" />, title: 'Explain Complex Topic', prompt: 'Explain quantum computing to a 10-year-old in simple terms.' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-bg overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-border">
        {!activeChat || activeChat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mb-6 shadow-xl shadow-brand-600/10">
              <Sparkles className="w-8 h-8 text-brand-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Cockroach AI</h2>
            <p className="text-sm text-gray-400 max-w-md mb-8">
              Your high-performance multimodal workspace for coding, text synthesis, and high-resolution image creation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.prompt, item.title.includes('Artwork'))}
                  className="p-4 rounded-xl border border-dark-border bg-dark-card/50 hover:bg-dark-hover hover:border-gray-700 text-left transition-all group"
                >
                  <div className="mb-2">{item.icon}</div>
                  <div className="text-xs font-semibold text-white group-hover:text-brand-500 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-gray-500 line-clamp-2 mt-1">{item.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-transparent">
            {activeChat.messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <InputBox />
    </div>
  );
};
