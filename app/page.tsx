'use client'
import { useState, useRef, useEffect } from "react";
import CodeInput from "../components/CodeInput";
import FeedbackCard from "../components/FeedbackCard";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import { useTheme } from "../components/ThemeProvider";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Feedback {
  _id: string;
  code: string;
  response: string;
  createdAt: string;
}

export default function HomePage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Feedback[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderCanScrollLeft, setSliderCanScrollLeft] = useState(false);
  const [sliderCanScrollRight, setSliderCanScrollRight] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setHistoryLoading(false);
      });
  }, []);

  const handleCodeSubmit = async (code: string) => {
    setIsLoading(true);
    // Immediately show the user's code
    const userMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, type: "user", content: code, timestamp: new Date() },
    ]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "ai", content: data.response, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error analyzing code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
  };

  // Track scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setAtTop(container.scrollTop === 0);
      setAtBottom(container.scrollHeight - container.scrollTop === container.clientHeight);
    };
    container.addEventListener('scroll', handleScroll);
    // Initial state
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages]);

  // Check if slider is scrollable
  useEffect(() => {
    const checkSliderScroll = () => {
      const slider = sliderRef.current;
      if (!slider) return;
      setSliderCanScrollLeft(slider.scrollLeft > 0);
      setSliderCanScrollRight(slider.scrollWidth > slider.clientWidth + slider.scrollLeft + 1);
    };
    checkSliderScroll();
    window.addEventListener('resize', checkSliderScroll);
    if (sliderRef.current) {
      sliderRef.current.addEventListener('scroll', checkSliderScroll);
    }
    // Fix ref usage in effect cleanup by copying sliderRef.current to a variable inside the effect
    return () => {
      const slider = sliderRef.current;
      window.removeEventListener('resize', checkSliderScroll);
      if (slider) {
        slider.removeEventListener('scroll', checkSliderScroll);
      }
    };
  }, [history, messages]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to check if current messages are a single review from history
  const isSingleReview = messages.length === 2 && history.some(h =>
    messages[0].content === h.code && messages[1].content === h.response
  );

  return (
    <div className={`flex flex-col h-screen ${themeClasses.background} transition-colors duration-300`}>
      <AppHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Floating Back Button below header for single review chat */}
      {isSingleReview && (
        <div className="max-w-4xl mx-auto px-3 sm:px-4 mt-4">
          <button
            onClick={() => setMessages([])}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium shadow border transition focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDarkMode ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-200'}`}
            aria-label="Back to all reviews"
            style={{ minWidth: 0 }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {messages.length === 0 ? (
            <div className="text-center py-8 sm:py-12 animate-fade-in">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-200">
                <span className="text-white text-xl sm:text-2xl">🤖</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold ${themeClasses.text} mb-2`}>Welcome to RevuAI</h2>
              <p className={`${themeClasses.textSecondary} mb-6 sm:mb-8 max-w-md mx-auto px-4`}>
                Paste your code below and I&apos;ll provide detailed analysis, suggestions, and best practices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto px-4">
                <div className={`${themeClasses.cardBg} p-3 sm:p-4 rounded-lg border ${themeClasses.border} hover:shadow-lg transition-all duration-200 hover:scale-105`}>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2 mx-auto sm:mx-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <h3 className={`font-medium ${themeClasses.text} mb-1 text-center sm:text-left`}>Code Quality</h3>
                  <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} text-center sm:text-left`}>Analyze code structure and patterns</p>
                </div>

                <div className={`${themeClasses.cardBg} p-3 sm:p-4 rounded-lg border ${themeClasses.border} hover:shadow-lg transition-all duration-200 hover:scale-105`}>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto sm:mx-0">
                    <span className="text-blue-600">⚡</span>
                  </div>
                  <h3 className={`font-medium ${themeClasses.text} mb-1 text-center sm:text-left`}>Performance</h3>
                  <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} text-center sm:text-left`}>Optimize speed and efficiency</p>
                </div>

                <div className={`${themeClasses.cardBg} p-3 sm:p-4 rounded-lg border ${themeClasses.border} hover:shadow-lg transition-all duration-200 hover:scale-105`}>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto sm:mx-0">
                    <span className="text-purple-600">📚</span>
                  </div>
                  <h3 className={`font-medium ${themeClasses.text} mb-1 text-center sm:text-left`}>Best Practices</h3>
                  <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} text-center sm:text-left`}>Follow industry standards</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setMessages([])}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium shadow border transition focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4
                  ${isDarkMode ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-200'}`}
                aria-label="Back to start"
                style={{ minWidth: 0 }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message) => (
                  <FeedbackCard
                    key={message.id}
                    message={message}
                    isDarkMode={isDarkMode}
                    themeClasses={themeClasses}
                  />
                ))}
              </div>
            </>
          )}

          {/* Recent Reviews Section as a slider */}
          {messages.length === 0 && !historyLoading && history.length > 0 && (
            <div className="mt-8">
              <h2 className={`text-lg font-semibold mb-3 ${themeClasses.text}`}>Recent Reviews</h2>
              <div className="relative">
                {sliderCanScrollLeft && (
                  <button
                    type="button"
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow transition disabled:opacity-40"
                    style={{ left: '-18px' }}
                    onClick={() => {
                      const slider = sliderRef.current;
                      if (slider) slider.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    aria-label="Scroll left"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                )}
                <div
                  id="recent-reviews-slider"
                  ref={sliderRef}
                  className="flex overflow-x-auto gap-4 pb-2 custom-scrollbar snap-x snap-mandatory hide-scrollbar overflow-visible"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {history.slice(0, 8).map((item) => {
                    const summary = (item.code.split('\n').find(line => line.trim()) || item.code).slice(0, 80) + (item.code.length > 80 ? '...' : '');
                    return (
                      <button
                        key={item._id}
                        className={`group min-w-[260px] max-w-xs w-full text-left ${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-4 shadow-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col gap-2 cursor-pointer snap-center relative`}
                        style={{ zIndex: 1 }}
                        onMouseEnter={e => e.currentTarget.style.zIndex = '10'}
                        onMouseLeave={e => e.currentTarget.style.zIndex = '1'}
                        onClick={() => {
                          setMessages([
                            {
                              id: item._id + '-user',
                              type: 'user',
                              content: item.code,
                              timestamp: new Date(item.createdAt)
                            },
                            {
                              id: item._id + '-ai',
                              type: 'ai',
                              content: item.response,
                              timestamp: new Date(item.createdAt)
                            }
                          ]);
                        }}
                        title="View this review"
                        tabIndex={0}
                      >
                        <div className={`flex items-center gap-2 mb-1`}>
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 group-hover:bg-blue-500 transition" />
                          <span className={`text-xs ${themeClasses.textMuted}`}>{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                        <div className={`font-semibold text-sm truncate ${themeClasses.text}`}>{summary}</div>
                        <div className={`text-xs mt-1 line-clamp-3 ${themeClasses.textSecondary}`}>{item.response.slice(0, 120)}{item.response.length > 120 ? '...' : ''}</div>
                        <span className="mt-2 text-xs text-blue-500 group-hover:underline self-end">Open chat →</span>
                      </button>
                    );
                  })}
                </div>
                {sliderCanScrollRight && (
                  <button
                    type="button"
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow transition disabled:opacity-40"
                    style={{ right: '-18px' }}
                    onClick={() => {
                      const slider = sliderRef.current;
                      if (slider) slider.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    aria-label="Scroll right"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>
              <div className="mt-4 text-right">
                <a href="/history" className="text-blue-500 hover:underline text-xs">View all history →</a>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-slide-up">
              <div className="flex space-x-2 sm:space-x-3 max-w-4xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm">🤖</span>
                </div>
                <div className={`${themeClasses.cardBg} border ${themeClasses.border} shadow-sm rounded-2xl px-3 sm:px-4 py-2 sm:py-3`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`}></div>
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className={`text-xs sm:text-sm ${themeClasses.textMuted}`}>Analyzing your code...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll button */}
      <div className="relative max-w-4xl w-full mx-auto">
        <div className="absolute right-4 -top-12">
          {atTop && !atBottom && (
            <button
              onClick={scrollToBottom}
              className="bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 rounded-full shadow-lg p-2 transition-all duration-300 ease-in-out transform animate-float"
              aria-label="Scroll to bottom"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
          {!atTop && (
            <button
              onClick={scrollToTop}
              className="bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 rounded-full shadow-lg p-2 transition-all duration-300 ease-in-out transform animate-float"
              aria-label="Scroll to top"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Input Area */}
      <CodeInput
        onSubmit={handleCodeSubmit}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
      />

      {/* Footer */}
      <AppFooter isDarkMode={isDarkMode} />

      <style jsx>{`
        /* Mobile Safari bounce prevention */
        body {
          overscroll-behavior: none;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none !important; }
        .hide-scrollbar { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Remove translateY hover for review card, use only shading */
      `}</style>
    </div>
  );
}