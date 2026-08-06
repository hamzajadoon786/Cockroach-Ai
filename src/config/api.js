/**
 * Cockroach AI - Global API & Model Configuration
 */

export const API_CONFIG = {
  // Model Engines
  MISTRAL_API_URL: 'https://api.mistral.ai/v1/chat/completions',
  HUGGING_FACE_IMAGE_URL: 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
  
  // Storage Keys
  STORAGE_KEYS: {
    MISTRAL_KEY: 'cockroach_mistral_api_key',
    HF_KEY: 'cockroach_hf_api_key',
    SETTINGS: 'cockroach_user_settings',
    CHAT_HISTORY: 'cockroach_chat_history',
    ACTIVE_CHAT_ID: 'cockroach_active_chat_id'
  },

  // Available Models
  MODELS: {
    MISTRAL_TINY: 'mistral-tiny',
    MISTRAL_SMALL: 'mistral-small-latest',
    MISTRAL_MEDIUM: 'mistral-medium-latest',
    MISTRAL_LARGE: 'mistral-large-latest',
    CODESTRAL: 'codestral-latest'
  },

  // Default App Settings
  DEFAULT_SETTINGS: {
    selectedModel: 'mistral-small-latest',
    systemPrompt: 'You are Cockroach AI, an advanced, highly intelligent, and helpful AI assistant built to serve users worldwide. Provide precise, well-structured, clean, and helpful responses.',
    temperature: 0.7,
    maxTokens: 2048,
    streamResponses: true,
    speechLanguage: 'en-US',
    autoSpeak: false
  }
};
