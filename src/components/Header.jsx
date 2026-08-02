import React from 'react';
import { Bug, Sliders, Plus, ShieldCheck, Terminal, Sparkles } from 'lucide-react';

const Header = ({ 
  currentSession, 
  activeAgent, 
  onNewChat, 
  onOpenSettings,
  isGenerating 
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Active Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Bug className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-wide flex items-center gap-2">
              Cockroach AI
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                v2.0-swarm
              </span>
            </h1>
            <p className="text-xs text-slate-400 truncate max-w-[200px] md:max-w-[300px]">
              {currentSession ? currentSession.title : 'No active session'}
            </p>
          </div>
        </div>

        <div className="hidden lg:block h-6 w-px bg-slate-800" />

        {/* Active Specialist Agent Display */}
        {activeAgent && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Agent:</span>
            <span className="font-medium text-slate-200">{activeAgent.name}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* New Session Button */}
        <button
          onClick={onNewChat}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* System Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-emerald-400 font-medium">Ready</span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 rounded-xl transition-all hover:text-emerald-400"
          title="Open System Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
