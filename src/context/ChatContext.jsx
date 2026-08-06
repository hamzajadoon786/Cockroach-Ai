import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';
import { generateId } from '../utils/helpers';
import { fetchMistralResponse } from '../services/mistralService';
import { generateAIImage } from '../services/imageService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // State Initialization
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(API_CONFIG.STORAGE_KEYS.CHAT_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACTIVE_CHAT_ID) || null;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(API_CONFIG.STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : API_CONFIG.DEFAULT_SETTINGS;
  });

  const [mistralApiKey, setMistralApiKey] = useState(() => {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.MISTRAL_KEY) || '';
  });

  const [hfApiKey, setHfApiKey] = useState(() => {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.HF_KEY) || '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACTIVE_CHAT_ID, activeChatId);
    } else {
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACTIVE_CHAT_ID);
    }
  }, [activeChatId]);

  useEffect(() => {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.MISTRAL_KEY, mistralApiKey);
  }, [mistralApiKey]);

  useEffect(() => {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.HF_KEY, hfApiKey);
  }, [hfApiKey]);

  // Active Chat Resolver
  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  // Actions
  const createNewChat = () => {
    const newChat = {
      id: generateId(),
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: []
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  };

  const deleteChat = (id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter((chat) => chat.id !== id);
      setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const clearAllChats = () => {
    setChats([]);
    setActiveChatId(null);
  };

  const updateChatTitle = (chatId, newTitle) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat))
    );
  };

  // Main Handler for sending user prompt & receiving response
  const sendMessage = async (prompt, isImageRequest = false) => {
    if (!prompt.trim()) return;

    let currentChatId = activeChatId;
    if (!currentChatId) {
      currentChatId = createNewChat();
    }

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    };

    // Append User Message to Active Chat
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          const updatedMessages = [...chat.messages, userMessage];
          const autoTitle = chat.messages.length === 0 ? prompt.slice(0, 30) + '...' : chat.title;
          return { ...chat, title: autoTitle, messages: updatedMessages };
        }
        return chat;
      })
    );

    setIsLoading(true);

    try {
      if (isImageRequest) {
        // Image Generation Mode
        const imageUrl = await generateAIImage(prompt, hfApiKey);
        const assistantMessage = {
          id: generateId(),
          role: 'assistant',
          content: `Here is your generated image for: "${prompt}"`,
          type: 'image',
          imageUrl: imageUrl,
          timestamp: new Date().toISOString()
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, assistantMessage] }
              : chat
          )
        );
      } else {
        // Text & Code Generation Mode
        const assistantMessageId = generateId();
        const placeholderMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString()
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, placeholderMessage] }
              : chat
          )
        );

        // Fetch target history
        const currentChatObj = chats.find((c) => c.id === currentChatId);
        const history = currentChatObj ? [...currentChatObj.messages, userMessage] : [userMessage];

        await fetchMistralResponse({
          messages: history,
          apiKey: mistralApiKey,
          model: settings.selectedModel,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          systemPrompt: settings.systemPrompt,
          onStreamChunk: (chunk, fullText) => {
            setChats((prev) =>
              prev.map((chat) => {
                if (chat.id === currentChatId) {
                  const updatedMsgs = chat.messages.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, content: fullText } : msg
                  );
                  return { ...chat, messages: updatedMsgs };
                }
                return chat;
              })
            );
          }
        });
      }
    } catch (error) {
      const errorMessage = {
        id: generateId(),
        role: 'assistant',
        content: `**Error:** ${error.message || 'Failed to process request.'}`,
        isError: true,
        timestamp: new Date().toISOString()
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        activeChatId,
        setActiveChatId,
        settings,
        setSettings,
        mistralApiKey,
        setMistralApiKey,
        hfApiKey,
        setHfApiKey,
        isLoading,
        isSidebarOpen,
        setIsSidebarOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        createNewChat,
        deleteChat,
        clearAllChats,
        updateChatTitle,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
