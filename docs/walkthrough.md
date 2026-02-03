# Project Restoration & Deployment Walkthrough

## 1. Restoration Verification
- **Project Structure**: Confirmed `src`, `data`, and `docs` folders are intact.
- **Dependencies**: Successfully installed 390+ packages via `npm install`.
- **Build**: `next build` executed successfully, generating the standalone application.
- **Data Init**: Confirmed `data.json` is automatically created from `data.seed.json` if missing.

## 2. Deployment Guide Updates
Based on real-world deployment to your Fedora server, we refined the [Deployment Guide](deployment_guide.md):
- **User Setup**: Added specific instructions for creating the `landmines` user with a home directory (`-m`).
- **Permissions**: Clarified `/opt/landmines` ownership.
- **Micro-optimizations**: Removed incorrect `/web` subfolder references.
- **Firewall**: Added `firewall-cmd` steps for port 3000.
- **Startup**: Switched to `node .next/standalone/server.js` to match the `output: standalone` build config and resolve warnings.

## 3. Validation
- **Status**: ✅ **SUCCESS**
- **Verification**: User confirmed the site is running at `landmines.daerma.com` (screenshot provided).
- **Core Features**: "Elysium" dashboard, stats, and navigation are visible.
