import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const InputBar = ({ onSendMessage, isGenerating }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Cockroach AI anything..."
          rows={1}
          disabled={isGenerating}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-emerald-500 resize-none transition-all placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="absolute right-2 p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 rounded-lg transition-all shadow-md"
        >
          {isGenerating ? (
            <Sparkles className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default InputBar;
