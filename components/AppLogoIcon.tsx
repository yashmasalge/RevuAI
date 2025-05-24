// Simple logo icon for header (AI Peer Review)
export default function AppLogoIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            className={className}
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="14" cy="14" r="14" fill="url(#paint0_linear)" />
            <path d="M9.5 18.5C9.5 15.1863 12.1863 12.5 15.5 12.5H18.5V15.5C18.5 18.8137 15.8137 21.5 12.5 21.5H9.5V18.5Z" fill="#fff" fillOpacity="0.9" />
            <path d="M18.5 9.5C18.5 12.8137 15.8137 15.5 12.5 15.5H9.5V12.5C9.5 9.18629 12.1863 6.5 15.5 6.5H18.5V9.5Z" fill="#fff" fillOpacity="0.7" />
            <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#A21CAF" />
                </linearGradient>
            </defs>
        </svg>
    );
}
