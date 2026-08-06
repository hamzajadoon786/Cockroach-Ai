import { API_CONFIG } from '../config/api';

/**
 * Service to generate AI images using Hugging Face
 */
export const generateAIImage = async (prompt, hfApiKey = null) => {
  const activeKey = hfApiKey || import.meta.env.VITE_HUGGING_FACE_API_KEY || localStorage.getItem(API_CONFIG.STORAGE_KEYS.HF_KEY);

  const headers = {
    'Content-Type': 'application/json'
  };

  if (activeKey) {
    headers['Authorization'] = `Bearer ${activeKey}`;
  }

  try {
    const response = await fetch(API_CONFIG.HUGGING_FACE_IMAGE_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      throw new Error(`Image Generation Failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Image Service Error:', error);
    throw error;
  }
};
