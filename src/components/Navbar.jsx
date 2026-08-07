import React from 'react';
import { useChat } from '../context/ChatContext';
import { Menu, Settings, Download, Trash2, Cpu } from 'lucide-react';
import { downloadFile } from '../utils/helpers';

export const Navbar = () => {
  const {
    activeChat,
    settings,
    setIsSidebarOpen,
    setIsSettingsOpen,
    deleteChat
  } = useChat();

  const handleExport = () => {
    if (!activeChat || activeChat.messages.length === 0) return;
    const formatted = activeChat.messages
      .map((m) => `### ${m.role.toUpperCase()} (${new Date(m.timestamp).toLocaleString()}):\n${m.content}\n`)
      .join('\n---\n\n');
    downloadFile(formatted, `${activeChat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
  };

  return (
    <header className="h-16 border-b border-dark-border bg-dark-card/50 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-dark-hover"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-white truncate max-w-[200px] sm:max-w-md">
            {activeChat ? activeChat.title : 'New Conversation'}
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
            <Cpu className="w-3.5 h-3.5 text-brand-500" />
            <span>{settings.selectedModel}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {activeChat && activeChat.messages.length > 0 && (
          <>
            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
              title="Export Chat (.md)"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteChat(activeChat.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-hover rounded-lg transition-colors"
              title="Delete Current Chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
