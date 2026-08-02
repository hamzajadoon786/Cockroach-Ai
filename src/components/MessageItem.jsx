import React, { useState } from 'react';
import { User, Cpu, Copy, Check, Terminal, Sparkles } from 'lucide-react';

const MessageItem = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`py-5 px-4 md:px-6 transition-colors ${
      isUser ? 'bg-slate-900/40' : 'bg-slate-950/60 border-y border-slate-800/40'
    }`}>
      <div className="max-w-4xl mx-auto flex gap-4 items-start">
        {/* Avatar / Role Icon */}
        <div className={`p-2.5 rounded-xl shrink-0 ${
          isUser 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
        }`}>
          {isUser ? <User className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {/* Header Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200 tracking-wide">
                {isUser ? 'You' : (message.agentName || 'Cockroach AI')}
              </span>
              {!isUser && message.agentRole && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {message.agentRole}
                </span>
              )}
              <span className="text-[10px] text-slate-500 font-mono">
                {formatTime(message.timestamp)}
              </span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copy Message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Text / Markdown Render Area */}
          <div className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
