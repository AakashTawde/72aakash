# 72aakash — VoIP CRM Calling System

Monorepo for a CRM with VoIP calling on web (browser) and Android (Expo).

See **[PLAN.md](./PLAN.md)** for the full design, phases, data model, and decisions.

## Layout

```
shared/    Shared TypeScript types
server/    Node + Express + Prisma + SQL Server (REST API + Socket.io)
web/       Vite + React + Tailwind  (desktop browser app)
mobile/    Expo React Native        (Android app)
```

## Quick start (Phase 1 — auth only)

### Prerequisites

- Node.js 18+
- MS SQL Server running locally (or any reachable SQL Server instance)
- Android device or emulator (for mobile)

### 1. Install everything

```bash
npm install
```

### 2. Configure server

```bash
cd server
cp .env.example .env
# Edit .env — set DATABASE_URL to your SQL Server, set JWT_SECRET
```

`DATABASE_URL` example for local SQL Server:

```
DATABASE_URL="sqlserver://localhost:1433;database=voipcrm;user=sa;password=YourPassword;trustServerCertificate=true"
```

### 3. Migrate DB & start server

```bash
cd server
npx prisma migrate dev --name init
npm run dev          # http://localhost:4000
```

### 4. Start web

```bash
cd web
npm run dev          # http://localhost:5173
```

### 5. Start mobile

```bash
cd mobile
npx expo start
# scan QR with Expo Go on Android
```

By default, mobile points to `http://10.0.2.2:4000` (Android emulator) — change `EXPO_PUBLIC_API_URL` in `mobile/.env` if running on a real device.

## Branches

- `claude/voip-calling-system-mJ2rG` — active development
