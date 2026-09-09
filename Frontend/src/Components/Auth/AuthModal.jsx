import React, { useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../Context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, ArrowRight, CheckCircle2, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', customTitle = '', customSubtitle = '', onAuthSuccess = null }) => {
    const { url, setToken, authModalState, closeAuthModal } = useContext(StoreContext);
    const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'register' | 'forgot' | 'verify'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        otp: ['', '', '', '', '', '']
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Keep mode updated if initialMode changes
    React.useEffect(() => {
        if (initialMode) {
            setMode(initialMode);
        }
    }, [initialMode, isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        if (onClose) onClose();
        if (closeAuthModal) closeAuthModal();
    };

    const handleAuthSuccess = () => {
        const callback = onAuthSuccess || authModalState?.onSuccess;
        handleClose();
        if (callback && typeof callback === 'function') {
            setTimeout(() => {
                callback();
            }, 100);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (mode === 'login' || mode === 'register') {
            try {
                const endpoint = mode === 'login' ? `${url}/api/user/login` : `${url}/api/user/register`;
                const payload = mode === 'login' 
                    ? { email: formData.email, password: formData.password }
                    : { name: formData.name, email: formData.email, password: formData.password };
                
                const response = await axios.post(endpoint, payload);
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    setSuccessMessage(mode === 'login' ? 'Welcome back to Cravely! Cart preserved.' : 'Account created! Cart preserved.');
                    setTimeout(() => {
                        handleAuthSuccess();
                    }, 600);
                } else {
                    setErrorMessage(response.data.message || 'Authentication failed');
                }
            } catch (err) {
                setErrorMessage(err.response?.data?.message || 'Server connection error');
            } finally {
                setIsLoading(false);
            }
        } else {
            setTimeout(() => {
                setIsLoading(false);
                if (mode === 'forgot') {
                    setSuccessMessage('Reset code sent to your email.');
                    setTimeout(() => setMode('verify'), 1200);
                } else if (mode === 'verify') {
                    setSuccessMessage('Email verified successfully!');
                    setTimeout(() => handleAuthSuccess(), 1000);
                }
            }, 800);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...formData.otp];
        newOtp[index] = value;
        setFormData({ ...formData, otp: newOtp });
        
        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative w-full max-w-md bg-white dark:bg-[#2b1f1d] border border-gray-100 dark:border-[#3a2b27] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#352723] transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header Banner */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>

                        <h2 className="font-serif text-2xl font-extrabold text-text-dark dark:text-[#f4f1ea]">
                            {(customTitle || authModalState?.title) || (
                                <>
                                    {mode === 'login' && 'Welcome Back'}
                                    {mode === 'register' && 'Create Your Account'}
                                    {mode === 'forgot' && 'Reset Password'}
                                    {mode === 'verify' && 'Email Verification'}
                                </>
                            )}
                        </h2>

                        <p className="text-xs text-gray-500 dark:text-[#a09a8e] mt-1 font-medium">
                            {(customSubtitle || authModalState?.subtitle) || (
                                <>
                                    {mode === 'login' && 'Sign in to access your orders, saved spots & checkout securely'}
                                    {mode === 'register' && 'Join Cravely to unlock 50% OFF your first order'}
                                    {mode === 'forgot' && 'Enter your email to receive a password reset OTP'}
                                    {mode === 'verify' && 'Enter the 6-digit code sent to your email'}
                                </>
                            )}
                        </p>
                    </div>

                    {/* Success Toast Banner */}
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 text-center"
                        >
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </motion.div>
                    )}

                    {/* Error Toast Banner */}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 text-center"
                        >
                            <span>{errorMessage}</span>
                        </motion.div>
                    )}

                    {/* Form Controls */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name (Register Mode) */}
                        {mode === 'register' && (
                            <div>
                                <label className="text-[11px] font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d] block mb-1">Full Name</label>
                                <div className="relative flex items-center">
                                    <User className="w-4 h-4 absolute left-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#3a2b27] bg-gray-50 dark:bg-[#352723] text-xs font-medium text-text-dark dark:text-[#f4f1ea] focus:border-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field (Login, Register & Forgot Mode) */}
                        {mode !== 'verify' && (
                            <div>
                                <label className="text-[11px] font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d] block mb-1">Email Address</label>
                                <div className="relative flex items-center">
                                    <Mail className="w-4 h-4 absolute left-3.5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="user@cravely.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#3a2b27] bg-gray-50 dark:bg-[#352723] text-xs font-medium text-text-dark dark:text-[#f4f1ea] focus:border-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Phone Number (Register Mode) */}
                        {mode === 'register' && (
                            <div>
                                <label className="text-[11px] font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d] block mb-1">Phone Number</label>
                                <div className="relative flex items-center">
                                    <Phone className="w-4 h-4 absolute left-3.5 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+1 (234) 567-8900"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#3a2b27] bg-gray-50 dark:bg-[#352723] text-xs font-medium text-text-dark dark:text-[#f4f1ea] focus:border-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password Field (Login & Register Mode) */}
                        {(mode === 'login' || mode === 'register') && (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11px] font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d]">Password</label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative flex items-center">
                                    <Lock className="w-4 h-4 absolute left-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#3a2b27] bg-gray-50 dark:bg-[#352723] text-xs font-medium text-text-dark dark:text-[#f4f1ea] focus:border-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* OTP Verification Grid (Verify Mode) */}
                        {mode === 'verify' && (
                            <div className="my-6">
                                <label className="text-[11px] font-mono font-bold uppercase text-gray-400 dark:text-[#7f796d] block text-center mb-3">Enter Verification OTP</label>
                                <div className="flex items-center justify-center gap-2">
                                    {formData.otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            className="w-10 h-12 text-center text-lg font-mono font-bold rounded-xl border border-gray-200 dark:border-[#3a2b27] bg-gray-50 dark:bg-[#352723] text-text-dark dark:text-[#f4f1ea] focus:border-primary focus:outline-none"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>
                                        {mode === 'login' && 'Sign In'}
                                        {mode === 'register' && 'Create Account'}
                                        {mode === 'forgot' && 'Send Reset Code'}
                                        {mode === 'verify' && 'Verify & Continue'}
                                    </span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Google OAuth Simulation Divider */}
                    {(mode === 'login' || mode === 'register') && (
                        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#3a2b27]">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setIsLoading(false);
                                        setSuccessMessage('Authenticated via Google! Cart preserved.');
                                        setTimeout(() => handleAuthSuccess(), 800);
                                    }, 800);
                                }}
                                className="w-full py-2.5 px-4 rounded-2xl border border-gray-200 dark:border-[#3a2b27] bg-white dark:bg-[#352723] text-xs font-bold text-gray-700 dark:text-[#f4f1ea] hover:bg-gray-50 dark:hover:bg-[#45332e] transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                        </div>
                    )}

                    {/* Footer Mode Toggle */}
                    <div className="mt-5 text-center text-xs text-gray-500 dark:text-[#a09a8e] font-medium">
                        {mode === 'login' ? (
                            <span>
                                Don't have an account?{' '}
                                <button onClick={() => setMode('register')} className="font-bold text-primary hover:underline cursor-pointer">
                                    Sign Up
                                </button>
                            </span>
                        ) : (
                            <span>
                                Already have an account?{' '}
                                <button onClick={() => setMode('login')} className="font-bold text-primary hover:underline cursor-pointer">
                                    Sign In
                                </button>
                            </span>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
