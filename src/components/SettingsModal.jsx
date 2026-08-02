import React, { useState } from 'react';
import { X, Key, Sliders, Server, Save } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, config, onSaveConfig }) => {
  const [formData, setFormData] = useState(config || {
    mistralApiKey: '',
    defaultModel: 'mistral-tiny',
    temperature: 0.7,
    maxTokens: 2048,
    enableSwarm: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-100">System Configuration</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" /> Mistral API Key
            </label>
            <input
              type="password"
              name="mistralApiKey"
              value={formData.mistralApiKey}
              onChange={handleChange}
              placeholder="Enter your Mistral API key..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" /> Primary Model
            </label>
            <select
              name="defaultModel"
              value={formData.defaultModel}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="open-mistral-7b">Open Mistral 7B</option>
              <option value="mistral-small-latest">Mistral Small</option>
              <option value="mistral-medium-latest">Mistral Medium</option>
              <option value="mistral-large-latest">Mistral Large</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">Temperature</label>
              <span className="text-xs font-mono text-emerald-400">{formData.temperature}</span>
            </div>
            <input
              type="range"
              name="temperature"
              min="0"
              max="1"
              step="0.1"
              value={formData.temperature}
              onChange={handleChange}
              className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-300">Enable Agent Swarm Routing</span>
              <input
                type="checkbox"
                name="enableSwarm"
                checked={formData.enableSwarm}
                onChange={handleChange}
                className="w-4 h-4 accent-emerald-500 rounded border-slate-800 bg-slate-950"
              />
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
