import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import { 
  Bot, User, Volume2, VolumeX, Copy, Check, Menu, 
  ExternalLink, Sparkles, RefreshCw, FileText
} from 'lucide-react';

export default function ChatWindow({
  messages = [],
  isLoading = false,
  onSpeak,
  isSpeaking,
  onStopVoice,
  setSidebarOpen,
  activeTab
}) {
  const chatEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Top Bar Header */}
      <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-4 md:px-6 bg-slate-900/40 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500 animate-pulse" />
            <h2 className="font-semibold text-slate-200 capitalize text-sm md:text-base tracking-wide">
              {activeTab} Mode
            </h2>
          </div>
        </div>

        {isSpeaking && (
          <button
            onClick={onStopVoice}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold animate-pulse"
          >
            <VolumeX size={14} /> Stop Voice
          </button>
        )}
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 md:gap-4 max-w-4xl mx-auto ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`p-2.5 rounded-xl shrink-0 ${
              msg.role === 'user' 
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                : 'bg-slate-900 text-amber-500 border border-slate-800 shadow-sm'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Content Box */}
            <div className={`flex flex-col gap-1.5 max-w-[88%] md:max-w-[78%] ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              
              {/* Image Attachments / Upload Previews */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {msg.attachments.map((att, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800">
                      {att.type.startsWith('image/') ? (
                        <img src={att.url} alt="Attachment" className="h-32 w-auto object-cover rounded-xl" />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-slate-900 text-xs text-slate-300 rounded-xl border border-slate-800">
                          <FileText size={16} className="text-amber-500" />
                          <span className="truncate max-w-[150px]">{att.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Main Message Bubble */}
              <div className={`group relative p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-none shadow-sm'
              }`}>
                {/* AI Generated Image Render */}
                {msg.imageUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
                    <img src={msg.imageUrl} alt="AI Generated" className="w-full h-auto max-h-96 object-cover" />
                  </div>
                )}

                {/* Markdown Text Render */}
                <div className="markdown-body font-sans">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Web Search Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 w-full mb-1">Sources:</span>
                    {msg.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] text-amber-400 border border-slate-700/50 transition"
                      >
                        <ExternalLink size={12} /> {src.title || 'Web Link'}
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions Toolbar (Copy & Voice Read) */}
                <div className={`absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition ${
                  msg.role === 'user' ? 'text-slate-950' : 'text-slate-400'
                }`}>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => onSpeak(msg.content)}
                      className="p-1.5 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                      title="Read aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="p-1.5 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-500 font-mono px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center gap-3 max-w-4xl mx-auto text-amber-500/90 text-xs font-mono italic">
            <RefreshCw size={15} className="animate-spin" />
            Cockroach AI Engine Processing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
            }
