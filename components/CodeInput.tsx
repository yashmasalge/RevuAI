'use client'
import { useState, useRef, useEffect } from "react";

interface CodeInputProps {
    onSubmit: (code: string) => void;
    isLoading: boolean;
    isDarkMode: boolean;
    themeClasses: {
        cardBg: string;
        border: string;
        text: string;
        textMuted: string;
        inputBg: string;
        inputBorder: string;
    };
}

export default function CodeInput({ onSubmit, isLoading, isDarkMode, themeClasses }: CodeInputProps) {
    const [code, setCode] = useState("");
    const [isGitHub, setIsGitHub] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    // Close options when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!code.trim() || isLoading) return;

        if (isGitHub) {
            // Validate GitHub URL
            const fileUrlPattern = /^https:\/\/github.com\/.+\/.+\/blob\/.+$/;
            const repoUrlPattern = /^https:\/\/github.com\/.+\/.+$/;
            if (!fileUrlPattern.test(code) && !repoUrlPattern.test(code)) {
                // Show error animation
                if (textareaRef.current) {
                    textareaRef.current.classList.add('shake-animation');
                    setTimeout(() => {
                        textareaRef.current?.classList.remove('shake-animation');
                    }, 500);
                }
                return;
            }

            try {
                const res = await fetch('/api/github', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: code })
                });
                const data = await res.json();
                if (!data.code) {
                    throw new Error('No code received');
                }
                onSubmit(data.code);
            } catch {
                // Show error animation
                if (textareaRef.current) {
                    textareaRef.current.classList.add('shake-animation');
                    setTimeout(() => {
                        textareaRef.current?.classList.remove('shake-animation');
                    }, 500);
                }
                return;
            }
        } else {
            onSubmit(code);
        }

        setCode("");
        setIsGitHub(false);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleAddGitHubLink = () => {
        setIsGitHub(true);
        setShowOptions(false);
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.placeholder = "Paste GitHub file or repository URL...";
        }
    };

    const handleAddCode = () => {
        setIsGitHub(false);
        setShowOptions(false);
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.placeholder = "Paste your code here... (Press Enter to send, Shift+Enter for new line)";
        }
    };

    return (
        <div className={`${themeClasses.cardBg} border-t ${themeClasses.border} px-3 sm:px-4 py-3 sm:py-4 transition-colors duration-300`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-stretch space-x-2 sm:space-x-3">
                    <div className="flex flex-col justify-end">
                        <div className="relative">
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className={`${themeClasses.inputBg} hover:bg-opacity-80 rounded-xl p-2.5 sm:p-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105 active:scale-95 h-[42px] sm:h-[46px] ${showOptions ? 'rotate-45' : ''}`}
                                aria-label="Add options"
                            >
                                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${themeClasses.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>

                            {/* Options Dropdown */}
                            {showOptions && (
                                <div
                                    ref={optionsRef}
                                    className={`absolute bottom-full mb-2 left-0 w-48 ${themeClasses.cardBg} ${themeClasses.border} rounded-xl shadow-lg border py-2 transform origin-bottom-left transition-all duration-200 animate-fade-in-up z-10`}
                                >
                                    <button
                                        onClick={handleAddCode}
                                        className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center space-x-2 ${!isGitHub ? 'text-blue-500' : ''}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        <span>Add Code</span>
                                    </button>
                                    <button
                                        onClick={handleAddGitHubLink}
                                        className={`w-full px-4 py-2 text-left text-sm ${themeClasses.text} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center space-x-2 ${isGitHub ? 'text-blue-500' : ''}`}
                                    >
                                        {/* GitHub Icon */}
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" />
                                        </svg>
                                        <span>Add GitHub Link</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>                    <div className="flex-1 min-h-0">
                        <div className="relative bg-transparent rounded-2xl group">
                            <div className={`absolute inset-0 ${themeClasses.inputBg} rounded-2xl transition-all duration-200 group-focus-within:ring-1 group-focus-within:ring-blue-500/30 group-focus-within:shadow-md`} />
                            <textarea
                                ref={textareaRef}
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    adjustTextareaHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={isGitHub ? "Paste GitHub file or repository URL..." : "Paste your code here... (Press Enter to send, Shift+Enter for new line)"}
                                disabled={isLoading}
                                className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent outline-0 ring-0 focus:ring-0 focus:outline-0 border-0 rounded-2xl resize-none text-xs sm:text-sm font-mono max-h-32 sm:max-h-48 min-h-[42px] sm:min-h-[46px] disabled:opacity-50 ${themeClasses.text} placeholder-gray-400 transition-all duration-200 custom-scrollbar`}
                                style={{ height: 'auto' }}
                            />
                            <div className={`absolute bottom-1.5 sm:bottom-2 right-2 text-xs ${themeClasses.textMuted}`}>
                                {code.length}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={!code.trim() || isLoading}
                            className={`bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-2.5 sm:p-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105 active:scale-95 h-[42px] sm:h-[46px] ${themeClasses.cardBg === 'bg-gray-900' ? 'ring-offset-gray-900' : 'ring-offset-white'}`}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2 px-1">
                    <div className={`text-xs ${themeClasses.textMuted}`}>
                        <span className="hidden sm:inline">💡 {isGitHub ? 'Paste a GitHub file or repository URL' : 'Supports JavaScript, Python, Java, C++, and more'}</span>
                        <span className="sm:hidden">💡 {isGitHub ? 'GitHub URL support' : 'Multi-language support'}</span>
                    </div>
                    <div className={`text-xs ${themeClasses.textMuted}`}>
                        AI-powered
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translate3d(0, 10px, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.2s ease-out;
                }

                .shake-animation {
                    animation: shake 0.3s ease-in-out;
                }            `}</style>
        </div>
    );
}