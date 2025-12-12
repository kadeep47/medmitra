import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Users, Pill, User, MessageCircle, Send, Plus, 
  Camera, Video, MoreVertical, Phone, ArrowLeft, Trash2, 
  CheckCircle, PlayCircle, Loader2, Sparkles, AlertCircle, Clock, Stethoscope,
  BarChart2, XCircle, Check, Edit2, Upload, Calendar, Search, 
  Ruler, Scale, Droplet, FileText, Activity, Save, X, Download, RotateCcw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LineChart, Line, Legend } from 'recharts';

import { 
  RelationInfo, Message, RelationFolder, Reminder, UserData 
} from './types';

import { 
  parseSchedule, generatePersonaVideo, 
  generatePersonaChatReply 
} from './services/geminiService';

import { nanuRepo } from './services/repository';

// --- Utility Components ---

const LoadingOverlay = ({ text }: { text: string }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-white p-6 rounded-2xl flex flex-col items-center shadow-2xl animate-in zoom-in duration-200 text-center max-w-sm">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
      <p className="font-bold text-slate-800 text-lg">{text}</p>
    </div>
  </div>
);

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-slate-200 transition-colors">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  </div>
);

const Avatar = ({ src, name, size = "md" }: { src?: string, name: string, size?: "sm"|"md"|"lg"|"xl" }) => {
  const [imgError, setImgError] = useState(false);
  const dims = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-24 h-24" };
  const initials = name ? name.substring(0, 2).toUpperCase() : "?";
  
  return (
    <div className={`${dims[size]} rounded-full flex-shrink-0 bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center relative`}>
      {src && !imgError ? (
        <img 
            src={src} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-slate-500 font-bold">{initials}</span>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'chats' | 'family' | 'meds' | 'stats' | 'profile'>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); 
  
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Add Member State
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [newMemberPersonality, setNewMemberPersonality] = useState('');

  // Edit Member State
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Stats View State
  const [statsViewMode, setStatsViewMode] = useState<'daily' | 'monthly'>('daily');

  // --- Initialization ---

  useEffect(() => {
    // Initial Load via Repository
    console.log('[DEBUG] App.tsx: Data loading started');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:97',message:'Data loading started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
      const d = nanuRepo.load();
      console.log('[DEBUG] App.tsx: Data loaded', { hasProfile: !!d?.profile, medCount: d?.medications?.length, relationCount: Object.keys(d?.relations || {}).length });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:101',message:'Data loaded successfully',data:{hasProfile:!!d?.profile,medCount:d?.medications?.length,relationCount:Object.keys(d?.relations||{}).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      setData(d);
    } catch (e) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:103',message:'Data loading failed',data:{error:e?.message,errorType:e?.constructor?.name,stack:e?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error("[DEBUG] App.tsx: Failed to load data", e);
      console.error("[DEBUG] App.tsx: Data loading error details:", {message: e?.message, name: e?.name, stack: e?.stack});
      // If load fails, try reset or show error
      try {
        nanuRepo.reset();
      } catch (resetError) {
        console.error("[DEBUG] App.tsx: Failed to reset repository:", resetError);
      }
    }
  }, []);

  // Persistence Hook
  useEffect(() => {
    if (data) {
      nanuRepo.save(data);
    }
  }, [data]);

  const reloadDemo = () => {
    if (window.confirm("This will reset all data to the initial demo state. Continue?")) {
      setIsLoading(true);
      setLoadingText("Restoring folder structure...");
      nanuRepo.reset(); 
    }
  };

  // --- Logic Helpers ---

  // Safety check: if data isn't loaded yet
  if (!data) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 flex-col">
      <Loader2 className="animate-spin text-emerald-600 w-10 h-10 mb-4"/>
      <p className="text-slate-500 font-medium">Loading MediMitra...</p>
    </div>
  );

  const { profile, medications, relations } = data;
  const relationsArray = relations ? Object.values(relations) : [];

  // --- Actions ---

  const handleOpenChat = (relationId: string) => {
    if (!relationId || !relations[relationId]) {
      console.error("Invalid relationId:", relationId);
      return;
    }
    setSelectedChatId(relationId);
    // Clear unread
    setData(prev => {
        if (!prev || !prev.relations[relationId]) return prev;
        return {
            ...prev,
            relations: {
                ...prev.relations,
                [relationId]: {
                    ...prev.relations[relationId],
                    unreadCount: 0
                }
            }
        };
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId || !text.trim()) return;
    const relation = relations[selectedChatId];
    if (!relation) {
      console.error("Relation not found for chatId:", selectedChatId);
      return;
    }
    
    // 1. Add User Message
    const newMsg: Message = {
        id: Date.now().toString(),
        senderId: 'user',
        type: 'text',
        content: text,
        timestamp: Date.now(),
        isRead: true
    };

    setData(prev => {
        if (!prev || !prev.relations[selectedChatId]) {
          console.error("Cannot add message: relation not found", selectedChatId);
          return prev;
        }
        return {
            ...prev,
            relations: {
                ...prev.relations,
                [selectedChatId]: {
                    ...prev.relations[selectedChatId],
                    chat: [...prev.relations[selectedChatId].chat, newMsg],
                    lastMessageTime: Date.now()
                }
            }
        }
    });

    // 2. AI Reply
    try {
        // Construct History for Gemini (last 10 messages, including the new one we just added)
        const chatWithNewMessage = [...relation.chat, newMsg];
        const historyForAi = chatWithNewMessage.slice(-10).map(m => ({
            role: m.senderId === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        // Show typing...
        // We just assume a delay naturally happens with await
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:206',message:'Calling generatePersonaChatReply',data:{relationName:relation.info.name,historyLength:historyForAi.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        const replyText = await generatePersonaChatReply(
            text,
            historyForAi,
            relation.info.name,
            relation.info.relationship,
            relation.info.personality
        );
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:212',message:'generatePersonaChatReply completed',data:{hasReply:!!replyText,replyLength:replyText?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        const replyMsg: Message = {
            id: (Date.now() + 1).toString(),
            senderId: relation.info.id,
            type: 'text',
            content: replyText || "👍",
            timestamp: Date.now(),
            isRead: selectedChatId === relation.info.id
        };

        setData(prev => {
            if (!prev || !prev.relations[selectedChatId]) {
              console.error("Cannot add reply: relation not found", selectedChatId);
              return prev;
            }
            return {
                ...prev,
                relations: {
                    ...prev.relations,
                    [selectedChatId]: {
                        ...prev.relations[selectedChatId],
                        chat: [...prev.relations[selectedChatId].chat, replyMsg],
                        unreadCount: selectedChatId === relation.info.id ? 0 : (prev.relations[selectedChatId].unreadCount || 0) + 1,
                        lastMessageTime: Date.now()
                    }
                }
            }
        });

    } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:231',message:'AI Reply Failed',data:{error:e?.message,errorType:e?.constructor?.name,stack:e?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        console.error("[DEBUG] App.tsx: AI Reply Failed", e);
        console.error("[DEBUG] App.tsx: Error details", {
            message: e?.message,
            name: e?.name,
            stack: e?.stack,
            selectedChatId,
            hasRelation: !!relation
        });
        // Add a fallback message to show the user something went wrong
        const errorMsg: Message = {
            id: (Date.now() + 2).toString(),
            senderId: relation.info.id,
            type: 'text',
            content: "Sorry, I'm having trouble responding right now. Please try again.",
            timestamp: Date.now(),
            isRead: false
        };
        setData(prev => {
            if (!prev || !prev.relations[selectedChatId]) return prev;
            return {
                ...prev,
                relations: {
                    ...prev.relations,
                    [selectedChatId]: {
                        ...prev.relations[selectedChatId],
                        chat: [...prev.relations[selectedChatId].chat, errorMsg],
                        lastMessageTime: Date.now()
                    }
                }
            };
        });
    }
  };

  const handleMedAction = (id: string, action: 'taken' | 'skipped') => {
      const today = new Date().toISOString().split('T')[0];
      setData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              medications: prev.medications.map(m => m.id === id ? {
                  ...m,
                  lastActionDate: today,
                  lastActionStatus: action,
                  history: [...m.history.filter(h => h.date !== today), { date: today, status: action }]
              } : m)
          }
      });
  };

  const handleMedUndo = (id: string) => {
      const today = new Date().toISOString().split('T')[0];
      setData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              medications: prev.medications.map(m => m.id === id ? {
                  ...m,
                  lastActionDate: undefined,
                  lastActionStatus: undefined,
                  history: m.history.filter(h => h.date !== today)
              } : m)
          }
      });
  };

  const handleGenerateVeo = async (msg: Message, relation: RelationInfo) => {
      setIsLoading(true);
      setLoadingText("Asking Google Veo...");
      try {
          const prompt = `Close-up of ${relation.name}, ${relation.age} years old ${relation.relationship}, saying: "${msg.content}"`;
          const videoUrl = await generatePersonaVideo(prompt, relation.photo);
          // Update message with video
          setData(prev => {
              if(!prev) return null;
              const rel = prev.relations[relation.id];
              return {
                  ...prev,
                  relations: {
                      ...prev.relations,
                      [relation.id]: {
                          ...rel,
                          chat: rel.chat.map(m => m.id === msg.id ? { ...m, metadata: { ...m.metadata, videoUrl } } : m)
                      }
                  }
              }
          });
      } catch(e) { alert("Video generation failed. Please try again."); }
      finally { setIsLoading(false); }
  };

  const handleAddMember = () => {
    if (!newMemberName || !newMemberRelation) return;
    const newId = `f_${Date.now()}`;
    const newMember: RelationFolder = {
      info: {
        id: newId,
        name: newMemberName,
        age: newMemberAge || '40',
        relationship: newMemberRelation,
        backwardRelationship: 'Relative',
        personality: newMemberPersonality || 'Caring',
        photo: `https://ui-avatars.com/api/?name=${newMemberName}&background=random`
      },
      chat: [],
      lastMessageTime: Date.now(),
      unreadCount: 0
    };

    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        relations: { ...prev.relations, [newId]: newMember }
      };
    });
    setShowAddMember(false);
    setNewMemberName('');
    setNewMemberRelation('');
    setNewMemberAge('');
    setNewMemberPersonality('');
  };

  const handleEditMemberStart = (id: string, currentName: string) => {
    setEditingMemberId(id);
    setEditName(currentName);
  };

  const handleSaveMemberEdit = () => {
    if (!editingMemberId || !editName) return;
    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        relations: {
          ...prev.relations,
          [editingMemberId]: {
            ...prev.relations[editingMemberId],
            info: { ...prev.relations[editingMemberId].info, name: editName }
          }
        }
      };
    });
    setEditingMemberId(null);
  };

  const handleDeleteMember = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this person?")) return;
    setData(prev => {
        if(!prev) return null;
        const newRels = { ...prev.relations };
        delete newRels[id];
        return { ...prev, relations: newRels };
    });
    setEditingMemberId(null);
  }

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Medicine,Status\n";
    medications.forEach(med => {
      med.history.forEach(h => {
        csvContent += `${h.date},${med.name},${h.status}\n`;
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "medimitra_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Views ---

  const ChatsView = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-emerald-600 p-4 text-white flex justify-between items-center shadow-md">
         <h1 className="text-xl font-bold">MediMitra Chats</h1>
         <div className="flex space-x-3">
            <Search className="w-6 h-6 opacity-80" />
            <MoreVertical className="w-6 h-6 opacity-80" />
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {relationsArray.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                <p>No chats yet.</p>
                <button onClick={() => setActiveTab('family')} className="text-emerald-600 font-bold mt-2">Add Family</button>
            </div>
        )}
        {relationsArray
         .sort((a,b) => b.lastMessageTime - a.lastMessageTime)
         .map(folder => {
            const { info, chat, unreadCount } = folder;
            const lastMsg = chat[chat.length - 1];
            const isDoctor = info.relationship.toLowerCase().includes('doctor');

            return (
                <div key={info.id} onClick={() => handleOpenChat(info.id)} className="flex items-center p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors active:bg-slate-100">
                    <Avatar src={info.photo} name={info.name} size="lg" />
                    <div className="ml-4 flex-1">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center">
                                {info.name}
                                {isDoctor && <Stethoscope className="w-4 h-4 ml-1 text-blue-500" />}
                            </h3>
                            <span className="text-xs text-slate-500">
                                {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'New'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-slate-600 text-sm truncate flex items-center max-w-[200px]">
                                {lastMsg ? (
                                    <>
                                        {lastMsg.type === 'video' && <Video className="w-3 h-3 mr-1 text-emerald-600 inline" />}
                                        {lastMsg.type === 'image' && <Camera className="w-3 h-3 mr-1 text-blue-600 inline" />}
                                        {lastMsg.type === 'video' ? 'Video Message' : (lastMsg.type === 'image' ? 'Image Shared' : lastMsg.content)}
                                    </>
                                ) : <span className="text-slate-400 italic">Tap to start chat</span>}
                            </p>
                            {unreadCount > 0 && (
                                <span className="bg-emerald-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
      <button onClick={() => setActiveTab('family')} className="absolute bottom-24 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-transform hover:scale-105 active:scale-95 z-20">
        <Users className="w-6 h-6" />
      </button>
    </div>
  );

  const ChatDetailView = () => {
      if (!selectedChatId) return null;
      const folder = relations[selectedChatId];
      if (!folder) {
        console.error("Folder not found for selectedChatId:", selectedChatId);
        return <div className="p-4 text-red-600">Chat not found. Please go back.</div>;
      }
      const { info, chat } = folder;
      const isDoctor = info.relationship.toLowerCase().includes('doctor');
      const messagesEndRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [chat]);

      return (
        <div className="flex flex-col h-full bg-[#e5ddd5]">
             <div className="bg-emerald-600 p-3 text-white flex items-center shadow-md z-10 sticky top-0">
                <button onClick={() => setSelectedChatId(null)} className="mr-2 p-1 hover:bg-emerald-700 rounded-full"><ArrowLeft className="w-6 h-6" /></button>
                <Avatar src={info.photo} name={info.name} size="sm" />
                <div className="ml-3 flex-1">
                    <h3 className="font-bold flex items-center">{info.name} {isDoctor && <Stethoscope className="w-4 h-4 ml-1 text-white" />}</h3>
                    <p className="text-xs opacity-90">{info.relationship}</p>
                </div>
                <Phone className="w-6 h-6 mr-3 opacity-90" />
                <Video className="w-6 h-6 opacity-90" />
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chat.length === 0 && <div className="text-center text-slate-500 text-sm mt-10 p-4 bg-white/50 rounded-lg mx-auto max-w-[80%]">Start a conversation with {info.name}...</div>}
                {chat.map(msg => {
                    const isMe = msg.senderId === 'user';
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-2 shadow-sm relative ${isMe ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                                {msg.type === 'video' ? (
                                    <div className="w-64">
                                        <div className="relative bg-black h-40 rounded-lg flex items-center justify-center overflow-hidden">
                                            {msg.metadata?.videoUrl ? (
                                                <video src={msg.metadata.videoUrl} controls className="w-full h-full" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                                    <p className="text-white text-xs mb-2 text-center px-2">"{msg.content}"</p>
                                                    <button onClick={() => handleGenerateVeo(msg, info)} className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center mx-auto hover:bg-emerald-500">
                                                        <PlayCircle className="w-3 h-3 mr-1" /> View Message (AI)
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : msg.type === 'image' ? (
                                     <div className="w-64"><img src={msg.metadata?.imageUrl} className="rounded-lg w-full h-auto" /><p className="text-sm mt-1">{msg.content}</p></div>
                                ) : (
                                    <div className={isDoctor && !isMe ? "text-blue-900" : "text-slate-800"}>{msg.content}</div>
                                )}
                                <span className="text-[10px] text-slate-500 block text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
             </div>
             <div className="p-2 bg-white flex items-center space-x-2">
                <input 
                    id="message-input"
                    className="flex-1 bg-slate-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Type a message..." 
                    onKeyDown={(e) => { 
                        if (e.key === 'Enter') { 
                            const input = e.currentTarget;
                            const text = input.value.trim();
                            if (text) {
                                handleSendMessage(text);
                                input.value = '';
                            }
                        } 
                    }} 
                />
                <button 
                    onClick={() => {
                        const input = document.getElementById('message-input') as HTMLInputElement;
                        if (input) {
                            const text = input.value.trim();
                            if (text) {
                                handleSendMessage(text);
                                input.value = '';
                            }
                        }
                    }}
                    className="bg-emerald-600 text-white p-3 rounded-full shadow-sm hover:bg-emerald-700"
                >
                    <Send className="w-5 h-5" />
                </button>
             </div>
        </div>
      );
  }

  const FamilyView = () => (
      <div className="p-4 bg-slate-50 h-full overflow-y-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center"><Users className="mr-2 text-emerald-600" /> My Family</h2>
          <div className="grid grid-cols-2 gap-4">
            {relationsArray.map(f => (
                <div key={f.info.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative group">
                    <button onClick={() => handleEditMemberStart(f.info.id, f.info.name)} className="absolute top-2 right-2 text-slate-300 hover:text-emerald-600 p-1"><Edit2 className="w-4 h-4" /></button>
                    <Avatar src={f.info.photo} name={f.info.name} size="xl" />
                    <h3 className="font-bold mt-2 text-lg">{f.info.name} <span className="text-slate-400 text-sm font-normal">({f.info.age})</span></h3>
                    <p className="text-emerald-600 text-sm font-medium">{f.info.relationship}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic min-h-[2.5em]">"{f.info.personality}"</p>
                    <button onClick={() => handleOpenChat(f.info.id)} className="mt-3 text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">Chat</button>
                </div>
            ))}
          </div>
          <button onClick={() => setShowAddMember(true)} className="w-full mt-4 py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors">
            <Plus className="mr-2" /> Add New Family Member
          </button>
      </div>
  );

  const MedsView = () => {
    const today = new Date().toISOString().split('T')[0];
    const sorted = [...medications].sort((a,b) => (a.lastActionDate === today ? 1 : -1));
    return (
        <div className="p-4 bg-slate-50 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center"><Pill className="mr-2 text-emerald-600" /> Medicines & Habits</h2>
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                <textarea className="w-full border p-3 rounded-lg mb-2 h-20 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Type here to add (e.g. Iron pill daily at 10am)" />
                <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700">Add to Schedule</button>
            </div>
            <div className="space-y-3 pb-24">
                {sorted.map(r => {
                    const done = r.lastActionDate === today;
                    return (
                        <div key={r.id} className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm ${done ? 'opacity-60 bg-slate-100' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-bold text-lg ${done ? 'line-through' : ''}`}>{r.name}</h4>
                                    <p className="text-slate-500 flex items-center text-sm"><Clock className="w-4 h-4 mr-1" /> {r.time} • {r.frequency}</p>
                                    {r.instructions && <p className="text-xs text-orange-600 mt-1">{r.instructions}</p>}
                                </div>
                                {!done ? (
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleMedAction(r.id, 'taken')} className="bg-green-100 p-3 rounded-full text-green-600 hover:bg-green-200"><Check className="w-6 h-6" /></button>
                                        <button onClick={() => handleMedAction(r.id, 'skipped')} className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200"><XCircle className="w-6 h-6" /></button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${r.lastActionStatus === 'taken' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {r.lastActionStatus === 'taken' ? 'Taken' : 'Skipped'}
                                        </div>
                                        <button onClick={() => handleMedUndo(r.id)} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full border border-slate-200 hover:border-slate-400" title="Undo"><RotateCcw className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  const StatsView = () => {
      // Calculate Stats based on view mode
      let chartData: any[] = [];
      const historyFlat = medications.flatMap(m => m.history.map(h => ({...h, medName: m.name})));

      if (statsViewMode === 'daily') {
          // Last 7 days breakdown
          const last7Days = Array.from({length: 7}, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              return d.toISOString().split('T')[0];
          });

          chartData = last7Days.map(date => {
              const dayRecs = historyFlat.filter(h => h.date === date);
              const taken = dayRecs.filter(h => h.status === 'taken').length;
              const skipped = dayRecs.filter(h => h.status === 'skipped').length;
              return { name: date.substring(5), taken, skipped, total: taken+skipped };
          });
      } else {
          // Monthly view (last 30 days) - Adherence Percentage
          const last30Days = Array.from({length: 30}, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (29 - i));
              return d.toISOString().split('T')[0];
          });
          chartData = last30Days.map(date => {
              const dayRecs = historyFlat.filter(h => h.date === date);
              const taken = dayRecs.filter(h => h.status === 'taken').length;
              const total = dayRecs.length;
              const percentage = total > 0 ? Math.round((taken/total)*100) : 0;
              return { name: date.substring(8), percentage };
          });
      }
      
      return (
        <div className="p-6 bg-slate-50 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center"><BarChart2 className="mr-2 text-emerald-600" /> Stats</h2>
                <div className="flex bg-slate-200 rounded-lg p-1">
                    <button onClick={() => setStatsViewMode('daily')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${statsViewMode === 'daily' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}>Daily</button>
                    <button onClick={() => setStatsViewMode('monthly')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${statsViewMode === 'monthly' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}>Monthly</button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">
                    {statsViewMode === 'daily' ? 'Last 7 Days (Taken vs Skipped)' : 'Monthly Adherence %'}
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {statsViewMode === 'daily' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Legend iconType="circle" wrapperStyle={{fontSize:'12px', paddingTop:'10px'}} />
                                <Bar dataKey="taken" name="Taken" stackId="a" fill="#10b981" radius={[0,0,4,4]} barSize={20} />
                                <Bar dataKey="skipped" name="Skipped" stackId="a" fill="#ef4444" radius={[4,4,0,0]} barSize={20} />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={2} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip cursor={{stroke: '#e2e8f0'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Line type="monotone" dataKey="percentage" name="Adherence %" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            <button onClick={generateCSV} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-200 border border-slate-200">
                <Download className="mr-2 w-5 h-5" /> Download CSV Report
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 px-8">Downloading the report will allow you to share your detailed adherence history with your doctor.</p>
        </div>
      );
  }

  const ProfileView = () => (
    <div className="p-6 bg-slate-50 h-full overflow-y-auto pb-24">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><User className="mr-2 text-emerald-600" /> My Profile</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm relative shrink-0">
                <Avatar src={profile.userPhoto} name={profile.userName} size="xl" />
            </div>
            <div className="ml-6">
                <h3 className="text-2xl font-bold text-slate-800">{profile.medical.fullName}</h3>
                <p className="text-slate-500 font-medium">Age: {profile.medical.age}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                 <Droplet className="w-6 h-6 text-blue-500 mb-1" /><span className="text-xs text-blue-400 font-bold uppercase">Blood</span><span className="text-xl font-bold text-blue-700">{profile.medical.bloodType}</span>
            </div>
             <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                 <Ruler className="w-6 h-6 text-purple-500 mb-1" /><span className="text-xs text-purple-400 font-bold uppercase">Height</span><span className="text-xl font-bold text-purple-700">{profile.medical.height}</span>
            </div>
             <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col items-center justify-center text-center">
                 <Scale className="w-6 h-6 text-orange-500 mb-1" /><span className="text-xs text-orange-400 font-bold uppercase">Weight</span><span className="text-xl font-bold text-orange-700">{profile.medical.weight}</span>
            </div>
             <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center justify-center text-center">
                 <Activity className="w-6 h-6 text-green-500 mb-1" /><span className="text-xs text-green-400 font-bold uppercase">Status</span><span className="text-xl font-bold text-green-700">Stable</span>
            </div>
        </div>
        <h4 className="font-bold text-slate-700 mb-3 flex items-center"><Phone className="w-4 h-4 mr-2" /> Emergency Contact</h4>
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div>
                <p className="font-bold text-red-900 text-lg">{profile.medical.emergencyContactName}</p>
                <p className="text-red-600 text-sm">{profile.medical.emergencyContactRelation} • {profile.medical.emergencyContactPhone}</p>
            </div>
            <a href={`tel:${profile.medical.emergencyContactPhone}`} className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700"><Phone className="w-5 h-5" /></a>
        </div>
        <button onClick={reloadDemo} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-slate-200 border border-slate-200">
            <PlayCircle className="mr-2 w-5 h-5" /> Reset / Reload Demo
        </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {isLoading && <LoadingOverlay text={loadingText} />}
      
      {/* Add Member Modal */}
      {showAddMember && (
        <Modal title="Add Family Member" onClose={() => setShowAddMember(false)}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                    <input autoFocus value={newMemberName} onChange={e=>setNewMemberName(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="e.g. Soniya" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Relationship</label>
                    <input value={newMemberRelation} onChange={e=>setNewMemberRelation(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="e.g. Daughter" />
                </div>
                <div className="flex space-x-3">
                   <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Age</label>
                      <input type="number" value={newMemberAge} onChange={e=>setNewMemberAge(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="e.g. 35" />
                   </div>
                   <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Personality</label>
                      <input value={newMemberPersonality} onChange={e=>setNewMemberPersonality(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="e.g. Caring" />
                   </div>
                </div>
                <button onClick={handleAddMember} disabled={!newMemberName} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50">Save</button>
            </div>
        </Modal>
      )}

      {/* Edit Member Modal */}
      {editingMemberId && (
          <Modal title="Edit Member" onClose={() => setEditingMemberId(null)}>
               <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                    <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} className="w-full border p-2 rounded-lg" />
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => handleDeleteMember(editingMemberId)} className="flex-1 bg-red-100 text-red-700 py-3 rounded-lg font-bold hover:bg-red-200 flex items-center justify-center"><Trash2 className="w-4 h-4 mr-2" /> Delete</button>
                    <button onClick={handleSaveMemberEdit} className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700">Save</button>
                </div>
            </div>
          </Modal>
      )}

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'chats' && (selectedChatId ? <ChatDetailView /> : <ChatsView />)}
        {activeTab === 'family' && <FamilyView />}
        {activeTab === 'meds' && <MedsView />}
        {activeTab === 'stats' && <StatsView />}
        {activeTab === 'profile' && <ProfileView />}
      </div>
      <nav className="bg-white border-t border-slate-200 flex justify-around p-2 pb-safe">
        {['chats','family','meds','stats','profile'].map(t => (
            <button key={t} onClick={() => { setActiveTab(t as any); setSelectedChatId(null); }} className={`flex flex-col items-center p-2 ${activeTab === t ? 'text-emerald-600' : 'text-slate-400'}`}>
                {t === 'chats' && <MessageCircle className="w-6 h-6 mb-1" />}
                {t === 'family' && <Users className="w-6 h-6 mb-1" />}
                {t === 'meds' && <Pill className="w-6 h-6 mb-1" />}
                {t === 'stats' && <BarChart2 className="w-6 h-6 mb-1" />}
                {t === 'profile' && <User className="w-6 h-6 mb-1" />}
                <span className="text-[10px] font-bold capitalize">{t}</span>
            </button>
        ))}
      </nav>
    </div>
  );
}