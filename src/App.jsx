import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import ArtifactsPreview from './components/ArtifactsPreview';
import SettingsModal from './components/SettingsModal';
import { useSpeechToText } from './utils/useSpeechToText';
import { useTextToSpeech } from './utils/useTextToSpeech';
import { loadSessions, saveSessions, createNewSession } from './utils/storage';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'code' | 'image' | 'search'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Artifact preview state
  const [artifactCode, setArtifactCode] = useState(null);
  const [showArtifact, setShowArtifact] = useState(false);

  // Custom API Keys State
  const [apiKeys, setApiKeys] = useState({
    mistralKey: '',
    searchKey: '',
    imageKey: ''
  });

  // Speech Hooks
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText();
  const { speak, stop: stopVoice, isSpeaking } = useTextToSpeech();

  // Load sessions on mount
  useEffect(() => {
    const saved = loadSessions();
    if (saved && saved.length > 0) {
      setSessions(saved);
      setCurrentSessionId(saved[0].id);
    } else {
      const initial = createNewSession();
      setSessions([initial]);
      setCurrentSessionId(initial.id);
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions);
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  const handleNewChat = () => {
    const newSession = createNewSession();
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setSidebarOpen(false);
    setArtifactCode(null);
    setShowArtifact(false);
  };

  const handleSelectSession = (id) => {
    setCurrentSessionId(id);
    setSidebarOpen(false);
  };

  const handleDeleteSession = (id) => {
    const filtered = sessions.filter(s => s.id !== id);
    if (filtered.length === 0) {
      const fresh = createNewSession();
      setSessions([fresh]);
      setCurrentSessionId(fresh.id);
    } else {
      setSessions(filtered);
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
      }
    }
  };

  const handleSendMessage = async (userText, attachments = []) => {
    if (!userText.trim() && attachments.length === 0) return;
    if (isLoading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userText,
      attachments,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update session title on first message
    let updatedSessions = [...sessions];
    const sessionIdx = updatedSessions.findIndex(s => s.id === currentSessionId);
    if (sessionIdx !== -1) {
      const session = updatedSessions[sessionIdx];
      if (session.messages.length <= 1) {
        session.title = userText.slice(0, 30) || 'New Conversation';
      }
      session.messages.push(userMsg);
    }
    setSessions(updatedSessions);
    setIsLoading(true);

    try {
      let endpoint = '/api/chat';
      let payload = {
        messages: activeSession.messages.map(m => ({ role: m.role, content: m.content })),
        activeTab,
        customKey: apiKeys.mistralKey || undefined,
        attachments
      };

      if (activeTab === 'image') {
        endpoint = '/api/image';
        payload = { prompt: userText, customKey: apiKeys.imageKey || undefined };
      } else if (activeTab === 'search') {
        endpoint = '/api/search';
        payload = { query: userText, customKey: apiKeys.searchKey || undefined };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.result) {
        const botMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.result,
          imageUrl: data.imageUrl || null,
          sources: data.sources || null,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Check for code artifact (HTML/CSS/JS block)
        const codeMatch = data.result.match(/```(html|jsx|javascript)\n([\s\S]*?)```/);
        if (codeMatch) {
          setArtifactCode(codeMatch[2]);
          setShowArtifact(true);
        }

        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            return { ...s, messages: [...s.messages, botMsg] };
          }
          return s;
        }));
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**System Error:** ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, errorMsg] };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
        {/* Workspace Layout: Split View if Artifact is active */}
        <div className="flex-1 flex h-full overflow-hidden">
          {/* Chat Window */}
          <div className={`flex-1 flex flex-col h-full ${showArtifact ? 'w-1/2 hidden md:flex' : 'w-full'}`}>
            <ChatWindow
              messages={activeSession ? activeSession.messages : []}
              isLoading={isLoading}
              onSpeak={speak}
              isSpeaking={isSpeaking}
              onStopVoice={stopVoice}
              setSidebarOpen={setSidebarOpen}
              activeTab={activeTab}
            />

            <InputBar
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isListening={isListening}
              transcript={transcript}
              startListening={startListening}
              stopListening={stopListening}
              resetTranscript={resetTranscript}
            />
          </div>

          {/* Artifact Preview Panel */}
          {showArtifact && artifactCode && (
            <ArtifactsPreview
              code={artifactCode}
              onClose={() => setShowArtifact(false)}
            />
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
         }
