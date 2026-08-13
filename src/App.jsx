import React, { useState, useRef, useEffect } from 'react';
import { 
  FiMic, FiImage, FiSend, FiCode, FiZap, 
  FiGlobe, FiTerminal, FiSettings, FiCheck, FiX 
} from 'react-icons/fi';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('text'); // 'text' | 'image' | 'voice'
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && mode !== 'voice') return;

    const userMsg = { id: Date.now(), role: 'user', content: input, mode };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/cockroach-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, mode }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.output,
        type: data.type, // 'text' | 'image_url' | 'audio_transcript'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Cockroach AI system interruption: Unable to process request.',
          type: 'error',
        },
      ]);
    } finally {
      setIsLoading(false);
      setMode('text'); // Reset to default mode
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
          <div className="flex items-center space-x-2 text-xs text-[#00FF66] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
            <span>Global Edge: Online</span>
          </div>
        </div>

        <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition">
          <FiSettings />
          <span>Settings & Keys</span>
        </button>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-between relative">
        {/* Header */}
        <header className="h-14 border-b border-gray-800/60 flex items-center justify-between px-6 bg-[#0D0F12]/80 backdrop-blur">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <FiTerminal className="text-[#00FF66]" />
            <span>cockroach-v1.0-resilient</span>
          </div>
          <div className="flex items-center space-x-2 text-xs bg-[#161B22] border border-gray-800 px-3 py-1 rounded-full text-gray-300">
            <FiGlobe className="text-[#FF8C00]" />
            <span>Global Nodes Active</span>
          </div>
        </header>

        {/* Chat / Hero Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#12151A] border border-[#00FF66]/30 flex items-center justify-center text-3xl text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]">
                🪲
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">COCKROACH AI</h1>
                <p className="text-xs text-gray-400 mt-2">
                  Unbreakable, highly-adaptable multimodal engine built for code, visual synthesis, and global orchestration.
                </p>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-4">
                <div 
                  onClick={() => setInput("Write a React + Tailwind button component")}
                  className="p-3 bg-[#12151A] border border-gray-800 hover:border-[#00FF66]/50 rounded cursor-pointer transition group"
                >
                  <FiCode className="text-[#00FF66] mb-2 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-white">Full Stack Code</div>
                  <div className="text-[10px] text-gray-500 mt-1">Generate resilient React components.</div>
                </div>

                <div 
                  onClick={() => { setMode('image'); setInput("Cyberpunk cockroach robot with glowing neon green eyes"); }}
                  className="p-3 bg-[#12151A] border border-gray-800 hover:border-[#FF8C00]/50 rounded cursor-pointer transition group"
                >
                  <FiImage className="text-[#FF8C00] mb-2 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-white">AI Artwork</div>
                  <div className="text-[10px] text-gray-500 mt-1">High-res artwork generation mode.</div>
                </div>

                <div 
                  onClick={() => setInput("Explain quantum entanglement simply")}
                  className="p-3 bg-[#12151A] border border-gray-800 hover:border-blue-500/50 rounded cursor-pointer transition group"
                >
                  <FiZap className="text-blue-400 mb-2 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-white">Deep Intelligence</div>
                  <div className="text-[10px] text-gray-500 mt-1">Complex reasoning & analysis.</div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl rounded-lg p-4 ${msg.role === 'user' ? 'bg-[#1F242D] text-white border border-gray-700' : 'bg-[#12151A] text-gray-200 border border-gray-800'}`}>
                  {msg.type === 'image_url' ? (
                    <img src={msg.content} alt="Generated AI Visual" className="rounded border border-gray-700 max-w-full h-auto" />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#12151A] border border-gray-800 rounded-lg p-4 text-xs text-[#00FF66] animate-pulse">
                Cockroach AI is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Floating Mode Indicator */}
        {mode !== 'text' && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-[#161B22] border border-[#00FF66] px-3 py-1 rounded-full text-xs text-[#00FF66] flex items-center space-x-2">
            <span>Active Mode: <strong>{mode.toUpperCase()}</strong></span>
            <button onClick={() => setMode('text')} className="hover:text-white"><FiX /></button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-800 bg-[#0D0F12]">
          <div className="max-w-3xl mx-auto bg-[#12151A] border border-gray-800 focus-within:border-[#00FF66] rounded-xl p-2 flex items-center space-x-2 transition">
            
            {/* Mode Switcher Buttons */}
            <button 
              onClick={() => setMode(mode === 'image' ? 'text' : 'image')} 
              className={`p-2 rounded hover:bg-gray-800 transition ${mode === 'image' ? 'text-[#FF8C00] bg-[#FF8C00]/10' : 'text-gray-400'}`}
              title="Toggle Image Mode"
            >
              <FiImage />
            </button>

            <button 
              onClick={() => setMode(mode === 'voice' ? 'text' : 'voice')} 
              className={`p-2 rounded hover:bg-gray-800 transition ${mode === 'voice' ? 'text-[#00FF66] bg-[#00FF66]/10' : 'text-gray-400'}`}
              title="Toggle Voice Mode"
            >
              <FiMic />
            </button>

            {/* Input Field */}
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                mode === 'image' 
                  ? "Describe the image you want Cockroach AI to generate..." 
                  : mode === 'voice' 
                  ? "Click send to simulate voice prompt execution..." 
                  : "Ask Cockroach AI anything..."
              }
              className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 px-2"
            />

            {/* Send Button */}
            <button 
              onClick={handleSend} 
              disabled={isLoading}
              className="p-2 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00e65c] transition disabled:opacity-50"
            >
              <FiSend />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-2">
            Cockroach AI Engine • Multimodal Global Pipeline Enabled
          </p>
        </div>
      </main>
    </div>
  );
                                             }
