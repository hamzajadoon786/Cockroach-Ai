/**
 * Utility helper functions
 */

// Generate Unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format Timestamp for Messages
export const formatTime = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Text-To-Speech Synthesizer
export const speakText = (text, lang = 'en-US') => {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel(); // Stop any previous speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
};

// Copy Text to Clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

// Download Content as File (.txt or .md)
export const downloadFile = (content, filename = 'chat-export.md') => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
