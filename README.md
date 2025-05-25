
<p align="center">
  <img src="public/favicon.svg" alt="RevuAI Logo" width="64" />
</p>

<h1 align="center">RevuAI</h1>

<p align="center">
  <b>A modern, AI-powered code review platform built with Next.js, Tailwind CSS, and Vercel.</b>
</p>

---

## 🚀 Overview

RevuAI is a web application designed to streamline and automate the code review process using advanced AI models. It allows developers to submit code, receive instant feedback, and track review history, all within a beautiful and intuitive interface.

---

## 🛠️ Technology Stack

- <img src="public/next.svg" alt="Next.js" width="20" style="vertical-align:middle;" /> <b>Next.js 14</b> — React framework for production
- <img src="public/vercel.svg" alt="Vercel" width="20" style="vertical-align:middle;" /> <b>Vercel</b> — Deployment & serverless functions
- <img src="public/globe.svg" alt="Tailwind CSS" width="20" style="vertical-align:middle;" /> <b>Tailwind CSS</b> — Utility-first CSS framework
- <img src="public/file.svg" alt="TypeScript" width="20" style="vertical-align:middle;" /> <b>TypeScript</b> — Type-safe JavaScript
- <img src="public/window.svg" alt="AI" width="20" style="vertical-align:middle;" /> <b>AI/LLM Integration</b> — Automated code analysis
- <img src="public/file.svg" alt="MongoDB" width="20" style="vertical-align:middle;" /> <b>MongoDB</b> — Database for storing feedback and history

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
git clone https://github.com/your-username/revuai.git
cd revuai
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

## 🌐 Live Demo

The project is already deployed! Experience RevuAI live at: [https://revu-ai-nine.vercel.app/](https://revu-ai-nine.vercel.app/)

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Platform](https://vercel.com/)
- [OpenAI API](https://platform.openai.com/docs/)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/revuai/issues) or submit a pull request.

---

<p align="center">
  <img src="public/favicon.svg" alt="RevuAI Logo" width="48" />
</p>

<p align="center">
  <b>Made with ❤️ by the RevuAI Team</b>
</p>
