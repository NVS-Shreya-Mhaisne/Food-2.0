import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Components/Context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Plus, 
  Check, 
  ArrowLeft, 
  ShoppingBag, 
  RotateCcw, 
  Copy, 
  Utensils, 
  ChefHat, 
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  Sparkles,
  Clock,
  Heart,
  Mic,
  MicOff,
  Image as ImageIcon,
  Camera,
  X,
  Flame,
  Dumbbell,
  Layers,
  Info,
  CheckCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../Components/Auth/AuthModal';

const LOCAL_STORAGE_CHATS_KEY = 'cravely_ai_chat_sessions';
const LOCAL_STORAGE_ACTIVE_ID_KEY = 'cravely_ai_active_chat_id';

const parseInlineFormatting = (text) => {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2).trim();
      return <strong key={i} className="font-bold text-text-dark dark:text-[#f4f1ea]">{inner}</strong>;
    }
    return part;
  });
};

const renderFormattedBotMessage = (rawText) => {
  if (!rawText) return null;

  const cleaned = rawText.replace(/\n{3,}/g, '\n\n').trim();
  const lines = cleaned.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^#{2,3}\s+/, '').replace(/\*\*/g, '');
          return (
            <h4 key={idx} className="font-bold text-xs sm:text-sm text-primary dark:text-amber-400 pt-1.5 pb-0.5 flex items-center gap-1.5">
              <span>{headingText}</span>
            </h4>
          );
        }

        if (/^[\*\-]\s+/.test(trimmed)) {
          const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-primary text-xs leading-none mt-1 shrink-0">•</span>
              <span className="flex-1 leading-snug">{parseInlineFormatting(bulletText)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-primary font-bold text-xs font-mono shrink-0">{numMatch[1]}.</span>
              <span className="flex-1 leading-snug">{parseInlineFormatting(numMatch[2])}</span>
            </div>
          );
        }

        if (/^---|\*\*\*$/.test(trimmed)) {
          return <hr key={idx} className="border-gray-200 dark:border-white/10 my-2" />;
        }
        return (
          <p key={idx} className="leading-snug">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const AiAssistantPage = () => {
  const { addToCart, addMultipleToCart, food_list, url, token, likedFoods, toggleLikeFood } = useContext(StoreContext);
  const navigate = useNavigate();
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [addedCardId, setAddedCardId] = useState(null);
  const [addedBundleId, setAddedBundleId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedDishDetail, setSelectedDishDetail] = useState(null);

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Current Time Formatter
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const createDefaultMessages = () => [
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I'm Cravely AI, your personal food nutritionist & assistant.\n\nAsk me for custom diet plans (e.g. *High-protein dinner under 600 kcal*), instant recipe combos, meal bundles with 1-click ordering, voice commands, or upload food photos to find matching dishes!",
      time: getCurrentTime(),
      suggestedDishes: [],
      mealBundle: null
    }
  ];

  const getUserStorageKey = (prefix) => {
    if (!token) return `${prefix}_guest`;
    try {
      return `${prefix}_${token.slice(-16)}`;
    } catch {
      return `${prefix}_guest`;
    }
  };

  const [sessions, setSessions] = useState(() => {
    try {
      const storageKey = getUserStorageKey(LOCAL_STORAGE_CHATS_KEY);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse saved chats:", e);
    }
    const initialId = Date.now().toString();
    return [{
      id: initialId,
      title: "New Conversation",
      createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      messages: createDefaultMessages()
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const activeStorageKey = getUserStorageKey(LOCAL_STORAGE_ACTIVE_ID_KEY);
    const savedActiveId = localStorage.getItem(activeStorageKey);
    if (savedActiveId && sessions.some(s => s.id === savedActiveId)) {
      return savedActiveId;
    }
    return sessions[0]?.id || Date.now().toString();
  });

  // Reload sessions on token switch
  useEffect(() => {
    const storageKey = getUserStorageKey(LOCAL_STORAGE_CHATS_KEY);
    const activeStorageKey = getUserStorageKey(LOCAL_STORAGE_ACTIVE_ID_KEY);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          const savedActiveId = localStorage.getItem(activeStorageKey);
          if (savedActiveId && parsed.some(s => s.id === savedActiveId)) {
            setActiveSessionId(savedActiveId);
          } else {
            setActiveSessionId(parsed[0].id);
          }
          return;
        }
      }
    } catch (e) {
      console.error("Failed to switch user chats:", e);
    }

    const freshId = Date.now().toString();
    const freshSessions = [{
      id: freshId,
      title: "New Conversation",
      createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      messages: createDefaultMessages()
    }];
    setSessions(freshSessions);
    setActiveSessionId(freshId);
  }, [token]);

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = currentSession ? currentSession.messages : [];

  useEffect(() => {
    try {
      const storageKey = getUserStorageKey(LOCAL_STORAGE_CHATS_KEY);
      const activeStorageKey = getUserStorageKey(LOCAL_STORAGE_ACTIVE_ID_KEY);
      localStorage.setItem(storageKey, JSON.stringify(sessions));
      localStorage.setItem(activeStorageKey, activeSessionId);
    } catch (e) {
      console.error("Failed to save chats to storage:", e);
    }
  }, [sessions, activeSessionId, token]);

  const promptSuggestions = [
    "🔥 High-protein dinner under 600 kcal for 2",
    "🥗 Healthy weight loss combo under ₹300",
    "🥑 Keto-friendly meal with high protein",
    "🍕 Best comfort food feast for movie night",
    "⚡ Fast post-workout recovery meal"
  ];

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeSessionId]);

  // Web Speech API Voice Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateCurrentSessionMessages = (newMessages, customTitle = null) => {
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === activeSessionId) {
          let updatedTitle = session.title;
          if (customTitle) {
            updatedTitle = customTitle;
          } else if (session.title === "New Conversation" && newMessages.length > 1) {
            const firstUserMsg = newMessages.find(m => m.sender === 'user');
            if (firstUserMsg && firstUserMsg.text) {
              updatedTitle = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? "..." : "");
            }
          }
          return {
            ...session,
            title: updatedTitle,
            messages: newMessages
          };
        }
        return session;
      })
    );
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: "New Conversation",
      createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      messages: createDefaultMessages()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setInputQuery("");
    clearSelectedImage();
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setInputQuery("");
    clearSelectedImage();
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== sessionId);
    if (filtered.length === 0) {
      const freshId = Date.now().toString();
      const freshSession = {
        id: freshId,
        title: "New Conversation",
        createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        messages: createDefaultMessages()
      };
      setSessions([freshSession]);
      setActiveSessionId(freshId);
    } else {
      setSessions(filtered);
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
    }
  };

  const handleClearAllChats = () => {
    const freshId = Date.now().toString();
    const freshSession = {
      id: freshId,
      title: "New Conversation",
      createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      messages: createDefaultMessages()
    };
    setSessions([freshSession]);
    setActiveSessionId(freshId);
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Send message or food photo
  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputQuery;
    const hasImage = !!selectedImagePreview;

    if (!queryText.trim() && !hasImage) return;
    if (isTyping) return;

    const time = getCurrentTime();

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: queryText || "Analyze this food image",
      image: selectedImagePreview || null,
      time: time
    };

    const updatedMessages = [...messages, userMsg];
    updateCurrentSessionMessages(updatedMessages);
    setInputQuery("");
    const imagePayload = selectedImagePreview;
    clearSelectedImage();
    setIsTyping(true);

    try {
      let response;
      if (hasImage && imagePayload) {
        // Send to Multimodal Image Vision API
        response = await axios.post(`${url}/api/ai/analyze-image`, {
          imageBase64: imagePayload,
          mimeType: selectedImage?.type || "image/jpeg"
        });
      } else {
        // Regular Text Chat API
        response = await axios.post(`${url}/api/ai/chat`, {
          message: queryText,
          history: updatedMessages
        });
      }

      const replyText = response.data?.reply || "I'm sorry, I couldn't generate a response. Please try again.";
      const returnedBundle = response.data?.mealBundle || null;
      let matchedDishes = response.data?.suggestedDishes || [];

      // Fallback matching against food_list if none returned by backend
      if (matchedDishes.length === 0) {
        matchedDishes = (food_list || []).filter(dish => {
          if (!dish.name) return false;
          const regex = new RegExp(`\\b${dish.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          return regex.test(replyText);
        }).slice(0, 3);
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        time: getCurrentTime(),
        suggestedDishes: matchedDishes,
        mealBundle: returnedBundle
      };

      updateCurrentSessionMessages([...updatedMessages, botMsg]);
    } catch (error) {
      console.error("AI Assistant API error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: error.response?.data?.message || "Sorry, I am having trouble connecting to the AI server. Please check your connection and try again.",
        time: getCurrentTime(),
        suggestedDishes: [],
        mealBundle: null
      };
      updateCurrentSessionMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // 1-Click "Add All to Cart" for Meal Bundles
  const handleAddBundleToCart = (bundle) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    if (!bundle || !bundle.items || bundle.items.length === 0) return;

    const itemIds = bundle.items.map(item => item._id || item.id).filter(Boolean);
    addMultipleToCart(itemIds);
    setAddedBundleId(bundle.bundleTitle);
    setTimeout(() => {
      setAddedBundleId(null);
    }, 2000);
  };

  // Individual Add to Cart
  const handleAddToCart = (dish) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    const dishId = dish._id || dish.id;
    addToCart(dishId);
    setAddedCardId(dishId);
    setTimeout(() => {
      setAddedCardId(null);
    }, 1500);
  };

  // Login-Protected Like / Favorite
  const handleToggleLike = (dishId) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    toggleLikeFood(dishId);
  };

  return (
    <div className="h-[calc(100vh-70px)] sm:h-[calc(100vh-80px)] bg-bg-warm dark:bg-[#150e0b] text-text-dark dark:text-[#f4f1ea] flex font-sans transition-colors duration-300 overflow-hidden relative">
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Quick Details Modal for AI Dishes */}
      <AnimatePresence>
        {selectedDishDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#221814] border border-gray-200 dark:border-white/10 rounded-3xl p-5 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedDishDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                {selectedDishDetail.image ? (
                  <img
                    src={selectedDishDetail.image.startsWith('http') ? selectedDishDetail.image : `${url}/images/${selectedDishDetail.image}`}
                    alt={selectedDishDetail.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Utensils className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <h3 className="font-serif font-bold text-base text-text-dark dark:text-[#f4f1ea]">
                    {selectedDishDetail.name}
                  </h3>
                  <span className="font-mono text-base font-black text-primary">
                    ₹{selectedDishDetail.price}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-[#d3cfc4] leading-relaxed mb-4">
                {selectedDishDetail.description || selectedDishDetail.reason || "Freshly handcrafted by our top culinary chefs using premium ingredients."}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/40 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-[#a09a8e]">Estimated Calories</p>
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">
                      {selectedDishDetail.estimatedCalories || "340 kcal"}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-[#a09a8e]">Estimated Protein</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {selectedDishDetail.estimatedProtein || "22g"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(selectedDishDetail);
                  setSelectedDishDetail(null);
                }}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart (₹{selectedDishDetail.price})</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. LEFT SIDEBAR: ChatGPT-Style Chat History */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed md:static inset-y-0 left-0 z-50 w-72 md:w-68 lg:w-72 bg-white dark:bg-[#1f1612] border-r border-gray-200 dark:border-white/10 flex flex-col justify-between shadow-xl md:shadow-none shrink-0 overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="p-3.5 border-b border-gray-150 dark:border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={handleNewChat}
                  className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all cursor-pointer group"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                  <span>New Chat</span>
                </button>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-[#a09a8e] transition-colors cursor-pointer"
                  title="Close sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Chat List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1 min-h-0">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-[#8696a0] flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>Previous Chats</span>
                </div>

                {sessions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">
                    No chat history yet
                  </div>
                ) : (
                  sessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    return (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session.id)}
                        className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary font-bold border border-primary/20'
                            : 'text-gray-700 dark:text-[#d3cfc4] hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                          <div className="truncate">
                            <p className="truncate text-xs leading-tight">{session.title}</p>
                            <span className="text-[10px] font-mono text-gray-400 dark:text-[#8696a0] font-normal">{session.createdAt}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded-md transition-opacity cursor-pointer text-gray-400"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-3 border-t border-gray-150 dark:border-white/10 bg-gray-50/50 dark:bg-[#19110d] flex items-center justify-between text-xs">
                <button
                  onClick={handleClearAllChats}
                  className="flex items-center gap-1.5 text-gray-500 dark:text-[#a09a8e] hover:text-red-500 dark:hover:text-red-400 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear all chats</span>
                </button>

                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 font-mono">
                  <Sparkles className="w-3 h-3" />
                  <span>Cravely AI 2.0</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. MAIN CONVERSATION CONTAINER */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
        
        {/* Top Chat Header */}
        <div className="bg-white/90 dark:bg-[#211814]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center gap-2.5">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#352723] text-gray-600 dark:text-[#d3cfc4] transition-colors cursor-pointer"
                title="Open Previous Chats"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <button 
              onClick={() => navigate(-1)} 
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#352723] text-gray-600 dark:text-[#d3cfc4] transition-colors cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-amber-500 p-0.5 flex-shrink-0 shadow-sm">
              <div className="w-full h-full rounded-[10px] bg-[#111b21] flex items-center justify-center text-white">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div>
              <h1 className="text-sm sm:text-base font-bold font-serif leading-tight">
                {currentSession?.title || "Cravely AI Assistant"}
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-[#8696a0] font-mono hidden sm:block">Smart Diet & Culinary Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#352723] hover:bg-gray-200 dark:hover:bg-[#43322d] text-gray-700 dark:text-[#d3cfc4] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Start New Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <button 
              onClick={() => navigate('/cart')}
              className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Chat Messages List */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 space-y-4 overflow-y-auto min-h-0"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[94%] sm:max-w-[88%]">
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary to-amber-500 p-0.5 shrink-0 mt-0.5 hidden sm:block">
                    <div className="w-full h-full rounded-[10px] bg-[#111b21] flex items-center justify-center text-white">
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  </div>
                )}

                {msg.sender === 'user' ? (
                  <div className="relative px-3.5 py-2.5 rounded-2xl bg-primary text-white rounded-tr-xs ml-auto shadow-xs text-xs sm:text-sm font-sans flex flex-col gap-2 max-w-full text-left">
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded food query"
                        className="w-48 h-32 object-cover rounded-xl border border-white/20 shadow-xs mb-1"
                      />
                    )}
                    <div className="flex items-end justify-between gap-3">
                      <p className="whitespace-pre-line leading-snug break-words">{msg.text}</p>
                      <span className="text-[9px] font-mono text-white/70 shrink-0 self-end leading-none pb-0.5">{msg.time}</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative px-4 py-3.5 rounded-2xl bg-white dark:bg-[#221814] border border-gray-150 dark:border-white/10 text-text-dark dark:text-[#f4f1ea] rounded-tl-xs shadow-xs text-xs sm:text-sm font-sans text-left space-y-3">
                    {/* Bot Message Formatted Text */}
                    {renderFormattedBotMessage(msg.text)}

                    {/* Copy Button & Timestamp */}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-4 text-[10px] font-mono text-gray-400 dark:text-[#8696a0]">
                      <span>{msg.time}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 🌟 SMART MEAL BUNDLE CARD (Diet Assistant / 1-Click Add All to Cart) */}
              {msg.mealBundle && msg.mealBundle.items && msg.mealBundle.items.length > 0 && (
                <div className="w-full max-w-xl mt-3 ml-0 sm:ml-9">
                  <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-primary/5 to-transparent border border-primary/30 dark:border-amber-500/30 p-4 shadow-sm text-left">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-text-dark dark:text-[#f4f1ea]">
                            {msg.mealBundle.bundleTitle || "Custom Meal Bundle"}
                          </h4>
                          <span className="text-[10px] font-mono text-primary dark:text-amber-400 font-bold">
                            {msg.mealBundle.dietTag || "Diet Plan"} • {msg.mealBundle.servings ? `Serves ${msg.mealBundle.servings}` : "Single Serving"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900/50">
                          🔥 {msg.mealBundle.totalCalories}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-900/50">
                          💪 {msg.mealBundle.totalProtein}
                        </span>
                      </div>
                    </div>

                    {/* Bundle Dishes Breakdown */}
                    <div className="space-y-1.5 my-3 border-y border-gray-200/60 dark:border-white/10 py-2.5">
                      {msg.mealBundle.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 px-1 rounded-lg hover:bg-white/40 dark:hover:bg-white/5">
                          <div className="flex items-center gap-2 truncate flex-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="font-semibold text-text-dark dark:text-[#f4f1ea] truncate">{item.name}</span>
                            {item.reason && (
                              <span className="text-[10px] text-gray-400 hidden sm:inline truncate">({item.reason})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0 font-mono">
                            <span className="text-[10px] text-gray-500 dark:text-[#8696a0]">{item.estimatedProtein || ""}</span>
                            <span className="font-bold text-primary">₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bundle Footer & Add All to Cart Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono block">Bundle Total</span>
                        <span className="font-mono text-base font-black text-primary">
                          ₹{msg.mealBundle.totalPrice}
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAddBundleToCart(msg.mealBundle)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                          addedBundleId === msg.mealBundle.bundleTitle
                            ? 'bg-emerald-500 text-white'
                            : 'bg-primary hover:bg-primary-hover text-white'
                        }`}
                      >
                        {addedBundleId === msg.mealBundle.bundleTitle ? (
                          <>
                            <CheckCheck className="w-4 h-4" />
                            <span>Added to Cart! 🎉</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add All to Cart (₹{msg.mealBundle.totalPrice})</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Suggested Individual Dish Cards */}
              {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                <div className="w-full max-w-xl mt-2.5 ml-0 sm:ml-9 space-y-2">
                  <div className="text-[11px] font-bold text-gray-500 dark:text-[#a09a8e] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <ChefHat className="w-3.5 h-3.5 text-primary" />
                    <span>Recommended From Menu ({msg.suggestedDishes.length})</span>
                  </div>

                  {msg.suggestedDishes.map((dish) => {
                    const dishId = dish._id || dish.id;
                    const dishImage = dish.image 
                      ? (dish.image.startsWith('http') ? dish.image : `${url}/images/${dish.image}`)
                      : "";
                    const isLiked = likedFoods?.[dishId] || false;

                    return (
                      <div
                        key={dishId}
                        className="bg-white dark:bg-[#221814] border border-gray-200 dark:border-white/10 rounded-2xl p-3 flex items-center gap-3.5 shadow-xs hover:border-primary/40 transition-all text-left group"
                      >
                        {dishImage ? (
                          <img
                            src={dishImage}
                            alt={dish.name}
                            className="w-13 h-13 rounded-xl object-cover flex-shrink-0 bg-gray-100 cursor-pointer"
                            onClick={() => setSelectedDishDetail(dish)}
                          />
                        ) : (
                          <div 
                            onClick={() => setSelectedDishDetail(dish)}
                            className="w-13 h-13 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Utensils className="w-5 h-5 text-primary" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h5 
                              onClick={() => setSelectedDishDetail(dish)}
                              className="font-bold text-xs sm:text-sm text-text-dark dark:text-[#f4f1ea] truncate cursor-pointer hover:text-primary transition-colors"
                            >
                              {dish.name}
                            </h5>
                            <span className="font-mono text-sm font-black text-primary flex-shrink-0">
                              ₹{dish.price}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-500 dark:text-[#a09a8e] font-medium truncate mb-1">
                            {dish.description || dish.category || "Freshly prepared"}
                          </p>

                          <div className="flex items-center justify-between pt-0.5">
                            <button
                              onClick={() => setSelectedDishDetail(dish)}
                              className="text-[10px] font-mono text-gray-400 dark:text-[#8696a0] hover:text-primary flex items-center gap-1 cursor-pointer"
                            >
                              <Info className="w-3 h-3" /> View Macros
                            </button>

                            <div className="flex items-center gap-2">
                              {/* Like Button */}
                              <button
                                onClick={() => handleToggleLike(dishId)}
                                type="button"
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isLiked 
                                    ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-800' 
                                    : 'border-gray-200 dark:border-white/10 text-gray-400 hover:text-rose-500'
                                }`}
                                title={isLiked ? "Unlike" : "Like"}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                              </button>

                              {/* Add to Cart Button */}
                              <button
                                onClick={() => handleAddToCart(dish)}
                                type="button"
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                                  addedCardId === dishId
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-primary hover:bg-primary-hover text-white shadow-xs'
                                }`}
                              >
                                {addedCardId === dishId ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Add</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2.5 text-xs text-gray-500 bg-white dark:bg-[#221814] border border-gray-200 dark:border-white/10 px-3.5 py-2 rounded-2xl w-fit rounded-tl-xs shadow-xs ml-0 sm:ml-9">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-medium">Cravely AI is preparing recommendations...</span>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="max-w-3xl w-full mx-auto p-3 sm:px-6 space-y-2 shrink-0 border-t border-gray-200/50 dark:border-white/10">
          
          {/* Selected Image Preview Pill */}
          <AnimatePresence>
            {selectedImagePreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2.5 bg-primary/10 border border-primary/30 p-2 rounded-xl w-fit"
              >
                <img
                  src={selectedImagePreview}
                  alt="Attachment preview"
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="text-xs">
                  <p className="font-bold text-text-dark dark:text-[#f4f1ea]">Food Photo Attached</p>
                  <p className="text-[10px] text-gray-500 dark:text-[#8696a0]">Ready for AI visual discovery</p>
                </div>
                <button
                  onClick={clearSelectedImage}
                  className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Prompt Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {promptSuggestions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                type="button"
                className="px-3 py-1 rounded-full bg-white dark:bg-[#221814] border border-gray-200 dark:border-white/10 hover:border-primary text-[11px] font-semibold text-gray-700 dark:text-[#d3cfc4] hover:text-primary whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Hidden File Input for Image Analysis */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Chat Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="bg-white dark:bg-[#221814] border border-gray-200 dark:border-white/10 rounded-2xl p-2 px-3 sm:px-4 flex items-center gap-2 shadow-md focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all"
          >
            {/* Camera / Image Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-xl text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Upload Food Photo to Analyze"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceListening}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
              title={isListening ? "Listening... Click to stop" : "Speak to Order"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isListening 
                  ? "Listening to your voice command..." 
                  : selectedImagePreview 
                  ? "Ask about this dish or press Send..." 
                  : "Ask about diets, high protein, calorie plans, recipes..."
              }
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-text-dark dark:text-[#f4f1ea] placeholder-gray-400 focus:outline-none font-medium"
            />

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={(!inputQuery.trim() && !selectedImagePreview) || isTyping}
              className={`p-2 rounded-xl text-white cursor-pointer shadow-sm flex-shrink-0 transition-all ${
                (inputQuery.trim() || selectedImagePreview) && !isTyping
                  ? 'bg-primary hover:bg-primary-hover opacity-100' 
                  : 'bg-gray-300 dark:bg-gray-700 opacity-60 cursor-not-allowed'
              }`}
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </motion.button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AiAssistantPage;