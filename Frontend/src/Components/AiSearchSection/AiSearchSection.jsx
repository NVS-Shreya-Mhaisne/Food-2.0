import React, { useState, useRef, useEffect, useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Sparkles,
    Send,
    Plus,
    Check,
    CheckCheck,
    Star,
    Clock,
    Zap,
    X,
    Phone,
    Video,
    Smile,
    Paperclip,
    Mic
} from 'lucide-react';

import card_paneer_wrap from '../../assets/card_paneer_wrap.png';
import card_chicken_rice from '../../assets/card_chicken_rice.png';
import card_tuscan_pasta from '../../assets/card_tuscan_pasta.png';
import { menu_list } from '../../assets/assets';

const AiSearchSection = () => {
    const { addToCart } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const [inputQuery, setInputQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [addedCardId, setAddedCardId] = useState(null);
    const chatEndRef = useRef(null);
    const [dragConstraints, setDragConstraints] = useState({ left: -800, right: 0, top: -600, bottom: 0 });

    useEffect(() => {
        const updateConstraints = () => {
            setDragConstraints({
                left: -window.innerWidth + 80,
                right: 0,
                top: -window.innerHeight + 80,
                bottom: 0
            });
        };
        updateConstraints();
        window.addEventListener('resize', updateConstraints);
        return () => window.removeEventListener('resize', updateConstraints);
    }, []);

    // Current Time Formatter for WhatsApp timestamps (e.g. 10:45 PM)
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Dynamic Food Recommendation Cards
    const recommendedCards = [
        {
            id: "ai_paneer_wrap",
            name: "Smokey Paneer Tikka Wrap",
            price: 240,
            formattedPrice: "₹240",
            rating: 4.8,
            prepTime: "12 mins",
            matchScore: "99% AI Match",
            matchReason: "Protein packed & under ₹300 budget",
            image: card_paneer_wrap
        },
        {
            id: "ai_chicken_rice",
            name: "Herbed Chicken & Basmati Rice",
            price: 280,
            formattedPrice: "₹280",
            rating: 4.9,
            prepTime: "18 mins",
            matchScore: "97% AI Match",
            matchReason: "Balanced full meal under ₹300",
            image: card_chicken_rice
        },
        {
            id: "ai_tuscan_pasta",
            name: "Creamy Tuscan Garlic Pasta",
            price: 290,
            formattedPrice: "₹290",
            rating: 4.7,
            prepTime: "15 mins",
            matchScore: "95% AI Match",
            matchReason: "Chef's gourmet pick under ₹300",
            image: card_tuscan_pasta
        }
    ];

    // Initial WhatsApp Chat Messages Stream
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: "Hey! 👋 I'm your Cravely AI Food Assistant. What are you in the mood for today?",
            time: getCurrentTime(),
            showCards: false,
            showStartOptions: true
        }
    ]);

    // Quick WP Suggestion Chips
    const promptChips = [
        "Need dinner under ₹300",
        "High protein lunch",
        "Comfort food under 20 mins"
    ];

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = (textToSend) => {
        const queryText = textToSend || inputQuery;
        if (!queryText.trim()) return;

        const time = getCurrentTime();

        // Add User Message (WhatsApp Green Bubble)
        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: queryText,
            time: time
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputQuery("");
        setIsTyping(true);

        // Simulate AI Response (WhatsApp Dark Grey Bubble)
        setTimeout(() => {
            setIsTyping(false);
            const botMsg = {
                id: Date.now() + 1,
                sender: "bot",
                text: `Here are the top AI recommendations for "${queryText}":`,
                time: getCurrentTime(),
                showCards: true
            };
            setMessages((prev) => [...prev, botMsg]);
        }, 900);
    };

    const handleAddToCart = (card) => {
        addToCart(card.id);
        setAddedCardId(card.id);
        setTimeout(() => {
            setAddedCardId(null);
        }, 1500);
    };

    return (
        <>
            {/* 1. FLOATING WHATSAPP CIRCLE BUTTON (Fixed Bottom Right, Draggable) */}
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                dragConstraints={dragConstraints}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 touch-none select-none cursor-grab active:cursor-grabbing"
            >

                {/* Tooltip Label (Visible when chat is closed) */}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111b21] border border-[#222d34] text-[10px] font-mono font-bold text-white shadow-2xl pointer-events-none"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-pulse" />
                        <span>Ask AI Assistant</span>
                    </motion.div>
                )}

                {/* Floating WP Green Circle Button */}
                <motion.button
                    animate={{
                        x: [0, 15, -12, 18, -15, 10, -5, 0],
                        y: [0, -12, 15, -8, 12, -15, 8, 0]
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00a884] text-[#111b21] shadow-[0_8px_24px_rgba(0,168,132,0.4)] cursor-pointer focus:outline-none flex items-center justify-center flex-shrink-0"
                    title={isOpen ? "Close Chat" : "Open WhatsApp AI Chat"}
                >
                    {/* Outer Ambient Glow */}
                    <span className="absolute -inset-1 rounded-full bg-[#00a884] opacity-20 blur-md animate-pulse" />

                    <div className="relative z-10">
                        {isOpen ? (
                            <X className="w-5 h-5 text-white" />
                        ) : (
                            <div className="relative">
                                <Bot className="w-5 h-5 text-white" />
                                <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
                            </div>
                        )}
                    </div>
                </motion.button>
            </motion.div>

            {/* 2. SLIDING WHATSAPP STYLE CHAT DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 40, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 40, x: 20 }}
                        transition={{ type: "spring", stiffness: 350, damping: 26 }}
                        className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[410px] h-[570px] max-h-[82vh] z-50 rounded-2xl bg-[#0b141a] text-[#e9edef] border border-[#222d34] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden font-sans"
                    >
                        {/* WHATSAPP HEADER */}
                        <div className="bg-[#202c33] border-b border-[#2a3942] px-3.5 py-3 flex items-center justify-between flex-shrink-0">

                            {/* Contact Profile Info */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold flex-shrink-0">
                                    <Bot className="w-6 h-6" />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00a884] border-2 border-[#202c33]" />
                                </div>

                                <div className="text-left leading-tight">
                                    <h3 className="font-sans text-sm font-bold text-[#e9edef] flex items-center gap-1.5">
                                        <span>Cravely AI Assistant</span>
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                    </h3>
                                    <span className="text-[11px] text-[#8696a0] font-normal">
                                        online
                                    </span>
                                </div>
                            </div>

                            {/* WP Action Icons */}
                            <div className="flex items-center gap-3 text-[#aebac1]">
                                <Video className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                                <Phone className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded hover:bg-[#2a3942] text-[#aebac1] hover:text-white transition-colors cursor-pointer"
                                    title="Close Chat"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* WHATSAPP CHAT MESSAGES BODY */}
                        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0b141a] bg-opacity-95 scrollbar-thin scrollbar-thumb-[#202c33]">

                            {/* Security / Encryption Info Badge */}
                            <div className="flex justify-center mb-3">
                                <div className="bg-[#182229] border border-[#222d34] text-[#ffd279] text-[10px] px-3 py-1.5 rounded-lg text-center max-w-xs font-sans font-medium">
                                    🔒 Messages are AI-generated to help you discover signature dishes instantly.
                                </div>
                            </div>

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    {/* WhatsApp Speech Bubble */}
                                    <div
                                        className={`relative max-w-[85%] px-3.5 py-2 rounded-xl text-xs leading-relaxed text-left font-sans shadow-md ${msg.sender === 'user'
                                                ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                                                : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                                            }`}
                                    >
                                        <p className="pr-12">{msg.text}</p>

                                        {/* Timestamp & Read Status */}
                                        <div className="absolute bottom-1 right-2.5 flex items-center gap-1 text-[9px] text-[#8696a0] font-mono">
                                            <span>{msg.time}</span>
                                            {msg.sender === 'user' && (
                                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                                            )}
                                        </div>
                                    </div>

                                    {/* ChatGPT style Start Options */}
                                    {msg.showStartOptions && (
                                        <div className="grid grid-cols-2 gap-2 mt-2.5 w-full">
                                            {menu_list.map((item, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSendMessage(`I want to explore the best "${item.menu_name}" dishes on the menu!`)}
                                                    className="flex items-center gap-2.5 text-left p-2.5 rounded-xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884] transition-colors text-xs cursor-pointer group min-w-0"
                                                >
                                                    <img 
                                                        src={item.menu_image} 
                                                        alt={item.menu_name} 
                                                        className="w-7 h-7 rounded-full object-cover border border-[#2a3942] group-hover:border-[#00a884] transition-all flex-shrink-0"
                                                    />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-[#e9edef] group-hover:text-[#00a884] truncate">
                                                            {item.menu_name}
                                                        </span>
                                                        <span className="text-[#8696a0] text-[8px] leading-tight truncate">
                                                            Explore varieties
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Inline WhatsApp Recommendation Cards */}
                                    {msg.showCards && (
                                        <div className="w-full mt-2.5 space-y-2">
                                            {recommendedCards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    className="bg-[#111b21] border border-[#222d34] rounded-xl p-2.5 flex items-center gap-3 shadow-lg hover:border-[#00a884]/60 transition-colors text-left"
                                                >
                                                    <img
                                                        src={card.image}
                                                        alt={card.name}
                                                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                                    />

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                                            <h5 className="font-sans text-xs font-bold text-[#e9edef] truncate">
                                                                {card.name}
                                                            </h5>
                                                            <span className="font-mono text-xs font-black text-[#00a884] flex-shrink-0">
                                                                {card.formattedPrice}
                                                            </span>
                                                        </div>

                                                        <p className="text-[10px] text-[#8696a0] font-medium truncate mb-1">
                                                            ⚡ {card.matchReason}
                                                        </p>

                                                        <div className="flex items-center justify-between text-[10px] font-mono">
                                                            <div className="flex items-center gap-1 text-amber-400">
                                                                <Star className="w-3 h-3 fill-amber-400" />
                                                                <span>{card.rating}</span>
                                                                <span className="text-[#8696a0]">({card.prepTime})</span>
                                                            </div>

                                                            <button
                                                                onClick={() => handleAddToCart(card)}
                                                                type="button"
                                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${addedCardId === card.id
                                                                        ? 'bg-emerald-500 text-white'
                                                                        : 'bg-[#00a884] hover:bg-[#008f6f] text-[#111b21] font-extrabold'
                                                                    }`}
                                                            >
                                                                {addedCardId === card.id ? (
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
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing Indicator (WhatsApp Style) */}
                            {isTyping && (
                                <div className="flex items-center gap-2 text-xs text-[#8696a0] bg-[#202c33] px-3 py-1.5 rounded-xl w-fit rounded-tl-none">
                                    <span className="w-2 h-2 rounded-full bg-[#00a884] animate-ping" />
                                    <span className="font-sans text-[11px]">typing...</span>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        {/* QUICK PROMPT CHIPS */}
                        <div className="px-3 py-1.5 bg-[#111b21] border-t border-[#222d34] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                            {promptChips.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(chip)}
                                    type="button"
                                    className="px-2.5 py-1 rounded-full bg-[#202c33] border border-[#2a3942] hover:border-[#00a884] text-[10px] font-medium text-[#8696a0] hover:text-[#e9edef] whitespace-nowrap transition-colors cursor-pointer"
                                >
                                    💡 {chip}
                                </button>
                            ))}
                        </div>

                        {/* WHATSAPP CHAT INPUT FOOTER */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="p-2.5 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-2 flex-shrink-0"
                        >
                            <Smile className="w-5 h-5 text-[#8696a0] hover:text-[#e9edef] cursor-pointer" />
                            <Paperclip className="w-5 h-5 text-[#8696a0] hover:text-[#e9edef] cursor-pointer" />

                            <input
                                type="text"
                                value={inputQuery}
                                onChange={(e) => setInputQuery(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-[#2a3942] border-none text-xs text-[#e9edef] placeholder-[#8696a0] rounded-xl px-3.5 py-2.5 focus:outline-none font-medium"
                            />

                            {inputQuery.trim() ? (
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    type="submit"
                                    className="p-2.5 rounded-full bg-[#00a884] text-[#111b21] cursor-pointer shadow-md flex-shrink-0"
                                    title="Send Message"
                                >
                                    <Send className="w-4 h-4 fill-[#111b21]" />
                                </motion.button>
                            ) : (
                                <div className="p-2 text-[#8696a0]">
                                    <Mic className="w-5 h-5 cursor-pointer hover:text-[#e9edef]" />
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AiSearchSection;
