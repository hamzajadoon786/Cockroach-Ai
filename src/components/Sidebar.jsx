import React from 'react';
import { useChat } from '../context/ChatContext';
import { Plus, MessageSquare, Trash2, Settings, Sparkles, X } from 'lucide-react';

export const Sidebar = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    createNewChat,
    deleteChat,
    isSidebarOpen,
    setIsSidebarOpen,
    setIsSettingsOpen
  } = useChat();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-dark-card border-r border-dark-border flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header & New Chat Button */}
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-wide text-white">Cockroach AI</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => {
              createNewChat();
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium flex items-center justify-center space-x-2 transition-colors shadow-md shadow-brand-600/20"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            History
          </div>

          {chats.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">No conversations yet</div>
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive
                      ? 'bg-brand-900/30 text-brand-500 border border-brand-500/30'
                      : 'text-gray-400 hover:bg-dark-hover hover:text-gray-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 transition-opacity rounded"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Settings Trigger */}
        <div className="p-3 border-t border-dark-border">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-dark-hover transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Settings & Keys</span>
          </button>
        </div>
      </aside>
    </>
  );
};
