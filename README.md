<div align="center">

<!-- ═══════════════════════════════════════════════════════════
     HERO BANNER — BookBy × maroon literary
     ═══════════════════════════════════════════════════════════ -->

<img
  src="https://capsule-render.vercel.app/api?type=waving&color=6B2A32&height=220&section=header&text=BookBy&fontSize=70&fontColor=FFFFFF&animation=fadeIn&fontAlignY=35&desc=AI%20Book%20Companion%20%C2%B7%20Talk%20with%20your%20books&descAlignY=55&descSize=20"
  alt="BookBy — AI Book Companion"
  width="100%"
/>

<br/>

<img src="public/assets/logo-mark.png" alt="BookBy logo" width="96" />

<br/>

### Talk with your books — upload a PDF, then explore it through voice

Next.js · PostgreSQL · Prisma · Better Auth · Vapi · Tailwind  
— one app that turns static reading into interactive conversation.

<br/>

<!-- ═══════════════════════════════════════════════════════════
     STICKER / BADGE STRIP
     ═══════════════════════════════════════════════════════════ -->

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Vapi](https://img.shields.io/badge/Vapi-6B2A32?style=for-the-badge&logoColor=white)

<br/>

[![License](https://img.shields.io/badge/License-MIT-6B2A32?style=flat-square&logo=github)](#-license)
[![UI](https://img.shields.io/badge/UI-Dashboard_+_Library-823440?style=flat-square)](#-features)
[![Voice](https://img.shields.io/badge/Voice-Vapi-5C1F28?style=flat-square)](#-how-it-works)
[![Auth](https://img.shields.io/badge/Auth-Better_Auth-4A1A22?style=flat-square)](#-tech-stack)

<br/>

</div>

---

## At a Glance

<table>
<tr>
<td width="33%" align="center">

### Upload

PDF ingestion · text extraction  
auto cover · ownership-scoped library

</td>
<td width="33%" align="center">

### Voice

Vapi live sessions · ask questions  
summaries · conversational follow-ups

</td>
<td width="33%" align="center">

### Dashboard

Personal analytics · notifications  
settings · literary light / dark theme

</td>
</tr>
</table>

**Core flow**

```text
Sign in  →  Upload PDF  →  Extract + segment text  →  Store in PostgreSQL (Prisma)
                                                              ↓
                         Dashboard / Library  →  Open book  →  Vapi voice session
                                                              ↓
                                    Ask · summarize · revisit transcripts
```

<div align="center">

### System Architecture

```mermaid
flowchart LR
  subgraph Client
    Landing[Marketing Landing]
    Dash[Dashboard]
    Library[Library UI]
    Chat[Book Voice Page]
  end
  subgraph App
    Auth[Better Auth]
    Upload[Upload API]
    Actions[Book Actions]
  end
  subgraph Data
    PG[(PostgreSQL)]
  end
  subgraph External
    Vapi[Vapi Voice]
    Blob[Vercel Blob]
  end
  Landing -->|sign in| Auth
  Auth --> Dash
  Dash --> Library
  Library -->|upload| Upload
  Upload --> Blob
  Upload --> Actions
  Actions --> PG
  Library -->|open book| Chat
  Chat --> Vapi
  Vapi -->|search tool| Actions
```

### Voice Session Sequence

```mermaid
sequenceDiagram
  participant User
  participant Next as Next.js
  participant PG as PostgreSQL
  participant Vapi

  User->>Next: Upload PDF
  Next->>PG: Save owned book + segments
  User->>Next: Open book page
  Next->>Vapi: Start voice session
  User->>Vapi: Ask about the book
  Vapi->>Next: Search / retrieve context
  Next->>PG: Query segments
  PG-->>Next: Matching passages
  Next-->>Vapi: Context
  Vapi-->>User: Spoken answer
```

</div>

---

## Overview

BookBy is an **AI book companion** for a faster, more interactive way to understand long-form reading material.

Instead of treating a PDF as static text, the app:

- Authenticates users with **Better Auth** (email/password)
- Extracts book content and stores it in **PostgreSQL** under the owner’s account
- Provides a **dashboard** with KPIs, charts, reading history, and activity notifications
- Lets you browse a warm **literary library** (parchment light / charcoal dark)
- Opens **Vapi-powered voice sessions** so you can ask questions out loud
- Keeps **transcripts** so insights are easy to revisit

---

## Features

<table>
<tr>
<td valign="top" width="50%">

#### Ingestion

- PDF upload with progress stages
- Text extraction and segmentation
- Auto-generated cover from the first PDF page
- Optional free-text categories

#### Library & ownership

- Per-user library (owner-scoped books)
- Title / author / category search
- Edit and delete your own titles
- Unique slug per user

</td>
<td valign="top" width="50%">

#### Voice & AI

- Live voice Q&A through Vapi
- Conversational follow-ups
- Session transcripts and duration tracking

#### Product shell

- Marketing landing (GSAP + Framer Motion)
- Authenticated app shell (sidebar, topbar, breadcrumbs)
- Dashboard analytics and notifications
- Settings (profile, theme preference)
- Thin admin book list for admin emails
- Literary light and dark themes

</td>
</tr>
</table>

---

## How It Works

### Step 1 — Create an account

Sign up at `/sign-up`, then sign in. New sessions land on the dashboard.

### Step 2 — Upload a PDF

Add a book from `/books/new`. BookBy extracts text, segments content for retrieval, and generates a cover automatically.

### Step 3 — Voice chat

Open a book page and start a Vapi session. Ask questions, request summaries, and explore ideas at conversation speed.

### Step 4 — Revisit

Return to your dashboard or library, search titles, check notifications, and review voice activity.

---

## Tech Stack

| Layer | Tools |
|-------|--------|
| App | Next.js 16, React 19, TypeScript |
| Auth | Better Auth (email/password, `user` \| `admin` roles) |
| UI | Tailwind CSS, shadcn/ui, GSAP, Framer Motion, Recharts |
| Data | PostgreSQL, Prisma |
| Voice | Vapi |
| Media | Vercel Blob, ElevenLabs (voice selection) |

---

## Project Structure

```text
AIBookAssistant/
├── app/
│   ├── (root)/page.tsx           # Marketing landing
│   ├── (app)/                    # Authenticated shell
│   │   ├── dashboard/
│   │   ├── library/
│   │   ├── books/new/
│   │   ├── settings/
│   │   ├── notifications/
│   │   └── admin/
│   ├── books/[slug]/page.tsx     # Voice chat page
│   ├── sign-in/ · sign-up/
│   ├── api/                      # Auth, upload, Vapi routes
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── landing/                  # Landing sections
│   ├── shell/                    # Sidebar, topbar, notifications
│   ├── dashboard/ · charts/
│   ├── UploadForm.tsx
│   ├── VapiControls.tsx
│   └── ...
├── lib/                          # Auth, actions, analytics, DB, utils
├── prisma/                       # Schema + migrations
├── public/assets/
└── package.json
```

---

## First-Time Setup

### 1. Clone repository

```bash
git clone <your-repo-url>
cd AIBookAssistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment

Create a `.env` file in the project root:

```env
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:bookby_dev@localhost:5433/bookby

# Better Auth — generate secret with: npx auth secret
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
# Comma-separated emails that receive the admin role on sign-up
ADMIN_EMAILS=

BLOB_READ_WRITE_TOKEN=

NEXT_PUBLIC_VAPI_API_KEY=
VAPI_SERVER_SECRET=
NEXT_PUBLIC_ASSISTANT_ID=

GOOGLE_GEMINI_API_KEY=
ELEVENLABS_API_KEY=
UPLOAD_DIR=uploads
```

### 4. Database

Prerequisites: Node.js 18+, npm, PostgreSQL (Docker container `bookby-pg` on host port `5433`, or any Postgres you manage).

```bash
docker start bookby-pg
npx prisma migrate deploy
```

---

## Run The Application

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Route | Description |
|-------|-------------|
| `/` | Marketing landing (public) |
| `/sign-up` · `/sign-in` | Create account / sign in |
| `/dashboard` | Analytics home (authenticated) |
| `/library` | Your books |
| `/books/new` | Upload a PDF |
| `/books/[slug]` | Voice companion for a book |
| `/settings` | Profile and theme |
| `/notifications` | Activity feed |
| `/admin` | Admin book list (admin emails only) |

---

## Notes

- The repository and package name are **BookBy**.
- Authentication uses **Better Auth** (self-hosted, open source) with email/password and a `user` \| `admin` role. Clerk is not used.
- Books are **owner-scoped**; each user only sees and manages their own library.
- Some third-party environment variable names may still follow older integration naming — that is expected unless you rename them everywhere.

---

## Author

### Mohammad Bilal

Software Engineering Student  
AI + Full Stack Developer

---

## License

This project is licensed under the MIT License.

---

## Support

If you liked this project:

- Star the repository
- Fork the project
- Contribute improvements

---

<div align="center">

<img
  src="https://capsule-render.vercel.app/api?type=waving&color=6B2A32&height=120&section=footer&text=Built%20with%20Next.js%20%2B%20Vapi%20%2B%20Prisma&fontSize=18&fontColor=FFFFFF&fontAlignY=65"
  alt="Built with Next.js + Vapi + Prisma"
  width="100%"
/>

<br/>

**[Back to top](#at-a-glance)**

<br/>

<sub>BookBy · Next.js · TypeScript · Tailwind · PostgreSQL · Prisma · Better Auth · Vapi</sub>

<br/>

# Built with Next.js + Vapi + Prisma

</div>
