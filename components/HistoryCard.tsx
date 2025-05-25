import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

interface HistoryCardProps {
    feedback: {
        _id: string;
        code: string;
        response: string;
        createdAt: string;
    };
    onReReview?: (code: string) => void;
    onDelete?: (id: string) => void;
    highlight?: string;
    isDarkMode?: boolean;
}

function highlightText(text: string, highlight: string) {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 text-black px-0.5 rounded">{part}</mark>
        ) : (
            part
        )
    );
}

export default function HistoryCard({ feedback, onReReview, onDelete, highlight = "", isDarkMode = false }: HistoryCardProps) {
    const [showMore, setShowMore] = React.useState(false);
    const [showMoreReview, setShowMoreReview] = React.useState(false);
    const codeLines = feedback.code.split("\n");
    const maxLines = 10;
    const isLong = codeLines.length > maxLines;
    const displayedCode = showMore || !isLong ? feedback.code : codeLines.slice(0, maxLines).join("\n");
    const [isHovered, setIsHovered] = React.useState(false);

    // Calculate if review is long (more than 300 characters)
    const isReviewLong = feedback.response.length > 300;
    const displayedReview = showMoreReview || !isReviewLong
        ? feedback.response
        : `${feedback.response.slice(0, 300)}...`;

    const formattedDate = new Date(feedback.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div
            className={`border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full bg-opacity-95 
                ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
                transform hover:-translate-y-1`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <span className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {formattedDate}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {onReReview && (
                        <button
                            onClick={() => onReReview(feedback.code)}
                            className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-full font-medium
                                bg-blue-500 text-white hover:bg-blue-600 
                                transition-all duration-200 flex items-center gap-1
                                ${isHovered ? 'scale-105' : ''}`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="sm:inline">Re-review</span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(feedback._id)}
                            className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-full font-medium
                                text-red-600 hover:text-white hover:bg-red-500 border border-red-200
                                dark:border-red-900 dark:hover:border-red-500
                                transition-all duration-200 flex items-center gap-1
                                ${isHovered ? 'scale-105' : ''}`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="sm:inline">Delete</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {/* Code Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Code</span>
                    </div>
                    <div className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-gray-700" : "border-gray-200"} bg-gray-50 dark:bg-gray-900`}>
                        <SyntaxHighlighter
                            language="javascript"
                            style={isDarkMode ? vscDarkPlus : prism}
                            customStyle={{
                                margin: 0,
                                background: "none",
                                fontSize: 13,
                                padding: 12,
                                borderRadius: 8,
                                minHeight: 40,
                                maxHeight: showMore ? 400 : 200,
                                overflowY: 'auto'
                            }}
                            wrapLongLines
                        >
                            {highlight ? String(displayedCode).replace(new RegExp(highlight, "gi"), (match) => `/*HIGHLIGHT*/${match}/*END*/`) : displayedCode}
                        </SyntaxHighlighter>
                    </div>
                    {isLong && (
                        <button
                            className={`text-xs font-medium px-3 py-1 rounded-full 
                                ${isDarkMode
                                    ? "text-blue-400 hover:text-blue-300 bg-gray-800 hover:bg-gray-700"
                                    : "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100"} 
                                transition-colors duration-200`}
                            onClick={() => setShowMore((v) => !v)}
                        >
                            {showMore ? "Show less" : `Show more (${codeLines.length - maxLines} lines)`}
                        </button>
                    )}
                </div>

                {/* Review Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Review</span>
                        </div>
                    </div>
                    <div className={`prose prose-sm max-w-none dark:prose-invert rounded-lg p-4 
                        ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"} 
                        border ${isDarkMode ? "border-gray-700" : "border-gray-200"}
                        overflow-y-auto transition-all duration-300
                        ${showMoreReview ? 'max-h-[600px]' : 'max-h-[200px]'}`}
                    >
                        <div className="whitespace-pre-wrap break-words">
                            <ReactMarkdown>
                                {highlightText(displayedReview, highlight) as any}
                            </ReactMarkdown>
                        </div>
                    </div>
                    {isReviewLong && (
                        <button
                            className={`text-xs font-medium px-3 py-1 rounded-full 
                                ${isDarkMode
                                    ? "text-blue-400 hover:text-blue-300 bg-gray-800 hover:bg-gray-700"
                                    : "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100"} 
                                transition-colors duration-200`}
                            onClick={() => setShowMoreReview((v) => !v)}
                        >
                            {showMoreReview ? "Show less" : "Show full review"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
