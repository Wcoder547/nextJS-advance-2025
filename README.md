# 🕵️ MstryMessage

> Send and receive anonymous feedback — no identity, no filters, just honest messages.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongodb.com)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://next-js-advance-2025.vercel.app)

**Live Demo →** [next-js-advance-2025.vercel.app](https://next-js-advance-2025.vercel.app)

---

## What It Does

MstryMessage lets you create a personal anonymous inbox. Sign up, get a unique shareable link, and anyone — no account needed — can send you a message without revealing who they are. You see all your messages in a private dashboard. An AI endpoint suggests message ideas so senders are never stuck staring at a blank box.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [About](#about)
- [License](#license)

---

## Features

- **Anonymous inbox** — anyone can message you via your unique link, no account required
- **AI-suggested messages** — `/api/suggest-messages` generates icebreaker prompts to inspire senders
- **Auth & dashboard** — NextAuth-powered sign-up/login with a private message feed
- **Email verification** — transactional emails handled via the `emails/` module (Resend)
- **Toggle accepting messages** — users can open/close their inbox from the dashboard
- **Edge middleware** — `proxy.ts` handles auth-based route protection and redirects
- **Fully responsive** — works on mobile, tablet, and desktop

---

## How It Works

```
User signs up → gets a unique link: /u/username
              ↓
Share link on Twitter, Instagram, bio, etc.
              ↓
Sender visits link (no login needed)
→ Optionally gets AI-suggested messages
→ Sends an anonymous message
              ↓
Owner sees message in their dashboard
(identity hidden — sender is anonymous)
```

---

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | Next.js 15 (App Router)           |
| Language      | TypeScript                        |
| Database      | MongoDB via Mongoose              |
| Auth          | NextAuth.js (Credentials)         |
| Email         | Resend (transactional)            |
| AI Feature    | suggest-messages API (Groq/OpenAI)|
| Styling       | Tailwind CSS + shadcn/ui          |
| Deployment    | Vercel                            |
| Package Mgr   | pnpm                              |

---

## Project Structure

```
Mstrymessage/
├── src/
│   ├── app/              # App Router pages & API routes
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth handlers
│   │   │   ├── suggest-messages/  # AI message suggestions
│   │   │   └── ...
│   │   ├── u/[username]/  # Public anonymous message page
│   │   └── dashboard/     # Private user inbox
│   ├── components/        # UI components (shadcn/ui based)
│   ├── models/            # Mongoose schemas (User, Message)
│   └── lib/               # DB connection, helpers
├── emails/                # Email templates (Resend)
├── proxy.ts               # Edge middleware — auth guards
└── components.json        # shadcn/ui config
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas URI
- Resend API key (for verification emails)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Wcoder547/Mstrymessage.git
cd Mstrymessage

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the values (see below)

# 4. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mstrymessage

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Resend (email verification)
RESEND_API_KEY=your-resend-api-key

# AI suggestions (Groq or OpenAI)
GROQ_API_KEY=your-groq-api-key
# or
OPENAI_API_KEY=your-openai-api-key
```

---

## About

MstryMessage was built as a full-stack Next.js project to explore anonymous communication patterns — think NGL or Sarahah, but self-hosted and fully open source.

The interesting engineering problems here are: keeping sender identity truly anonymous (no logging, no IP association), the AI suggestion endpoint that calls an LLM to generate contextual message prompts, and the edge middleware that cleanly separates public routes (`/u/[username]`) from protected ones (`/dashboard`) without a full server roundtrip.

Built by [Waseem Akram](https://www.linkedin.com/in/wasim-akram-dev/) — full-stack developer, Next.js specialist.

---

## License

MIT © [Waseem Akram](https://github.com/Wcoder547)
