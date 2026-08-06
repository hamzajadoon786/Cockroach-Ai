import { API_CONFIG } from '../config/api';

/**
 * Service to handle Mistral AI interactions
 */
export const fetchMistralResponse = async ({
  messages,
  apiKey,
  model = API_CONFIG.DEFAULT_SETTINGS.selectedModel,
  temperature = API_CONFIG.DEFAULT_SETTINGS.temperature,
  maxTokens = API_CONFIG.DEFAULT_SETTINGS.maxTokens,
  systemPrompt = API_CONFIG.DEFAULT_SETTINGS.systemPrompt,
  onStreamChunk = null
}) => {
  const activeKey = apiKey || import.meta.env.VITE_MISTRAL_API_KEY || localStorage.getItem(API_CONFIG.STORAGE_KEYS.MISTRAL_KEY);

  if (!activeKey) {
    throw new Error('Mistral API Key missing. Please provide a key in Settings.');
  }

  // Format payload with System Prompt
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  ];

  const requestBody = {
    model: model,
    messages: formattedMessages,
    temperature: parseFloat(temperature),
    max_tokens: parseInt(maxTokens, 10),
    stream: Boolean(onStreamChunk)
  };

  try {
    const response = await fetch(API_CONFIG.MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `API Request Failed with status: ${response.status}`);
    }

    // Handle Streaming Output
    if (onStreamChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.includes('[DONE]')) continue;
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.replace('data: ', ''));
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                fullText += content;
                onStreamChunk(content, fullText);
              }
            } catch (err) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
      return fullText;
    }

    // Standard Non-Streaming Output
    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('Mistral Service Error:', error);
    throw error;
  }
};
