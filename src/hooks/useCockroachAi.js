import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { orchestratorInstance, INITIAL_AGENTS } from '../services/agentOrchestrator';

export const useCockroachAi = () => {
  const [config, setConfig] = useState(() => storage.getConfig());
  const [sessions, setSessions] = useState(() => storage.getSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => storage.getActiveSessionId());
  const [agents, setAgents] = useState(() => storage.getAgentsState() || INITIAL_AGENTS);
  const [activeAgent, setActiveAgent] = useState(INITIAL_AGENTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Sync configuration with orchestrator
  useEffect(() => {
    orchestratorInstance.updateConfig(config);
    storage.saveConfig(config);
  }, [config]);

  // Sync sessions with storage
  useEffect(() => {
    storage.saveSessions(sessions);
  }, [sessions]);

  // Sync active session ID with storage
  useEffect(() => {
    storage.setActiveSessionId(activeSessionId);
  }, [activeSessionId]);

  // Sync agents state with storage
  useEffect(() => {
    storage.saveAgentsState(agents);
  }, [agents]);

  // Get active session object
  const currentSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Create new session
  const createNewSession = useCallback(() => {
    const newSession = {
      id: `session_${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  // Delete a session
  const deleteSession = useCallback((sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  // Send message through the swarm
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isGenerating) return;

    setError(null);
    let targetSessionId = activeSessionId;

    // Create session if none active
    if (!targetSessionId) {
      const newSess = createNewSession();
      targetSessionId = newSess.id;
    }

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    // Append user message to active session
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === targetSessionId) {
          const updatedMessages = [...session.messages, userMessage];
          const autoTitle = session.messages.length === 0 ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : session.title;
          return { ...session, title: autoTitle, messages: updatedMessages };
        }
        return session;
      })
    );

    setIsGenerating(true);

    try {
      const activeSess = sessions.find((s) => s.id === targetSessionId);
      const conversationHistory = activeSess
        ? activeSess.messages.map((m) => ({ role: m.role, content: m.content }))
        : [];

      // Process query via orchestrator
      const result = await orchestratorInstance.processQuery(text, conversationHistory);

      const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: result.content,
        agentName: result.agent.name,
        agentRole: result.agent.role,
        timestamp: new Date().toISOString()
      };

      // Update active agent based on execution
      setActiveAgent(result.agent);

      // Append assistant message
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === targetSessionId) {
            return {
              ...session,
              messages: [...session.messages, assistantMessage]
            };
          }
          return session;
        })
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to process request through Cockroach AI.');
    } finally {
      setIsGenerating(false);
    }
  }, [activeSessionId, isGenerating, createNewSession, sessions]);

  // Save updated config
  const updateConfig = useCallback((newPartialConfig) => {
    setConfig((prev) => ({ ...prev, ...newPartialConfig }));
  }, []);

  return {
    config,
    updateConfig,
    sessions,
    activeSessionId,
    setActiveSessionId,
    currentSession,
    createNewSession,
    deleteSession,
    agents,
    activeAgent,
    setActiveAgent,
    sendMessage,
    isGenerating,
    error
  };
};
