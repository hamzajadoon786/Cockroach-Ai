const KEYS = {
  CONFIG: 'cockroach_ai_config',
  SESSIONS: 'cockroach_ai_sessions',
  ACTIVE_SESSION: 'cockroach_ai_active_session',
  AGENTS: 'cockroach_ai_agents'
};

const DEFAULT_CONFIG = {
  mistralApiKey: '',
  defaultModel: 'open-mistral-7b',
  temperature: 0.7,
  maxTokens: 2048,
  enableSwarm: true
};

export const storage = {
  // Configuration Storage
  getConfig: () => {
    try {
      const data = localStorage.getItem(KEYS.CONFIG);
      return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : DEFAULT_CONFIG;
    } catch (error) {
      console.error('Failed to parse config from localStorage:', error);
      return DEFAULT_CONFIG;
    }
  },

  saveConfig: (config) => {
    try {
      localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Failed to save config to localStorage:', error);
      return false;
    }
  },

  // Sessions / Chat History Storage
  getSessions: () => {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to retrieve chat sessions:', error);
      return [];
    }
  },

  saveSessions: (sessions) => {
    try {
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Failed to save chat sessions:', error);
      return false;
    }
  },

  getActiveSessionId: () => {
    try {
      return localStorage.getItem(KEYS.ACTIVE_SESSION) || null;
    } catch (error) {
      console.error('Failed to get active session ID:', error);
      return null;
    }
  },

  setActiveSessionId: (id) => {
    try {
      if (id) {
        localStorage.setItem(KEYS.ACTIVE_SESSION, id);
      } else {
        localStorage.removeItem(KEYS.ACTIVE_SESSION);
      }
      return true;
    } catch (error) {
      console.error('Failed to set active session ID:', error);
      return false;
    }
  },

  // Agents State Persistence
  getAgentsState: () => {
    try {
      const data = localStorage.getItem(KEYS.AGENTS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load agents state:', error);
      return null;
    }
  },

  saveAgentsState: (agents) => {
    try {
      localStorage.setItem(KEYS.AGENTS, JSON.stringify(agents));
      return true;
    } catch (error) {
      console.error('Failed to save agents state:', error);
      return false;
    }
  },

  // Wipe application data
  clearAll: () => {
    try {
      Object.values(KEYS).forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear application storage:', error);
      return false;
    }
  }
};
