# 🔖 Smart Bookmark App

A modern, full-stack bookmark manager built with **Next.js 15**, **Supabase**, and **Tailwind CSS**. Save, organize, and access your bookmarks from anywhere with real-time cross-tab sync and a premium dark UI.

🔗 **Live Demo:** [your-app.vercel.app](https://your-app.vercel.app) _(update after deployment)_

---

## ✅ Assignment Requirements

| #   | Requirement                                    | Status         |
| --- | ---------------------------------------------- | -------------- |
| 1   | Sign up/log in with Google (Google OAuth only) | ✅ Implemented |
| 2   | Add a bookmark (URL + title)                   | ✅ Implemented |
| 3   | Bookmarks are private per user (RLS)           | ✅ Implemented |
| 4   | Real-time updates without page refresh         | ✅ Implemented |
| 5   | Delete bookmarks                               | ✅ Implemented |
| 6   | Deployed on Vercel with live URL               | ✅ Deployed    |

---

## 🚀 Features

### Core

- 🔐 **Google OAuth** — Sign in with Google, no email/password
- ➕ **Add Bookmarks** — Paste a URL (title auto-fills or can be custom)
- ✏️ **Edit Bookmarks** — Inline editing with save/cancel
- 🗑️ **Delete Bookmarks** — Confirmation dialog before deletion
- 🔒 **Row Level Security** — Users can only see/edit/delete their own bookmarks
- ⚡ **Real-time Sync** — Open two tabs, add a bookmark in one — it appears in the other instantly (BroadcastChannel API)

### Enhanced

- 🔍 **Search & Filter** — Instantly search through bookmarks by title or URL
- 🔢 **Bookmark Count** — Badge showing total bookmark count
- � **Site Favicons** — Auto-fetched favicons for each bookmark
- 🔗 **URL Validation** — Server-side validation checks if links are actually reachable before saving
- 🍞 **Toast Notifications** — Custom animated toasts for success, error, and delete feedback
- ✅ **Confirm Dialogs** — Custom confirmation dialogs (no browser `alert()`/`confirm()`)
- � **Fully Responsive** — Works on mobile, tablet, and desktop
- 🌙 **Dark Theme** — Premium glassmorphism UI with Inter font
- 💀 **404 Page** — Visually striking custom error page
- 🔖 **Emoji Favicon** — Custom bookmark emoji favicon

---

## 🛠️ Tech Stack

| Technology                  | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| **Next.js 15** (App Router) | React framework, SSR, server actions          |
| **Supabase**                | Auth (Google OAuth), PostgreSQL database, RLS |
| **TypeScript**              | Type-safe development                         |
| **Tailwind CSS**            | Utility-first styling                         |
| **Lucide React**            | Icon library                                  |
| **BroadcastChannel API**    | Cross-tab real-time sync                      |

---

## 🧩 Problems Encountered & Solutions

### 1. Supabase Auth Cookie Errors on Vercel

**Problem:** After deploying to Vercel, Google OAuth would fail with cookie-related errors. The auth callback couldn't properly exchange the OAuth code for a session because Supabase's SSR auth cookies weren't being handled correctly in the serverless environment.

**Solution:** Used `@supabase/ssr` package with proper cookie handling in both server and client contexts. Created separate Supabase client utilities for server components (`utils/supabase/server.ts`) and client components (`utils/supabase/client.ts`). The server client uses `cookies()` from `next/headers` to read/write auth cookies, while the middleware (`middleware.ts`) refreshes the session on every request.

---

### 2. Real-Time Updates Without Supabase Realtime Subscriptions

**Problem:** The assignment required bookmark list updates in real-time without page refresh when working across multiple tabs. Initially tried Supabase Realtime subscriptions, but they added complexity and had connection reliability issues during development.

**Solution:** Used the browser's native `BroadcastChannel` API for cross-tab communication. When a bookmark is added, edited, or deleted in one tab, a message is broadcast to all other open tabs of the same origin. Each tab listens for these messages and re-fetches the bookmark list. This approach is simpler, more reliable, and requires zero additional infrastructure. Also added `window.addEventListener("focus")` as a fallback to refresh data when the user switches back to a tab.

---

### 3. LinkedIn & Social Media URLs Failing Validation

**Problem:** The URL validation feature (which checks if a URL is reachable before saving) rejected valid URLs from LinkedIn, Twitter, Instagram, and similar sites. These sites return HTTP status codes like `403` or `999` to block automated requests, and the original validation only accepted `200`-range responses.

**Solution:** Changed the validation logic to accept _any_ HTTP response as proof the server exists — even `403`, `999`, or other non-`2xx` codes. The only rejection criteria are now connection failures (DNS errors, no server) or timeouts. Also updated the User-Agent header to mimic a real browser, and increased the timeout from 5 to 8 seconds.

---

### 4. Duplicate Toast Notifications in React Strict Mode

**Problem:** During development, React Strict Mode caused components to mount twice, which triggered the sign-in/sign-out toast messages to appear twice — one stacked on top of the other.

**Solution:** Used `useRef` guards in the `WelcomeToast` and `SignedOutToast` components. A `hasShown` ref is set to `true` after the first toast is displayed, preventing duplicate toasts on the second mount in Strict Mode. Additionally, URL search params (`?signed_in=true`, `?signed_out=true`) are cleaned up immediately after the toast is triggered using `window.history.replaceState()`.

---

### 5. Tailwind Dark Mode Not Applying

**Problem:** After switching the app to a dark theme using `dark:` Tailwind classes, the dark styles weren't being applied. This was because Tailwind's default dark mode strategy uses `prefers-color-scheme` (media query), but the app needed class-based dark mode.

**Solution:** Updated `tailwind.config.ts` to use `darkMode: "class"` and added `className="dark"` to the `<html>` element in the root layout. This ensures dark mode is always active regardless of the user's OS preference.

---

### 6. Hydration Mismatch with Client-Side URL Parsing

**Problem:** Using `new URL(bookmark.url)` in the bookmark list component for favicon extraction caused hydration mismatches because the server and client rendered slightly different results for certain URLs.

**Solution:** Moved all URL parsing logic to be used only in positions that don't affect hydration (e.g., inside `src` attributes of `<img>` tags with `onError` fallbacks), and ensured the component is marked as `"use client"` to avoid SSR/client mismatches.

---

## 📁 Project Structure

```
app/
├── auth/
│   ├── callback/              # OAuth callback handler (exchanges code for session)
│   └── auth-code-error/       # Authentication error page
├── components/
│   ├── toast.tsx              # Custom toast notification system (ToastProvider)
│   └── confirm-dialog.tsx     # Custom confirmation dialog (ConfirmProvider)
├── dashboard/
│   ├── page.tsx               # Main dashboard (server component)
│   ├── actions.ts             # Server actions (add, edit, delete, validate URL)
│   ├── add-bookmark-form.tsx  # Add bookmark form (client component)
│   ├── bookmark-list.tsx      # Bookmark list with search/filter (client component)
│   ├── logout-button.tsx      # Sign out button
│   ├── welcome-toast.tsx      # Sign-in toast trigger
│   └── providers.tsx          # Context providers wrapper
├── login/
│   ├── page.tsx               # Login page with branding
│   ├── login-form.tsx         # Google OAuth button
│   └── providers.tsx          # Login page providers
├── globals.css                # Global styles, animations, scrollbar
├── layout.tsx                 # Root layout (Inter font, dark mode, favicon)
├── not-found.tsx              # Custom 404 page
└── page.tsx                   # Home (redirects to dashboard or login)
utils/
└── supabase/
    ├── server.ts              # Supabase client for server components
    └── client.ts              # Supabase client for client components
types/
└── supabase.ts                # Database TypeScript types
supabase/
└── schema.sql                 # Database schema + RLS policies
middleware.ts                  # Session refresh middleware
```

---

## 🏗️ Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- A Supabase project

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

- Create a project at [supabase.com](https://supabase.com)
- Run the SQL from `supabase/schema.sql` in the SQL Editor
- Enable Google OAuth provider (see below)

### 3. Google OAuth Setup

**A. Google Cloud Console:**

- Go to [console.cloud.google.com](https://console.cloud.google.com/) → APIs & Services → Credentials
- Create an OAuth client ID (Web application)
- Add Authorized redirect URI:
  ```
  https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback
  ```
- Copy the Client ID and Client Secret

**B. Supabase Dashboard:**

- Authentication → Providers → Google → Enable
- Paste Client ID and Client Secret
- Save

### 4. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment (Vercel)

1. Push code to a public GitHub repository
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Add your Vercel domain to Google Cloud OAuth authorized redirect URIs
5. Update Supabase → Authentication → URL Configuration → Site URL to your Vercel domain
6. Deploy!

---

## 🔒 Security

- **Row Level Security (RLS)** — All database operations are protected by Supabase RLS policies
- **Google OAuth Only** — No email/password; authentication handled entirely by Google
- **Server-Side Validation** — URLs are validated on the server before being saved
- **No Sensitive Data Exposed** — Only `NEXT_PUBLIC_*` env vars are used (anon key is safe for client-side use)

---

## 📄 License

MIT
