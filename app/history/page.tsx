'use client'
import React, { useEffect, useState } from "react";
import HistoryCard from "../../components/HistoryCard";
import Link from "next/link";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import { useTheme } from "../../components/ThemeProvider";
import { useRouter } from 'next/navigation';
import Shimmer from "../../components/Shimmer";

interface Feedback {
    _id: string;
    code: string;
    response: string;
    createdAt: string;
}

export default function HistoryPage() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [history, setHistory] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"desc" | "asc">("desc");
    const router = useRouter();

    useEffect(() => {
        fetch("/api/history")
            .then((res) => res.json())
            .then((data) => {
                setHistory(data);
                setLoading(false);
            });
    }, []);

    // Filter and sort
    const filtered = history
        .filter(
            (item) =>
                item.code.toLowerCase().includes(search.toLowerCase()) ||
                item.response.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sort === "desc") {
                return (
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            } else {
                return (
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            }
        });

    // Re-review handler
    const handleReReview = (code: string) => {
        // Optionally, navigate to home and prefill code (requires more wiring)
        window.location.href = `/?code=${encodeURIComponent(code)}`;
    };

    // Delete handler
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this review?")) return;
        await fetch(`/api/history?id=${id}`, { method: "DELETE" });
        setHistory((prev) => prev.filter((item) => item._id !== id));
    };

    // Theme classes for consistent styling
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

    // Render AppHeader and AppFooter with theme props
    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            <AppHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            {/* Back Button below header, floating while scrolling */}
            <div className="sticky top-0 z-30 bg-inherit pt-4 pb-2">
                <div className="max-w-3xl mx-auto px-4">
                    <button
                        onClick={() => router.back()}
                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium shadow border transition focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${isDarkMode ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-200'}`}
                        aria-label="Go back"
                        style={{ minWidth: 0 }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        <span className="hidden sm:inline">Back</span>
                    </button>
                </div>
            </div>
            <main className="max-w-3xl mx-auto py-8 px-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search code or feedback..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as "desc" | "asc")}
                        className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="mb-3">
                                <Shimmer className="mb-3" height="200px" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        {search ? "No results found" : "No history yet"}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((item) => (
                            <HistoryCard
                                key={item._id}
                                feedback={item}
                                onReReview={handleReReview}
                                onDelete={handleDelete}
                                highlight={search}
                                isDarkMode={isDarkMode}
                            />
                        ))}
                    </div>
                )}
            </main>
            <AppFooter isDarkMode={isDarkMode} />
        </div>
    );
}
