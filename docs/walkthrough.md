# Land Mines Web App Migration

I have successfully converted the character tracker into a modern Next.js web application.

## New Features
- **Dashboard**: Overview of roster statistics and quick navigation.
- **Roster View**: Detailed list of all characters with status indicators.
- **Edit Characters**: Ability to update character details (Name, Status, Notes, etc.) via a responsive form.
- **Skills Database**: Searchable grid view of all available skills.
- **Character Builder**: Interactive tool to plan characters, calculating point costs for races and skills automatically.
  - *New Feature*: "Finalize Character" button saves the build directly to the Roster!

## Technical Details
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS (Premium Dark Mode with Glassmorphism)
- **Data**: JSON-based persistence (`web/data/data.json`).
- **Type Safety**: Full TypeScript implementation.

## How to Run

1. Navigate to the `web` directory:
   ```bash
   cd web
   ```
2. Install dependencies (if not already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Next Steps
- **Database**: For production hosting with multiple users, migrate `web/data/data.json` to a real database (Postgres/SQLite).
- **Authentication**: Add login protection for the "Edit" and "Builder" features.
