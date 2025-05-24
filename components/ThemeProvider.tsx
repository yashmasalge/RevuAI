'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Only run once when component mounts
    useEffect(() => {
        // Set theme on mount
        const applyTheme = (theme: 'dark' | 'light') => {
            setIsDarkMode(theme === 'dark');
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        };

        // Check saved theme or system preference
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        // Listen for theme changes in other tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'theme') {
                applyTheme((e.newValue as 'dark' | 'light') || (prefersDark ? 'dark' : 'light'));
            }
        };
        window.addEventListener('storage', handleStorage);

        setMounted(true);
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const next = !prev;
            const theme = next ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return next;
        });
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
