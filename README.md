# BookBy

BookBy is an AI book companion that turns PDFs into interactive voice conversations. Upload a book, process its content, talk to it through Vapi-powered voice sessions, and keep track of transcripts, summaries, and your personal reading library.

<p align="center">
  <img src="public/readme/readme-hero-new.webp" alt="BookBy project banner" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vapi-62F6B5?style=for-the-badge&logoColor=000000" />
</p>

## Overview

BookBy is built for people who want a faster, more interactive way to understand long-form reading material. Instead of treating a PDF as static text, the app extracts book content, stores it in MongoDB, and lets users explore it through search, summaries, transcripts, and live voice interaction.

## Core Features

- PDF upload and ingestion with text extraction and segmentation.
- Voice-first Q&A with uploaded books through Vapi.
- AI-generated summaries and conversational follow-ups.
- Library browsing for saved books and recent uploads.
- Authentication and protected user sessions with Clerk.
- Transcript history for reviewing past conversations.
- Responsive UI built with Next.js, Tailwind CSS, and shadcn/ui.

## Suggested Features to Add Next

If you want to expand BookBy further, these are the highest-value additions:

- Bookmarking and notes for individual pages or passages.
- Reading progress tracking with goals, streaks, and completion stats.
- Chapter-level navigation and auto-generated chapter outlines.
- Highlight extraction with export to Markdown, PDF, or Notion.
- Multi-book comparison so users can ask questions across several titles.
- Personalized reading recommendations based on saved books and activity.
- Voice profiles per book, genre, or user preference.
- Public sharing links for curated book summaries or transcripts.
- Offline reading mode for cached summaries and extracted notes.
- Admin analytics for uploads, active users, and popular books.

## Tech Stack

- Next.js 16 for the application shell, routing, and server rendering.
- TypeScript for type safety and maintainability.
- MongoDB and Mongoose for book, segment, and session storage.
- Clerk for authentication and user management.
- Vapi for real-time conversational voice experiences.
- ElevenLabs for voice selection and audio generation.
- Tailwind CSS and shadcn/ui for the interface.

## Local Setup

Prerequisites:

- Node.js 18 or newer
- npm
- A MongoDB database

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

BLOB_READ_WRITE_TOKEN=
MONGODB_URI=

NEXT_PUBLIC_VAPI_API_KEY=
VAPI_SERVER_SECRET=

GOOGLE_GEMINI_API_KEY=
ELEVENLABS_API_KEY=
```

Run the app locally:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Notes

- The repository name and package name have been updated to BookBy.
- Some third-party environment variable names may still follow the original integration naming pattern. That is normal unless you want to rename the variables everywhere and update your deployment settings too.

## Assets

Project imagery and supporting assets are stored in `public/readme` and `public/assets`.
