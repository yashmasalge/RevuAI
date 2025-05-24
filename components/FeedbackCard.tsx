interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

interface FeedbackCardProps {
    message: Message;
    isDarkMode: boolean;
    themeClasses: {
        cardBg: string;
        border: string;
        text: string;
        textSecondary: string;
        textMuted: string;
    };
}

export default function FeedbackCard({ message, isDarkMode, themeClasses }: FeedbackCardProps) {
    const formatMessage = (content: string) => {
        const parts = content.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const code = part.slice(3, -3).trim();
                const language = code.split('\n')[0];
                const codeContent = language.includes('javascript') || language.includes('python')
                    ? code.split('\n').slice(1).join('\n')
                    : code;

                return (
                    <div key={index} className={`my-4 rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between">
                            <span className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                                {language || 'Code'}
                            </span>
                            <button
                                onClick={() => navigator.clipboard.writeText(codeContent)}
                                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 overflow-x-auto text-sm custom-scrollbar">
                            <code className="font-mono">{codeContent}</code>
                        </pre>
                    </div>
                );
            }

            // Format markdown-style text
            return (
                <div key={index} className="whitespace-pre-wrap">
                    {part.split('\n').map((line, lineIndex) => {
                        if (line.startsWith('### ')) {
                            return <h3 key={lineIndex} className={`text-base sm:text-lg font-semibold mt-4 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{line.slice(4)}</h3>;
                        }
                        if (line.startsWith('## ')) {
                            return <h2 key={lineIndex} className={`text-lg sm:text-xl font-bold mt-4 mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{line.slice(3)}</h2>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={lineIndex} className={`font-semibold my-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{line.slice(2, -2)}</p>;
                        }
                        if (line.startsWith('- ')) {
                            return <li key={lineIndex} className={`ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{line.slice(2)}</li>;
                        }
                        return line ? <p key={lineIndex} className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{line}</p> : <br key={lineIndex} />;
                    })}
                </div>
            );
        });
    };

    return (
        <div
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
        >
            <div className={`flex space-x-2 sm:space-x-3 max-w-full sm:max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                    <span className="text-xs sm:text-sm">{message.type === 'user' ? '👤' : '🤖'}</span>
                </div>

                {/* Message Content */}
                <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 max-w-[85%] sm:max-w-3xl transition-all duration-200 ${message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : `${themeClasses.cardBg} border ${themeClasses.border} shadow-sm hover:shadow-md`
                    }`}>
                    {message.type === 'user' ? (
                        <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-all">
                            {message.content}
                        </pre>
                    ) : (
                        <div className="text-xs sm:text-sm">
                            {formatMessage(message.content)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}