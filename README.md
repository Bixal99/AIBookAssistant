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

Next.js · PostgreSQL · Prisma · Vapi · Tailwind  
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
[![UI](https://img.shields.io/badge/UI-Landing_+_Library-823440?style=flat-square)](#-application-preview)
[![Voice](https://img.shields.io/badge/Voice-Vapi-5C1F28?style=flat-square)](#-how-it-works)
[![DB](https://img.shields.io/badge/DB-PostgreSQL_+_Prisma-4A1A22?style=flat-square)](#-tech-stack)

<br/>

</div>

---

## At a Glance

<table>
<tr>
<td width="33%" align="center">

### Upload

PDF ingestion · text extraction  
segmentation · cover-ready library cards

</td>
<td width="33%" align="center">

### Voice

Vapi live sessions · ask questions  
summaries · conversational follow-ups

</td>
<td width="33%" align="center">

### Library

Browse recent books · search  
transcripts · warm literary UI

</td>
</tr>
</table>

**Core flow**

```text
Upload PDF  →  Extract + segment text  →  Store in PostgreSQL (Prisma)
                                              ↓
                    Open book page  →  Start Vapi voice session
                                              ↓
                         Ask · summarize · revisit transcripts
```

<div align="center">

### System Architecture

```mermaid
flowchart LR
  subgraph Client
    Landing[Marketing Landing]
    Library[Library UI]
    Chat[Book Voice Page]
  end
  subgraph App
    Upload[Upload API]
    Actions[Book Actions]
  end
  subgraph Data
    PG[(PostgreSQL)]
  end
  subgraph External
    Vapi[Vapi Voice]
    Blob[Blob Storage]
  end
  Landing -->|CTA| Library
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
  Next->>PG: Save book + segments
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

BookBy is an **AI book companion** built for people who want a faster, more interactive way to understand long-form reading material.

Instead of treating a PDF as static text, the app:

- Extracts book content and stores it in **PostgreSQL**
- Lets you browse a warm **literary library**
- Opens **Vapi-powered voice sessions** so you can ask questions out loud
- Keeps **transcripts and summaries** so insights are easy to revisit

---

## Features

<table>
<tr>
<td valign="top" width="50%">

#### Ingestion

- PDF upload and text extraction
- Content segmentation for retrieval
- Cover and slug-ready book records

#### Library UX

- Recent books grid
- Title / author search
- Warm parchment theme (maroon accents on landing)

</td>
<td valign="top" width="50%">

#### Voice & AI

- Live voice Q&A through Vapi
- Conversational follow-ups
- Session transcripts

#### Product shell

- Marketing landing with GSAP + Framer Motion
- Upload flow at `/books/new`
- Responsive Next.js + Tailwind UI

</td>
</tr>
</table>

---

## Application Preview

### Landing

Marketing home with parchment hero, maroon section bands, and voice CTA.

![BookBy landing](public/readme/readme-hero-new.webp)

### Library & product

Browse uploads, open a book, and start a voice conversation.

<p align="center">
  <img src="public/readme/module-thumb.webp" alt="BookBy module thumbnail" width="70%" />
</p>

---

## How It Works

### Step 1 — Upload a PDF

Add a book from `/books/new`. BookBy extracts text and prepares segments for search and conversation.

### Step 2 — AI processing & storage

Content is saved with Prisma into PostgreSQL so the library, search, and voice tools share one source of truth.

### Step 3 — Voice chat

Open a book page and start a Vapi session. Ask questions, request summaries, and explore ideas at conversation speed.

### Step 4 — Revisit

Return to your library, search titles, and review transcripts from earlier sessions.

---

## Tech Stack

| Layer | Tools |
|-------|--------|
| App | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui, GSAP, Framer Motion |
| Data | PostgreSQL, Prisma |
| Voice | Vapi |
| Media | Vercel Blob (optional), ElevenLabs (voice selection) |

---

## Project Structure

```text
AIBookAssistant/
├── app/
│   ├── (root)/
│   │   ├── page.tsx              # Marketing landing
│   │   ├── library/page.tsx      # Library home
│   │   └── books/new/page.tsx    # Upload flow
│   ├── books/[slug]/page.tsx     # Voice chat page
│   ├── api/                      # Upload + Vapi routes
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── landing/                  # Landing navbar, hero, sections, footer
│   ├── HeroSection.tsx           # In-app library hero
│   ├── UploadForm.tsx
│   ├── VapiControls.tsx
│   └── ...
├── lib/                          # Actions, DB, utils, zod
├── prisma/                       # Schema + migrations
├── public/
│   ├── assets/                   # Logo, hero illustration
│   └── readme/                   # README imagery
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

- `/` — marketing landing  
- `/library` — book library  
- `/books/new` — upload a PDF  

---

## Future Improvements

- Authentication and per-user libraries
- Bookmarking and notes for passages
- Reading progress, goals, and streaks
- Chapter-level navigation and outlines
- Highlight export to Markdown / Notion
- Multi-book comparison across titles
- Personalized recommendations
- Voice profiles per book or preference
- Public sharing links for summaries
- Offline mode for cached notes
- Admin analytics for uploads and popular books

---

## Notes

- The repository and package name are **BookBy**.
- Auth (Clerk) and MongoDB were removed; the app currently runs without login against a shared library.
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

<sub>BookBy · Next.js · TypeScript · Tailwind · PostgreSQL · Prisma · Vapi</sub>

<br/>

# Built with Next.js + Vapi + Prisma

</div>
