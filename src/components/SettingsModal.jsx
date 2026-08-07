import React from 'react';
import { useChat } from '../context/ChatContext';
import { X, Key, Sliders, Trash2, ShieldCheck } from 'lucide-react';
import { API_CONFIG } from '../config/api';

export const SettingsModal = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    setSettings,
    mistralApiKey,
    setMistralApiKey,
    hfApiKey,
    setHfApiKey,
    clearAllChats
  } = useChat();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-white">Settings & Keys</h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* API Keys */}
          <div className="space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              <span>API Credentials</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-300">Mistral AI Key</label>
              <input
                type="password"
                value={mistralApiKey}
                onChange={(e) => setMistralApiKey(e.target.value)}
                placeholder="Enter Mistral API Key"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-300">Hugging Face Key (Image Generation)</label>
              <input
                type="password"
                value={hfApiKey}
                onChange={(e) => setHfApiKey(e.target.value)}
                placeholder="Enter Hugging Face API Key"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs text-gray-300">Default Intelligence Model</label>
            <select
              value={settings.selectedModel}
              onChange={(e) => setSettings({ ...settings, selectedModel: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {Object.entries(API_CONFIG.MODELS).map(([key, val]) => (
                <option key={key} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* System Prompt Customization */}
          <div className="space-y-2">
            <label className="text-xs text-gray-300">System Persona / Instructions</label>
            <textarea
              rows={3}
              value={settings.systemPrompt}
              onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Clear Cache */}
          <div className="pt-3 border-t border-dark-border">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all chat history?')) {
                  clearAllChats();
                  setIsSettingsOpen(false);
                }
              }}
              className="w-full py-2 px-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Chat History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
