# Implementation Plan - Land Mines Web App Migration

The goal is to convert the existing static/script-based character tracker into a hosted, editable web application using Next.js.
This will allow users to view the roster, view skills, and build characters, as well as edit the underlying data.

## User Review Required

> [!IMPORTANT]
> **Data Persistence**: The application will use a local `data.json` file for persistence initially. This works for a single instance but isn't suitable for high-concurrency editing or ephemeral hosting (like Vercel serverless functions without external storage).
> **Recommendation**: For a true "hosted" experience where users can edit, we should ideally use a database (e.g., Vercel Postgres, Supabase, or SQLite on a VPS). For this MVP, I will stick to file-based `data.json` but structure it so it can be swapped for a DB later.

> [!NOTE]
> **Styling**: Adhering to user rules, I will use **Vanilla CSS** (CSS Modules/Global CSS) instead of Tailwind CSS. I will aim for the "Premium Design" aesthetic requested.

## Proposed Changes

### Project Structure
Create a new `web` directory for the Next.js application.

#### [NEW] `web/`
- Initialize Next.js app (TypeScript, ESLint).
- Move `data.json` to `web/data/data.json` (or `web/public` if read-only, but we need write access so `web/data` or root is better).

### Components & Pages

#### [NEW] `web/src/app/layout.tsx` & `globals.css`
- strict semantic HTML.
- "Premium" dark mode aesthetic (Inter/Outfit fonts, glassmorphism).

#### [NEW] `web/src/app/page.tsx` (Home)
- Dashboard showing quick stats (Roster count, etc).
- Navigation cards to Roster, Skills, Builder.

#### [NEW] `web/src/app/roster/page.tsx`
- Grid/Table view of characters.
- "Edit" mode/modal to modify character details.

#### [NEW] `web/src/app/builder/page.tsx`
- Port `builder.html` logic.
- Reactive state for points calculation.
- "Help Guide" toggle logic.
- **New Feature**: "Save Character" (adds to Roster/separate list).

#### [NEW] `web/src/app/api/data/route.ts`
- GET: Return full data.
- POST: Update specific collections (roster/skills).

### Utilities

#### [NEW] `web/src/lib/data.ts`
- Server-side helpers to read/write `data.json`.

## Verification Plan

### Automated Tests
- Unfortunately, no existing tests provided.
- I will verify the build using `npm run build`.

### Manual Verification
1.  **Start Dev Server**: `npm run dev` in `web/`.
2.  **Roster**: Verify all characters from `data.json` load. Try editing a character's status and refresh to confirm persistence.
3.  **Builder**: Create a character (Human + Skills), verify point math matches existing logic (Human=0 cost, Skills subtract from 100).
4.  **Aesthetics**: Visual check for "premium" feel (fonts, spacing, colors).
