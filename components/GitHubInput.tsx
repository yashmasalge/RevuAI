import { useState, useRef, useEffect } from "react";

interface GitHubInputProps {
    onSubmit: (code: string) => void;
    isLoading: boolean;
    themeClasses: {
        cardBg: string;
        border: string;
        text: string;
        textMuted: string;
        inputBg: string;
        inputBorder: string;
    };
}

export default function GitHubInput({ onSubmit, isLoading, themeClasses }: GitHubInputProps) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [url]);

    const handleSubmit = async () => {
        setError("");
        if (!url.trim() || isLoading) return;
        // Accept both file and repo URLs
        const fileUrlPattern = /^https:\/\/github.com\/.+\/.+\/blob\/.+$/;
        const repoUrlPattern = /^https:\/\/github.com\/.+\/.+$/;
        if (!fileUrlPattern.test(url) && !repoUrlPattern.test(url)) {
            setError("Please enter a valid GitHub file or repository URL.");
            return;
        }
        try {
            const res = await fetch("/api/github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (!data.code) {
                setError("Could not fetch code from GitHub.");
                return;
            }
            onSubmit(data.code);
            setUrl("");
        } catch {
            setError("Error fetching code from GitHub.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto mb-3">
            <div className={`flex flex-col ${themeClasses.cardBg} border ${themeClasses.border} rounded-2xl p-3`}>
                <div className="flex-grow relative">
                    <textarea
                        ref={textareaRef}
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a GitHub file or repository URL"
                        disabled={isLoading}
                        rows={1}
                        className={`w-full bg-transparent border-0 focus:outline-none text-sm resize-none py-1 pr-20 ${themeClasses.text} placeholder:${themeClasses.textMuted}`}
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!url.trim() || isLoading}
                        className="absolute right-0 bottom-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-2"></div>
                        ) : (
                            'Fetch'
                        )}
                    </button>
                </div>
                {error && (
                    <div className="text-sm text-red-500 mt-2 px-1">
                        {error}
                    </div>
                )}
            </div>
            <div className="absolute bottom-3.5 left-3 right-16 h-6 pointer-events-none bg-gradient-to-t from-white dark:from-gray-800"></div>
        </div>
    );
}
