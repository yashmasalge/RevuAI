import React from "react";

interface AppFooterProps {
    isDarkMode: boolean;
}

const AppFooter: React.FC<AppFooterProps> = ({ isDarkMode }) => (
    <footer className={`w-full border-t hidden sm:block ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
        } px-4 py-3 text-center text-xs`}>
        <div className="max-w-4xl mx-auto flex items-center justify-center flex-col gap-1">
            <div>Built with AI • Always review suggestions before implementing</div>
            <div>© 2025 RevuAI. All rights reserved.</div>
        </div>
    </footer>
);

export default AppFooter;
