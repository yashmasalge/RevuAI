<!-- filepath: e:\ai-peer-review\README.md -->

<p align="center">
  <img src="public/next.svg" alt="Next.js Logo" width="120" />
  <img src="public/vercel.svg" alt="Vercel Logo" width="100" />
  <img src="public/globe.svg" alt="Project Logo" width="100" />
</p>

<h1 align="center">RevuAI</h1>

<p align="center">
  <b>A modern, AI-powered code review platform built with Next.js, Tailwind CSS, and Vercel.</b>
</p>

---

## 🚀 Overview

AI Peer Review is a web application designed to streamline and automate the code review process using advanced AI models. It allows developers to submit code, receive instant feedback, and track review history, all within a beautiful and intuitive interface.

---

## 🛠️ Technology Stack

- <img src="public/next.svg" alt="Next.js" width="24" /> <b>Next.js 14</b> — React framework for production
- <img src="public/vercel.svg" alt="Vercel" width="24" /> <b>Vercel</b> — Deployment & serverless functions
- <img src="public/globe.svg" alt="Tailwind CSS" width="24" /> <b>Tailwind CSS</b> — Utility-first CSS framework
- <img src="public/file.svg" alt="TypeScript" width="24" /> <b>TypeScript</b> — Type-safe JavaScript
- <img src="public/window.svg" alt="AI" width="24" /> <b>AI/LLM Integration</b> — Automated code analysis
- <img src="public/file.svg" alt="MongoDB" width="24" /> <b>MongoDB</b> — Database for storing feedback and history

---

## 📦 Features

- **AI-Powered Code Review:** Instantly analyze code and receive actionable feedback.
- **GitHub Integration:** Submit code directly from GitHub repositories.
- **Review History:** Track and revisit all your past code reviews.
- **Modern UI:** Responsive, accessible, and visually appealing interface.
- **Fast & Secure:** Built with best practices for performance and security.

---

## 💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-peer-review.git
cd ai-peer-review
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your API keys and MongoDB connection string:

```env
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=your-mongodb-uri
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📝 Project Structure

```
├── app/                # Next.js app directory
│   ├── api/            # API routes (AI, GitHub, History)
│   ├── lib/            # Utility libraries (AI, GitHub, MongoDB)
│   ├── models/         # Data models (Feedback)
│   └── history/        # Review history page
├── components/         # Reusable React components
├── public/             # Static assets and logos
├── styles/             # Global styles
├── package.json        # Project metadata and scripts
└── ...
```

---

## 🌐 Live Demo & Deployment

Deploy your own instance instantly with <a href="https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme" target="_blank"><img src="public/vercel.svg" alt="Deploy on Vercel" width="100" /></a>

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Platform](https://vercel.com/)
- [OpenAI API](https://platform.openai.com/docs/)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/ai-peer-review/issues) or submit a pull request.

---

<p align="center">
  <img src="public/AppLogoIcon.svg" alt="AI Peer Review Logo" width="80" />
</p>

<p align="center">
  <b>Made with ❤️ by the AI Peer Review Team</b>
</p>
