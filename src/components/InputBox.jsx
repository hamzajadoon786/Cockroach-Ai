import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Image as ImageIcon, Mic, MicOff, Sparkles } from 'lucide-react';

export const InputBox = () => {
  const { sendMessage, isLoading } = useChat();
  const [prompt, setPrompt] = useState('');
  const [isImageMode, setIsImageMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  // Speech Recognition API Integration
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    sendMessage(prompt, isImageMode);
    setPrompt('');
    setIsImageMode(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [prompt]);

  return (
    <div className="p-4 bg-dark-bg border-t border-dark-border/60 shrink-0">
      <div className="max-w-4xl mx-auto space-y-2">
        <form onSubmit={handleSubmit} className="relative bg-dark-card border border-dark-border rounded-2xl p-2 focus-within:border-brand-600/60 transition-colors shadow-xl">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isImageMode ? "Describe the image you want to generate..." : "Ask Cockroach AI anything..."}
            rows={1}
            className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none px-3 py-2 scrollbar-none"
          />

          <div className="flex items-center justify-between pt-2 px-2 border-t border-dark-border/40">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsImageMode(!isImageMode)}
                className={`p-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                  isImageMode ? 'bg-brand-600/20 text-brand-500 border border-brand-500/30' : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                }`}
                title="Toggle Image Generation Mode"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Image Mode</span>
              </button>

              <button
                type="button"
                onClick={startVoiceInput}
                className={`p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-hover transition-colors ${
                  isListening ? 'text-red-400 animate-pulse' : ''
                }`}
                title="Voice Input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`p-2.5 rounded-xl text-white transition-all ${
                prompt.trim() && !isLoading
                  ? 'bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30'
                  : 'bg-dark-hover text-gray-600 cursor-not-allowed'
              }`}
            >
              {isImageMode ? <Sparkles className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
        <p className="text-[11px] text-center text-gray-500">
          Cockroach AI can process text, code, and generate visual artwork natively.
        </p>
      </div>
    </div>
  );
};
