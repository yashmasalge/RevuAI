'use client'
import React, { useEffect, useState } from "react";
import HistoryCard from "../../components/HistoryCard";
import Link from "next/link";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import { useTheme } from "../../components/ThemeProvider";

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

    return (<div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <AppHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-1 max-w-2xl mx-auto w-full px-2 sm:px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 gap-2 px-0 sm:px-0">
                <input
                    type="text"
                    placeholder="Search code or feedback..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded px-3 py-1 text-sm w-full sm:w-64`}
                />
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "desc" | "asc")}
                    className={`border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded px-2 py-1 text-sm`}
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>
            {loading ? (
                <div className="text-gray-500 px-4">Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="text-gray-500 px-4">No history found.</div>
            ) : (
                <div className="flex flex-col gap-6">
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
