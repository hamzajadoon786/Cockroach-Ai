import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Volume2, User, Sparkles, Image as ImageIcon } from 'lucide-react';
import { copyToClipboard, speakText, formatTime } from '../utils/helpers';

export const MessageItem = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`py-6 px-4 md:px-6 transition-colors ${isUser ? 'bg-transparent' : 'bg-dark-card/40 border-y border-dark-border/40'}`}>
      <div className="max-w-4xl mx-auto flex space-x-4">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-sm ${
          isUser ? 'bg-gray-700 text-white' : 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
        }`}>
          {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">
              {isUser ? 'You' : 'Cockroach AI'}
            </span>
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          </div>

          {/* Image Deliverable */}
          {message.type === 'image' && message.imageUrl ? (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-gray-300">{message.content}</p>
              <div className="relative group max-w-lg rounded-xl overflow-hidden border border-dark-border bg-dark-bg">
                <img
                  src={message.imageUrl}
                  alt="Generated Content"
                  className="w-full h-auto object-cover rounded-xl"
                  loading="lazy"
                />
                <a
                  href={message.imageUrl}
                  download="cockroach-ai-generated.png"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-3 right-3 bg-dark-bg/80 hover:bg-dark-bg text-white p-2 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Download High-Res Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            /* Text & Code Rendering */
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <div className="relative my-4 rounded-xl overflow-hidden border border-dark-border bg-dark-bg">
                        <div className="flex items-center justify-between px-4 py-1.5 bg-dark-card text-xs text-gray-400 font-mono border-b border-dark-border">
                          <span>{match ? match[1] : 'code'}</span>
                          <button
                            onClick={() => copyToClipboard(String(children))}
                            className="hover:text-white flex items-center space-x-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto font-mono text-xs text-brand-100">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className="bg-dark-hover text-brand-500 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content || '...'}
              </ReactMarkdown>
            </div>
          )}

          {/* Quick Action Toolbar */}
          {!isUser && message.content && (
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-white text-xs flex items-center space-x-1 transition-colors"
                title="Copy Text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => speakText(message.content)}
                className="text-gray-500 hover:text-white text-xs flex items-center space-x-1 transition-colors"
                title="Speak Output"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
