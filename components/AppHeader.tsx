import Link from 'next/link';
import AppLogoIcon from './AppLogoIcon';

interface AppHeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function AppHeader({ isDarkMode, toggleTheme }: AppHeaderProps) {
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
        <header className={`${themeClasses.cardBg} border-b ${themeClasses.border} px-3 sm:px-4 py-3 shadow-sm transition-colors duration-300`}>
            <div className="hidden:max-w-4xl mx-auto flex items-center justify-evenly sm:justify-between">
                <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                    {/* Logo Icon Button */}
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label="Home"
                        className="rounded-full p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ minWidth: 0 }}
                        disabled
                    >
                        <AppLogoIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </button>
                    {/* Logo Text */}
                    <h1 className={`text-lg sm:text-xl font-semibold ${themeClasses.text} group-hover:opacity-80 transition-opacity`}>
                        <span className="hidden sm:inline">RevuAI</span>
                        <span className="sm:hidden">RevuAI</span>
                    </h1>
                </Link>

                <div className="flex flex-1 justify-center mx-4"></div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link href="/history"
                        className={`flex items-center justify-center h-8 w-8 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            } transition-all duration-200 hover:scale-105 hover:shadow-md`}
                        title="View History"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Link>

                    <div className={`hidden sm:flex items-center space-x-2 text-sm ${themeClasses.textMuted}`}>
                        <span>Powered by AI</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg ${themeClasses.hoverBg} ${themeClasses.text} transition-all duration-200 hover:scale-105 active:scale-95`}
                        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
