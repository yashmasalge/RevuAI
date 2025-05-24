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
    const codeLines = feedback.code.split("\n");
    const maxLines = 10;
    const isLong = codeLines.length > maxLines;
    const displayedCode = showMore || !isLong ? feedback.code : codeLines.slice(0, maxLines).join("\n");

    return (
        <div className={`border rounded-lg shadow-sm transition-colors duration-300 w-full bg-opacity-90 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            {/* Code Section */}
            <div className="mb-3 px-3 pt-3">
                <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Code:</span>
                <div className="mt-1 mb-2 rounded overflow-x-auto border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <SyntaxHighlighter
                        language="javascript"
                        style={isDarkMode ? vscDarkPlus : prism}
                        customStyle={{ margin: 0, background: "none", fontSize: 13, padding: 10, borderRadius: 6, minHeight: 40, maxHeight: showMore ? 400 : 200, overflowY: 'auto' }}
                        wrapLongLines
                    >
                        {highlight ? String(displayedCode).replace(new RegExp(highlight, "gi"), (match) => `/*HIGHLIGHT*/${match}/*END*/`) : displayedCode}
                    </SyntaxHighlighter>
                </div>
                {isLong && (
                    <button
                        className={`text-xs underline mt-1 ${isDarkMode ? "text-blue-300 hover:text-blue-200" : "text-blue-700 hover:text-blue-900"}`}
                        onClick={() => setShowMore((v) => !v)}
                    >
                        {showMore ? "Show less" : `Show more (${codeLines.length - maxLines} more lines)`}
                    </button>
                )}
            </div>
            {/* Review Section */}
            <div className="mb-2 px-3">
                <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Review:</span>
                <div className="prose prose-sm max-w-none dark:prose-invert mt-1 bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto whitespace-pre-wrap break-words text-sm sm:text-base" style={{ wordBreak: 'break-word' }}>
                    <ReactMarkdown>{highlightText(feedback.response, highlight) as any}</ReactMarkdown>
                </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-3 px-3 pb-3">
                {onReReview && (
                    <button
                        onClick={() => onReReview(feedback.code)}
                        className="text-xs px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition w-full sm:w-auto"
                    >
                        Re-review
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(feedback._id)}
                        className="text-xs px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition w-full sm:w-auto"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
