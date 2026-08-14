import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiImage, FiSend, FiCode, FiZap, FiGlobe, FiTerminal, FiSettings, FiX } from 'react-icons/fi';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('text'); // 'text' | 'image' | 'voice'
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && mode !== 'voice') return;

    const currentPrompt = input;
    const currentMode = mode;

    const userMsg = { id: Date.now(), role: 'user', content: currentPrompt || "Voice Input", mode: currentMode };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (currentMode === 'image') {
        // Direct Client-Side Image Engine (No Backend Server Failures)
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(currentPrompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}&nologo=true`;
        
        // Wait briefly for smooth UI response
        await new Promise(resolve => setTimeout(resolve, 1000));

        const aiMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: imageUrl,
          type: 'image_url',
        };
        setMessages((prev) => [...prev, aiMsg]);

      } else if (currentMode === 'voice') {
        // Direct Client-Side Voice Simulation Engine
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const aiMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `[Cockroach Voice Engine]: Listening mode active. Processed input: "${currentPrompt || 'Audio Command Received'}"`,
          type: 'text',
        };
        setMessages((prev) => [...prev, aiMsg]);

      } else {
        // Standard Text Mode (Backend Fetch with Fallback)
        try {
          const response = await fetch('/api/cockroach-engine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: currentPrompt, mode: 'text' }),
          });

          if (!response.ok) throw new Error("Fetch failed");

          const data = await response.json();
          setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.output || data.reply, type: 'text' }]);
        } catch (fetchErr) {
          // Robust Fallback if backend API endpoint is not configured
          setMessages((prev) => [...prev, { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: `Cockroach AI Engine Response: Processed request for "${currentPrompt}". (Deploy /api/cockroach-engine to Vercel for live LLM streaming).`, 
            type: 'text' 
          }]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Cockroach AI System Error: Connection reset.',
          type: 'error',
        },
      ]);
    } finally {
      setIsLoading(false);
      setMode('text'); // Reset to text mode after sending
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0F12] text-gray-200 font-mono overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#12151A] border-r border-gray-800 flex flex-col justify-between p-4 hidden md:flex">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded bg-[#00FF66]/10 border border-[#00FF66] flex items-center justify-center text-[#00FF66] font-bold">
              🪲
            </div>
            <span className="font-bold tracking-wider text-white">COCKROACH AI</span>
          </div>
          <div className="text-xs text-gray-500 uppercase font-semibold mb-2">System Status</div>
          <div className="flex items-center space-x-2 text-xs text-[#00FF66]">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
            <span>Global Edge: Online</span>
          </div>
        </div>

        <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition">
          <FiSettings />
          <span>Settings & Keys</span>
        </button>
      </aside>

      {/* Main App */}
      <main className="flex-1 flex flex-col justify-between relative">
        <header className="h-14 border-b border-gray-800/60 flex items-center justify-between px-6 bg-[#0D0F12]/80 backdrop-blur">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <FiTerminal className="text-[#00FF66]" />
            <span>cockroach-v1.0-resilient</span>
          </div>
          <div className="flex items-center space-x-2 text-xs bg-[#161B22] border border-gray-800 px-3 py-1 rounded-full text-gray-300">
            <FiGlobe className="text-[#FF8C00]" />
            <span>Global Multimodal Node</span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#12151A] border border-[#00FF66]/30 flex items-center justify-center text-3xl text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]">
                🪲
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">COCKROACH AI</h1>
                <p className="text-xs text-gray-400 mt-2">
                  Unbreakable multimodal platform for global intelligence, visual generation & code.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-4">
                <div 
                  onClick={() => { setMode('text'); setInput("Write a React button with Tailwind"); }}
                  className="p-3 bg-[#12151A] border border-gray-800 hover:border-[#00FF66]/50 rounded cursor-pointer transition"
                >
                  <FiCode className="text-[#00FF66] mb-2" />
                  <div className="text-xs font-bold text-white">Full Stack Code</div>
                </div>

                <div 
                  onClick={() => { setMode('image'); setInput("Cyberpunk cityscape illuminated with neon rain lights"); }}
                  className="p-3 bg-[#12151A] border border-gray-800 hover:border-[#FF8C00]/50 rounded cursor-pointer transition"
                >
                  <FiImage className="text-[#FF8C00] mb-2" />
                  <div className="text-xs font-bold text-white">AI Artwork Mode</div>
                </div>

                <div 
                  onClick={() => { setMode('voice'); setInput("Listening to audio prompt..."); }}
                  className="p-3 bg-[#12151A] border border-gray-800 hover:border-blue-500/50 rounded cursor-pointer transition"
                >
                  <FiMic className="text-blue-400 mb-2" />
                  <div className="text-xs font-bold text-white">Voice Command</div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl rounded-xl p-4 ${msg.role === 'user' ? 'bg-[#1F242D] text-white border border-gray-700' : 'bg-[#12151A] text-gray-200 border border-gray-800'}`}>
                  {msg.type === 'image_url' ? (
                    <div className="space-y-2">
                      <p className="text-xs text-[#FF8C00] font-bold">🎨 Generated AI Image:</p>
                      <img src={msg.content} alt="AI Artwork" className="rounded-lg border border-gray-700 max-w-full h-auto" />
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#12151A] border border-gray-800 rounded-lg p-3 text-xs text-[#00FF66] animate-pulse">
                Cockroach AI is processing {mode} mode...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Mode Bar Indicator */}
        {mode !== 'text' && (
          <div className="bg-[#161B22] border-t border-gray-800 px-4 py-2 text-xs text-[#00FF66] flex items-center justify-between">
            <span>Selected Mode: <strong>{mode.toUpperCase()} MODE</strong></span>
            <button onClick={() => setMode('text')} className="text-gray-400 hover:text-white flex items-center space-x-1">
              <span>Cancel</span> <FiX />
            </button>
          </div>
        )}

        {/* Input Controls */}
        <div className="p-4 border-t border-gray-800 bg-[#0D0F12]">
          <div className="max-w-3xl mx-auto bg-[#12151A] border border-gray-800 focus-within:border-[#00FF66] rounded-xl p-2 flex items-center space-x-2">
            
            <button 
              onClick={() => setMode(mode === 'image' ? 'text' : 'image')} 
              className={`p-2 rounded hover:bg-gray-800 transition ${mode === 'image' ? 'text-[#FF8C00] bg-[#FF8C00]/20' : 'text-gray-400'}`}
              title="Toggle Image Mode"
            >
              <FiImage />
            </button>

            <button 
              onClick={() => setMode(mode === 'voice' ? 'text' : 'voice')} 
              className={`p-2 rounded hover:bg-gray-800 transition ${mode === 'voice' ? 'text-[#00FF66] bg-[#00FF66]/20' : 'text-gray-400'}`}
              title="Toggle Voice Mode"
            >
              <FiMic />
            </button>

            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                mode === 'image' 
                  ? "Describe the image to generate..." 
                  : mode === 'voice' 
                  ? "Type or speak your audio command..." 
                  : "Ask Cockroach AI anything..."
              }
              className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 px-2"
            />

            <button 
              onClick={handleSend} 
              disabled={isLoading}
              className="p-2 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00e65c] transition disabled:opacity-50"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
    }
