import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Removed GeistMono as it is not exported from next/font/google

export const metadata: Metadata = {
  title: "RevuAI - Your AI-Powered Peer Review Assistant",
  description: "RevuAI is an intelligent, developer-friendly web app that provides instant peer reviews of your code using the power of AI. Get smart, structured feedback in seconds.",
  keywords: "code review, ai code review, peer review, code analysis, ai assistant, developer tool",
  authors: [{ name: "RevuAI" }],
  robots: "index, follow",
  openGraph: {
    title: "RevuAI - Your AI-Powered Peer Review Assistant",
    description: "RevuAI is an intelligent, developer-friendly web app that provides instant peer reviews of your code using the power of AI. Get smart, structured feedback in seconds.",
    url: "https://revuai.com",
    siteName: "RevuAI",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "RevuAI Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "RevuAI - Your AI-Powered Peer Review Assistant",
    description: "RevuAI is an intelligent, developer-friendly web app that provides instant peer reviews of your code using the power of AI. Get smart, structured feedback in seconds.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
