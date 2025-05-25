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
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sort === "desc" ? dateB - dateA : dateA - dateB;
        });

    // Re-review handler
    const handleReReview = (code: string) => {
        window.location.href = `/?code=${encodeURIComponent(code)}`;
    };

    // Delete handler with confirmation modal
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
        try {
            await fetch(`/api/history?id=${id}`, { method: "DELETE" });
            setHistory((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            alert("Failed to delete review. Please try again.");
        }
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

    return (
        <div className={`min-h-screen ${themeClasses.background} transition-colors duration-300`}>
            <AppHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            {/* Floating Back Button */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-10">
                <Link href="/"
                    className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium shadow-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-40 hover:opacity-100 hover:scale-105
                        ${isDarkMode
                            ? 'bg-gray-800/50 backdrop-blur-sm text-gray-100 hover:bg-gray-800 border-gray-700/50 hover:border-gray-700'
                            : 'bg-white/50 backdrop-blur-sm text-gray-800 hover:bg-white border-gray-200/50 hover:border-gray-200'}`}
                    aria-label="Back to home"
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="ml-1">Back</span>
                </Link>
            </div>

            {/* Header Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className={`text-2xl font-semibold ${themeClasses.text}`}>Review History</h1>
                        <p className={`mt-2 ${themeClasses.textSecondary}`}>
                            A list of all code reviews including their results and timestamps.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={() => router.push('/')}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                                bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200
                                transform hover:scale-105`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            New Review
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search in code or review content..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`block w-full rounded-lg border pl-10 pr-3 py-2 text-sm 
                                ${isDarkMode
                                    ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200`}
                        />
                    </div>
                    <div className="flex-none">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as "desc" | "asc")}
                            className={`block w-full rounded-lg border px-3 py-2 pr-8 text-sm
                                ${isDarkMode
                                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                                    : 'bg-white border-gray-300 text-gray-900'}
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                transition-colors duration-200`}
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Results Section */}
                <div className="mt-6 flow-root">
                    {loading ? (
                        <div className="grid gap-6">
                            {[...Array(3)].map((_, i) => (
                                <Shimmer key={i} className="h-48 rounded-xl" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={`text-center py-12 ${themeClasses.textSecondary}`}>
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className={`mt-2 text-sm font-medium ${themeClasses.text}`}>No reviews found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {search ? "Try adjusting your search query" : "Get started by creating your first code review"}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => router.push('/')}
                                    className="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                    </svg>
                                    New Review
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
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
                </div>
            </div>

            <AppFooter isDarkMode={isDarkMode} />
        </div>
    );
}
