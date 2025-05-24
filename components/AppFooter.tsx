import React from "react";

interface AppFooterProps {
    isDarkMode: boolean;
}

const AppFooter: React.FC<AppFooterProps> = ({ isDarkMode }) => (
    <footer className={`w-full border-t ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'} px-4 py-3 text-center text-xs mt-8`}>
        &copy; {new Date().getFullYear()} AI Peer Review. All rights reserved.
    </footer>
);

export default AppFooter;
