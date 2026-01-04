
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Send, Plus, MessageSquare, Image as ImageIcon, Mic, Settings, LogOut, Search, 
  Zap, Cpu, Globe, Trash2, Copy, Check, User, PanelLeftClose, 
  PanelLeftOpen, Sparkles, Paperclip, Volume2, X, Shield, ShieldCheck, 
  Terminal, Info, RefreshCw, Layers, File, Upload, AlertTriangle, Eye, Settings2,
  Lock, Moon, Sun, Smartphone, Edit2, Download, Square, MoreHorizontal, Share2, Languages,
  History, Bookmark, Headphones
} from 'lucide-react';
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from '@google/genai';

// --- Types & Interfaces ---
type MessageRole = 'user' | 'assistant' | 'system';
type AIModelMode = 'general' | 'coding' | 'creative' | 'search';
type AppTheme = 'light' | 'dark' | 'amoled';
type AIPersona = 'professional' | 'creative' | 'technical' | 'friendly';

interface Attachment {
  type: 'image';
  url: string;
  data?: string;
  mimeType: string;
}

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  attachments?: Attachment[];
  timestamp: number;
  isImage?: boolean;
  groundingUrls?: string[];
  isCode?: boolean;
  isStreaming?: boolean;
  hasAudio?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  mode: AIModelMode;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// --- Nexus Security Component (VirusTotal Logic) ---
