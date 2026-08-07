import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { SettingsModal } from './components/SettingsModal';

function AppContent() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Navbar />
        <ChatWindow />
      </div>
      <SettingsModal />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}
