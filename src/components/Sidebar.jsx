import React from 'react';
import { 
  Plus, MessageSquare, Code, Image as ImageIcon, Search, 
  Trash2, Settings, Cpu, X, Zap 
} from 'lucide-react';

export default function Sidebar({
  sessions = [],
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onOpenSettings
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Sidebar Component */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900/95 border-r border-slate-800/80 
        flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out backdrop-blur-md
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full space-y-5">
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20">
                <Cpu size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wider text-amber-500 leading-none">
                  COCKROACH AI
                </h1>
                <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ULTIMATE ENGINE
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition shadow-md shadow-amber-500/10 active:scale-[0.98]"
          >
            <Plus size={18} className="stroke-[2.5]" /> Start New Chat
          </button>

          {/* Engine Feature Tabs */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase px-3 tracking-wider mb-2">
              Select Engine
            </p>

            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'general' 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <MessageSquare size={16} /> General Intelligence
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'code' 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Code size={16} /> Code Architect
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'image' 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <ImageIcon size={16} /> AI Image Generator
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'search' 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Search size={16} /> Web Search
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase px-3 tracking-wider mb-2">
              Recent History
            </p>

            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition text-xs font-medium cursor-pointer ${
                  session.id === currentSessionId
                    ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-center gap-2.5 truncate pr-6">
                  <MessageSquare size={14} className="shrink-0 text-slate-500" />
                  <span className="truncate">{session.title || 'Untitled Conversation'}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute right-2 p-1 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-md transition"
                  title="Delete Chat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            >
              <Settings size={16} /> API Configurations
            </button>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-500 font-mono">POWERED BY MISTRAL</span>
              <Zap size={12} className="text-amber-500" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
          }