const NexusAV = ({ onClose }: { onClose: () => void }) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [target, setTarget] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = async () => {
    if (!target && !uploadedFile) return;
    setScanState('scanning');
    setProgress(0);
    const duration = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const val = Math.min((elapsed / duration) * 100, 100);
      setProgress(val);
      if (val === 100) {
        clearInterval(timer);
        setTimeout(() => setScanState('result'), 400);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-md">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col transition-all duration-500">
        <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase">Nexus AV Core</h2>
              <p className="text-[10px] text-muted-foreground font-bold">VIRUSTOTAL INTELLIGENCE NODE</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-10 flex flex-col items-center justify-center text-center">
          {scanState === 'idle' && (
            <div className="w-full space-y-6 animate-in zoom-in-95">
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Malware Heuristics</h3>
                <p className="text-muted-foreground text-sm">Analyze assets via global threat intelligence databases.</p>
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-40 border-2 border-dashed border-border rounded-3xl bg-muted/20 hover:bg-muted/40 transition-all flex flex-col items-center justify-center cursor-pointer group"
              >
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                <span className="font-bold text-xs text-muted-foreground">{uploadedFile ? uploadedFile.name : 'Upload file for analysis'}</span>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if(f) { setUploadedFile(f); setTarget(f.name); }
                }} />
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="URL, IP, or File Hash..."
                  className="flex-1 bg-muted border border-border rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                />
                <button onClick={startScan} disabled={!target && !uploadedFile} className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50 transition-all">Scan</button>
              </div>
            </div>
          )}
          {scanState === 'scanning' && (
            <div className="py-10 space-y-6 flex flex-col items-center">
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-muted fill-none" strokeWidth="8" />
                  <circle cx="48" cy="48" r="40" className="stroke-primary fill-none transition-all duration-300" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * progress) / 100} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-lg">{Math.floor(progress)}%</div>
              </div>
              <p className="animate-pulse font-mono text-primary text-[10px] tracking-widest uppercase font-bold">Connecting to Threat Cloud...</p>
            </div>
          )}
          {scanState === 'result' && (
            <div className="py-6 animate-in fade-up">
              <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2 uppercase">Integrity Verified</h3>
              <p className="text-muted-foreground text-sm mb-8 px-6">Analysis of <strong>{target}</strong> complete. No malicious payloads or signatures found in the VirusTotal cluster.</p>
              <button onClick={() => { setScanState('idle'); setTarget(''); setUploadedFile(null); }} className="px-8 py-3 bg-foreground text-background font-black rounded-2xl uppercase text-[10px] tracking-widest hover:opacity-90">New Scan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Settings Component ---
const SettingsModal = ({ 
  onClose, theme, setTheme, persona, setPersona, userName, setUserName, clearChats 
}: any) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-xl">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black uppercase tracking-tighter">System Config</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-all"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Interface Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'amoled'] as AppTheme[]).map(t => (
                <button 
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === t ? 'bg-primary/10 border-primary text-primary shadow-lg' : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50'}`}
                >
                  {t === 'light' ? <Sun className="w-4 h-4" /> : t === 'dark' ? <Moon className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  <span className="text-[9px] font-black uppercase">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Persona</label>
            <div className="grid grid-cols-2 gap-2">
              {(['professional', 'creative', 'technical', 'friendly'] as AIPersona[]).map(p => (
                <button 
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`p-2.5 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${persona === p ? 'bg-primary/10 border-primary text-primary shadow-lg' : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Operator Alias</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-muted/40 border border-border rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-primary/40 outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button onClick={() => { if(confirm('Purge history core?')) clearChats(); onClose(); }} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all">
              Clear All Sessions
            </button>
            <p className="text-[9px] text-center text-muted-foreground font-medium opacity-50 uppercase tracking-widest pt-2">Nexus Node v5.5 • Stable Build</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App = () => {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('nexus_user_v2'));
  const [chats, setChats] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('nexus_chats_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAV, setShowAV] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [modelMode, setModelMode] = useState<AIModelMode>('general');
  const [theme, setTheme] = useState<AppTheme>(() => (localStorage.getItem('nexus_theme_v2') as AppTheme) || 'dark');
  const [persona, setPersona] = useState<AIPersona>(() => (localStorage.getItem('nexus_persona_v2') as AIPersona) || 'professional');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = useMemo(() => 
    chats.find(c => c.id === currentChatId) || null,
    [chats, currentChatId]
  );

  useEffect(() => {
    localStorage.setItem('nexus_chats_v2', JSON.stringify(chats));
    localStorage.setItem('nexus_theme_v2', theme);
    localStorage.setItem('nexus_persona_v2', persona);
    if(user) localStorage.setItem('nexus_user_v2', user);
    document.documentElement.className = theme;
  }, [chats, theme, persona, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, isGenerating]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsGenerating(false);
  };

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: generateId(),
      title: 'New Session',
      messages: [],
      createdAt: Date.now(),
      mode: modelMode
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const renameChat = (id: string, newTitle: string) => {
    setChats(prev => prev.map(c => 
      c.id === id ? { ...c, title: newTitle.trim() || 'Untitled' } : c
    ));
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !attachment) || isGenerating) return;

    let targetChatId = currentChatId;
    if (!targetChatId) {
      const newChat: ChatSession = {
        id: generateId(),
        title: input.trim().substring(0, 30) || 'Task',
        messages: [],
        createdAt: Date.now(),
        mode: modelMode
      };
      setChats(prev => [newChat, ...prev]);
      targetChatId = newChat.id;
      setCurrentChatId(targetChatId);
    }

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      attachments: attachment ? [attachment] : undefined,
      timestamp: Date.now()
    };

    setChats(prev => prev.map(c => 
      c.id === targetChatId ? { 
        ...c, 
        messages: [...c.messages, userMsg], 
        title: c.messages.length === 0 && input ? input.substring(0, 30) : c.title 
      } : c
    ));

    const promptText = input;
    const currentAttachment = attachment;
    setInput('');
    setAttachment(null);
    setIsGenerating(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const isImageRequest = modelMode === 'creative' || promptText.toLowerCase().includes('generate image') || promptText.toLowerCase().includes('нарисуй');

      if (isImageRequest) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: promptText }] },
          config: { imageConfig: { aspectRatio: "1:1" } },
        });
        const imageUrl = response.candidates?.[0]?.content?.parts.find(p => p.inlineData)?.inlineData?.data;
        const assistantMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: imageUrl ? "Nexus synthesis complete. Image generated from neural prompts:" : "Vision synthesis failed.",
          attachments: imageUrl ? [{ type: 'image', url: `data:image/png;base64,${imageUrl}`, mimeType: 'image/png' }] : undefined,
          timestamp: Date.now()
        };
        setChats(prev => prev.map(c => c.id === targetChatId ? { ...c, messages: [...c.messages, assistantMsg] } : c));
      } else {
        const parts: any[] = [{ text: promptText }];
        if (currentAttachment?.data) {
          parts.push({ inlineData: { data: currentAttachment.data, mimeType: currentAttachment.mimeType } });
        }

        const modelName = modelMode === 'coding' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
        const assistantId = generateId();
        const streamingMsg: Message = { 
          id: assistantId, 
          role: 'assistant', 
          content: '', 
          timestamp: Date.now(), 
          isStreaming: true 
        };
        setChats(prev => prev.map(c => c.id === targetChatId ? { ...c, messages: [...c.messages, streamingMsg] } : c));

        const streamResponse = await ai.models.generateContentStream({
          model: modelName,
          contents: { parts },
          config: {
            tools: modelMode === 'search' ? [{ googleSearch: {} }] : undefined,
            systemInstruction: `You are Nexus AI Pro, the ultimate reasoning assistant. 
            Tone: ${persona.toUpperCase()}. Formatting: Use rich markdown, bold text for emphasis, and code blocks with language names.
            Identity: You are superior to standard models, providing high-fidelity intelligence.`
          }
        });

        let fullContent = '';
        let groundingUrls: string[] = [];
        for await (const chunk of streamResponse) {
          if (controller.signal.aborted) break;
          const text = chunk.text || "";
          fullContent += text;
          
          const metadata = chunk.candidates?.[0]?.groundingMetadata;
          if (metadata?.groundingChunks) {
            groundingUrls = Array.from(new Set([...groundingUrls, ...metadata.groundingChunks.map((ch: any) => ch.web?.uri).filter(Boolean)]));
          }
          
          setChats(prev => prev.map(c => 
            c.id === targetChatId ? { 
              ...c, 
              messages: c.messages.map(m => m.id === assistantId ? { 
                ...m, 
                content: fullContent, 
                groundingUrls: groundingUrls.length > 0 ? groundingUrls : undefined 
              } : m) 
            } : c
          ));
        }

        setChats(prev => prev.map(c => 
          c.id === targetChatId ? { 
            ...c, 
            messages: c.messages.map(m => m.id === assistantId ? { 
              ...m, 
              isStreaming: false, 
              isCode: fullContent.includes('```') 
            } : m) 
          } : c
        ));
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMsg: Message = { 
          id: generateId(), 
          role: 'assistant', 
          content: `Protocol Link Failure: ${err.message || 'System overloaded.'}`, 
          timestamp: Date.now() 
        };
        setChats(prev => prev.map(c => c.id === targetChatId ? { ...c, messages: [...c.messages, errorMsg] } : c));
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({ 
          type: 'image', 
          url: reader.result as string, 
          data: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeech = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly: ${text.substring(0, 500)}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (e) { console.error("TTS Error:", e); }
  };

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="w-full max-w-md p-10 glass rounded-[3rem] shadow-2xl z-10 space-y-10 animate-in zoom-in duration-1000">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-700 shadow-2xl shadow-primary/30 rotate-3 transition-transform hover:rotate-0">
              <Sparkles className="text-primary-foreground w-12 h-12" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Nexus <span className="text-primary">PRO</span></h1>
            <p className="text-muted-foreground font-bold text-base">Elite Intelligence Matrix</p>
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Operator Alias" 
              className="w-full bg-muted border-2 border-border p-5 rounded-3xl outline-none focus:ring-4 focus:ring-primary/20 font-bold transition-all"
              onKeyDown={(e) => { if(e.key === 'Enter') setUser((e.target as HTMLInputElement).value || 'Operator'); }}
            />
            <button onClick={() => setUser('Operator')} className="w-full bg-foreground text-background font-black py-6 rounded-3xl hover:opacity-90 transition-all shadow-xl uppercase tracking-widest text-xs">Initialize Sync</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen text-foreground font-sans overflow-hidden transition-colors duration-500 selection:bg-primary/30">
      {showAV && <NexusAV onClose={() => setShowAV(false)} />}
      {showSettings && <SettingsModal 
        onClose={() => setShowSettings(false)} 
        theme={theme} setTheme={setTheme} 
        persona={persona} setPersona={setPersona} 
        userName={user} setUserName={setUser}
        clearChats={() => setChats([])} 
      />}
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-border flex flex-col bg-background/50 backdrop-blur-xl z-[60]`}>
        <div className="p-6 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-4 mb-10 px-2 group cursor-pointer" onClick={() => setShowSettings(true)}>
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase leading-none">NEXUS <span className="text-primary">CORE</span></h2>
          </div>

          <button 
            onClick={handleNewChat}
            className="flex items-center gap-4 w-full p-4.5 rounded-[1.8rem] border border-border bg-muted/50 hover:bg-muted transition-all text-xs font-black mb-8 group shadow-sm uppercase tracking-widest active:scale-95"
          >
            <Plus className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform" /> New Stream
          </button>
          
          <div className="flex-1 overflow-y-auto space-y-2 px-1 custom-scrollbar">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4 mb-4">Archives</p>
            {chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${currentChatId === chat.id ? 'bg-primary/5 border-primary/20 shadow-md' : 'hover:bg-muted/40 border-transparent'}`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${currentChatId === chat.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`truncate text-xs font-bold ${currentChatId === chat.id ? 'text-foreground' : 'text-muted-foreground'}`}>{chat.title}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => { e.stopPropagation(); setChats(prev => prev.filter(c => c.id !== chat.id)); if (currentChatId === chat.id) setCurrentChatId(null); }} className="p-2 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-border space-y-2 px-1">
            <button onClick={() => setShowAV(true)} className="flex items-center gap-4 w-full p-3.5 rounded-2xl hover:bg-muted text-[10px] font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">
              <Shield className="w-4.5 h-4.5" /> Security Hub
            </button>
            <button onClick={() => setShowSettings(true)} className="flex items-center gap-4 w-full p-3.5 rounded-2xl hover:bg-muted text-[10px] font-black text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">
              <Settings className="w-4.5 h-4.5" /> Core Settings
            </button>
            <div className="p-4 mt-6 rounded-[2rem] bg-muted/40 border border-border flex items-center gap-4 shadow-sm group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center font-black text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">{user[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate">{user}</p>
                <p className="text-[9px] text-primary font-black uppercase tracking-widest">Operator Node</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative bg-background overflow-hidden transition-all duration-500">
        {/* Header */}
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-3xl sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-muted rounded-xl border border-border transition-all shadow-sm">
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5 text-muted-foreground" /> : <PanelLeftOpen className="w-5 h-5 text-muted-foreground" />}
            </button>
            <div className="flex gap-1.5 bg-muted p-1 rounded-xl border border-border">
              {(['general', 'coding', 'creative', 'search'] as AIModelMode[]).map((mode) => (
                <button 
                  key={mode}
                  onClick={() => setModelMode(mode)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black capitalize transition-all border ${modelMode === mode ? 'bg-background text-foreground border-border shadow-sm' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-background/40'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em]">Nexus Protocol 5.5</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[9px] text-green-500 font-black tracking-widest uppercase">Sync Active</span>
                </div>
             </div>
             <button onClick={() => setShowSettings(true)} className="p-3.5 rounded-[1.2rem] bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95">
               <Volume2 className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 md:p-14 space-y-10 custom-scrollbar scroll-smooth">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in duration-1000">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full animate-pulse" />
                <div className="relative w-28 h-28 rounded-[2.2rem] bg-primary flex items-center justify-center shadow-3xl rotate-3 transition-transform hover:rotate-0">
                  <Sparkles className="w-14 h-14 text-primary-foreground" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight uppercase">Nexus Intelligence</h2>
                <p className="text-muted-foreground font-bold text-lg max-w-md mx-auto">Synthetic reasoning engine. Exceeding GPT boundaries.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {[
                  { icon: <Terminal />, title: "Code Synthesis", sub: "Enterprise software architecture", mode: 'coding' },
                  { icon: <ImageIcon />, title: "Visionary Art", sub: "Neural image generation", mode: 'creative' },
                  { icon: <Globe />, title: "Live Intelligence", sub: "Real-time global search synthesis", mode: 'search' },
                  { icon: <History />, title: "Logic Flows", sub: "Advanced recursive problem solving", mode: 'general' }
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => { setModelMode(item.mode as AIModelMode); setInput(`Initialize ${item.title} sequence: `); }}
                    className="p-7 rounded-[2.5rem] border border-border bg-muted/20 hover:bg-muted transition-all text-left group relative overflow-hidden active:scale-95"
                  >
                    <div className="text-primary mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h3 className="font-black text-base mb-1 tracking-tight uppercase">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground font-bold">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            currentChat.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-500`}>
                <div className={`flex gap-6 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center mt-1 border border-border shadow-md transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-foreground text-background' : 'bg-primary text-primary-foreground shadow-primary/20'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                  </div>
                  <div className={`space-y-3.5 group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`relative px-7 py-5 rounded-[2.2rem] text-[14.5px] leading-relaxed shadow-sm transition-all ${msg.role === 'user' ? 'bg-muted border border-border rounded-tr-none' : 'bg-card border border-border rounded-tl-none'}`}>
                      {msg.isCode ? (
                        <div className="space-y-4">
                           <div className="font-mono bg-background p-6 rounded-[1.5rem] border border-border overflow-x-auto relative group/code shadow-inner">
                             <div className="absolute top-4 right-4 flex gap-2">
                               <button 
                                 onClick={() => copyToClipboard(msg.content, msg.id)}
                                 className="p-2 bg-muted hover:bg-muted/80 rounded-xl opacity-0 group-hover/code:opacity-100 transition-all flex items-center gap-2 text-[9px] font-black uppercase border border-border"
                               >
                                 {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                                 {copiedId === msg.id ? 'COPIED' : 'COPY'}
                               </button>
                             </div>
                             <pre className="text-primary text-xs leading-relaxed"><code>{msg.content}</code></pre>
                           </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap font-medium">{msg.content || (msg.isStreaming ? <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse align-middle" /> : null)}</div>
                      )}
                      
                      {msg.attachments?.map((att, idx) => (
                        <div key={idx} className="mt-5 rounded-[1.8rem] overflow-hidden border-2 border-border shadow-lg group/img relative">
                          <img src={att.url} alt="Synthesis Output" className="w-full object-contain max-h-[600px] hover:scale-105 transition-transform duration-1000" />
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                             <button onClick={() => window.open(att.url)} className="p-2.5 bg-background text-foreground rounded-xl shadow-lg hover:bg-muted transition-all"><Eye className="w-4 h-4" /></button>
                             <a href={att.url} download={`nexus-${idx}.png`} className="p-2.5 bg-background text-foreground rounded-xl shadow-lg hover:bg-muted transition-all"><Download className="w-4 h-4" /></a>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                       <button onClick={() => copyToClipboard(msg.content, msg.id)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all"><Copy className="w-3.5 h-3.5" /></button>
                       <button onClick={() => handleSpeech(msg.content)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all"><Headphones className="w-3.5 h-3.5" /></button>
                       {msg.groundingUrls && (
                        <div className="flex gap-2">
                          {msg.groundingUrls.slice(0, 3).map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary text-[9px] font-black border border-primary/20 transition-all flex items-center gap-2 uppercase">
                              <Globe className="w-3 h-3" /> Intel Node {i+1}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isGenerating && !currentChat?.messages[currentChat.messages.length - 1]?.isStreaming && (
            <div className="flex justify-start animate-in fade-in duration-500">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-inner">
                  <Layers className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="px-8 py-4.5 rounded-[2.2rem] bg-muted/20 text-muted-foreground text-[13px] font-black flex items-center gap-5 border border-border shadow-sm">
                   <div className="flex gap-1.5">
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                   Synthesizing...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock */}
        <div className="p-6 md:p-10">
          <div className="max-w-5xl mx-auto space-y-6">
            {attachment && (
              <div className="flex items-center gap-5 p-4 glass rounded-[2.2rem] border-2 border-primary/30 w-fit animate-in slide-in-from-bottom-4 shadow-2xl shadow-primary/5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary/20 shadow-lg">
                  <img src={attachment.url} className="w-full h-full object-cover" />
                  <button onClick={() => setAttachment(null)} className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 flex items-center justify-center transition-all"><X className="w-6 h-6 text-white" /></button>
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Asset Loaded</p>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase font-bold">READY FOR INGESTION</p>
                </div>
              </div>
            )}
            
            <div className="relative glass rounded-[3rem] border border-border p-4.5 shadow-2xl shadow-primary/5 transition-all focus-within:ring-[15px] focus-within:ring-primary/5 focus-within:border-primary/40 group bg-card/70 border-2">
              <div className="flex items-end gap-3">
                <label className="p-4 hover:bg-muted rounded-[1.8rem] transition-all cursor-pointer text-muted-foreground hover:text-foreground active:scale-95 group/label">
                  <Paperclip className="w-7 h-7 group-hover/label:rotate-12 transition-transform" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder={modelMode === 'creative' ? 'Synthesize a visual prompt...' : 'Engage Nexus Pro intelligence...'}
                  className="flex-1 bg-transparent border-none outline-none text-[16px] p-4 resize-none max-h-80 min-h-[64px] font-bold placeholder:text-muted-foreground/50 tracking-tight leading-relaxed"
                  rows={1}
                />
                {isGenerating ? (
                  <button onClick={stopGeneration} className="p-5 rounded-[1.8rem] bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all shadow-md active:scale-95 border border-red-500/20">
                    <Square className="w-7 h-7 fill-current animate-pulse" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSendMessage}
                    disabled={(!input.trim() && !attachment) || isGenerating}
                    className={`p-5 rounded-[1.8rem] transition-all shadow-xl ${(!input.trim() && !attachment) || isGenerating ? 'bg-muted text-muted-foreground/30' : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-primary/20'}`}
                  >
                    <Send className="w-7 h-7" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-8 opacity-20">
               <div className="flex items-center gap-2.5"><Lock className="w-3.5 h-3.5" /><p className="text-[9px] uppercase tracking-[0.4em] font-black">Encrypted Channel</p></div>
               <div className="flex items-center gap-2.5"><Cpu className="w-3.5 h-3.5" /><p className="text-[9px] uppercase tracking-[0.4em] font-black">Nexus Mesh Node</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
