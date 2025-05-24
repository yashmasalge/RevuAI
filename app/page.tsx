'use client'
import { useState, useRef, useEffect } from "react";
import CodeInput from "../components/CodeInput";
import FeedbackCard from "../components/FeedbackCard";
import GitHubInput from "../components/GitHubInput";
import AppHeader from "../components/AppHeader";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState<Feedback[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    // Note: localStorage is not available in Claude artifacts, so we'll use a default
    setIsDarkMode(false);
  }, []);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setHistoryLoading(false);
      });
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCodeSubmit = async (code: string) => {
    if (!code.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: code,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call backend API for real code review
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      const aiResponse = data.response || 'No response from AI.';

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I encountered an error analyzing your code. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <div className={`flex flex-col h-screen ${themeClasses.background} transition-colors duration-300 custom-scrollbar`}>
      <AppHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

          {messages.length === 0 ? (
            <div className="text-center py-8 sm:py-12 animate-fade-in">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-200">
                <span className="text-white text-xl sm:text-2xl">🤖</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold ${themeClasses.text} mb-2`}>Welcome to AI Code Review</h2>
              <p className={`${themeClasses.textSecondary} mb-6 sm:mb-8 max-w-md mx-auto px-4`}>
                Paste your code below and I'll provide detailed analysis, suggestions, and best practices.
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
          )}

          {/* Recent Reviews Section */}
          {messages.length === 0 && !historyLoading && history.length > 0 && (
            <div className="mt-8">
              <h2 className={`text-lg font-semibold mb-3 ${themeClasses.text}`}>Recent Reviews</h2>
              <div className="space-y-3">
                {history.slice(0, 3).map((item) => (
                  <div key={item._id} className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-3 text-xs`}>
                    <div className="mb-1 text-gray-400">{new Date(item.createdAt).toLocaleString()}</div>
                    <div className="mb-1 font-mono whitespace-pre-wrap break-all max-h-24 overflow-auto">{item.code.slice(0, 300)}{item.code.length > 300 ? '...' : ''}</div>
                    <div className="prose prose-xs max-w-none text-gray-600 dark:text-gray-300 mt-1">{item.response.slice(0, 200)}{item.response.length > 200 ? '...' : ''}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right">
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

      {/* Input Area */}
      <CodeInput
        onSubmit={handleCodeSubmit}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
      />

      {/* Footer - Hidden on mobile to save space */}
      <footer className={`hidden sm:block ${themeClasses.cardBg} border-t ${themeClasses.border} px-4 py-3 transition-colors duration-300`}>
        <div className={`max-w-4xl mx-auto flex items-center justify-center text-xs ${themeClasses.textMuted}`}>
          <span>Built with AI • Always review suggestions before implementing</span>
        </div>
      </footer>

      <style jsx>{`
        /* Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          : 'linear-gradient(135deg, #3b82f6, #6366f1)'
        };
          border-radius: 10px;
          border: 2px solid ${isDarkMode ? '#374151' : '#f3f4f6'};
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode
          ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
          : 'linear-gradient(135deg, #2563eb, #4f46e5)'
        };
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'};
        }
        
        /* Firefox Scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? '#6366f1 #374151' : '#3b82f6 #f3f4f6'};
        }
        
        /* Mobile Safari bounce prevention */
        body {
          overscroll-behavior: none;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </div>
  );
}