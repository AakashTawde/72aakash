# VoIP CRM Calling System — Plan

A web + Android calling system with CRM features (leads, call recording, call logs, reminders).

## Goals

- **Desktop (web, browser)** and **Mobile (Android via React Native + Expo)** — agents can make and receive calls from either device
- **Calling**: outbound + inbound, both legs use the same business number
- **Call recording**: every call recorded automatically, attached to call log
- **Call logs**: full inbound/outbound history per agent, per lead, with duration, status, recording
- **Lead management**: add/edit/list/assign leads, status pipeline, notes, activity timeline
- **Reminders**: schedule callbacks; notify on web + mobile when due
- **Roles**: admin (manages agents, all leads) + agent (own leads + own calls)

## Stack

| Layer | Choice |
|---|---|
| Telephony | **Exotel** (Indian cloud telephony — best price + simple REST API + recording included) |
| Backend | Node.js + Express + Prisma ORM |
| Database | **MS SQL Server** (Prisma `sqlserver` provider) |
| Web | React + Vite + Tailwind CSS |
| Mobile | React Native + Expo (Android first) |
| Realtime (incoming-call ring) | Socket.io |
| Mobile push | Expo Push Notifications |
| Dev tunnel for Exotel webhooks | ngrok |
| Auth | JWT, email + password, bcrypt |

## "Use existing number" — strategy

User's existing personal mobile is `981XXXXXXX` (Jio/Airtel/Vi). Two legal paths to keep that number visible:

1. **Port the number to Exotel** (MNP) — only way for both inbound *and* outbound to show `981`. Permanent move; old SIM dies; ~7–14 days.
2. **Forward existing number to a new Exotel virtual number** — inbound on `981` still works (auto-forwarded). Outbound from app shows the new Exotel number. Easier, reversible.

> **Caller-ID spoofing (showing a number you don't own) is illegal in India (TRAI). Not an option.**

**Decision**: Build the system using an Exotel test/trial number first. The code is identical for both paths above — once happy with the app, decide port vs forward.

## Architecture

```
   Customer's phone (PSTN)
            │
            ▼
   ┌──────────────────┐
   │  Exotel cloud    │  ← virtual number (later: ported 981)
   └──────────────────┘
        │       ▲
 webhook│       │ API (click-to-call, recordings)
        ▼       │
   ┌──────────────────┐
   │   Our backend    │  Node + Express + Prisma + SQL Server
   │ (REST + Socket)  │
   └──────────────────┘
        ▲       ▲
        │       │
  ┌─────┘       └─────┐
  │                   │
Web (React)      Mobile (Expo Android)
```

**Inbound flow:** Customer dials business number → Exotel hits backend webhook → backend pushes "incoming call" to agent's web (Socket.io) and mobile (Expo Push) → agent answers → Exotel bridges audio → on call end, Exotel posts duration + recording URL → saved to call log.

**Outbound (click-to-call):** Agent clicks "Call" on a lead → backend calls Exotel API to bridge agent's device with customer → customer's caller ID = business number → recording + duration logged after call.

## Repo layout (monorepo, npm workspaces)

```
72aakash/
├── PLAN.md
├── README.md
├── package.json          # workspaces: server, web, mobile, shared
├── .gitignore
├── shared/               # shared TypeScript types (Lead, CallLog, User, ...)
├── server/               # Express + Prisma + JWT auth
│   ├── prisma/schema.prisma
│   └── src/
├── web/                  # Vite + React + Tailwind
└── mobile/               # Expo React Native (Android)
```

## Data model (Prisma, MS SQL Server)

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String
  passwordHash String
  role         Role     @default(AGENT)   // ADMIN | AGENT
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  leads        Lead[]   @relation("OwnerLeads")
  callLogs     CallLog[]
  reminders    Reminder[]
}

model Lead {
  id        String      @id @default(uuid())
  name      String
  phone     String
  email     String?
  status    LeadStatus  @default(NEW)
  source    String?
  ownerId   String?
  owner     User?       @relation("OwnerLeads", fields: [ownerId], references: [id])
  notes     String?
  createdAt DateTime    @default(now())
  callLogs  CallLog[]
  reminders Reminder[]
}

model CallLog {
  id           String        @id @default(uuid())
  leadId       String?
  lead         Lead?         @relation(fields: [leadId], references: [id])
  agentId      String
  agent        User          @relation(fields: [agentId], references: [id])
  direction    CallDirection // INBOUND | OUTBOUND
  fromNumber   String
  toNumber     String
  status       CallStatus    // ANSWERED | MISSED | BUSY | FAILED
  duration     Int           @default(0)  // seconds
  recordingUrl String?
  exotelCallSid String?      @unique
  startedAt    DateTime
  endedAt      DateTime?
}

model Reminder {
  id        String   @id @default(uuid())
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id])
  agentId   String
  agent     User     @relation(fields: [agentId], references: [id])
  dueAt     DateTime
  note      String?
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum Role           { ADMIN  AGENT }
enum LeadStatus     { NEW  CONTACTED  QUALIFIED  CONVERTED  LOST }
enum CallDirection  { INBOUND  OUTBOUND }
enum CallStatus     { ANSWERED  MISSED  BUSY  FAILED }
```

## Build phases

| Phase | Deliverables |
|---|---|
| **1. Foundation** *(this commit)* | Monorepo, server with auth (signup/login/JWT), web + mobile login screens, admin/agent roles |
| **2. Lead management** | CRUD leads, assign to agent, notes, list filters, lead detail page (web + mobile) |
| **3. Calling MVP** | Exotel signup, click-to-call API, inbound webhook, "incoming call" Socket.io + Expo Push |
| **4. Logs + recordings** | Auto-create CallLog from webhook, attach recording URL, per-lead history, recording player |
| **5. Reminders** | Create/list reminders, due notifications |
| **6. Reports + polish** | Daily call counts, agent stats, CSV import |

## Running locally (after Phase 1 commit)

```bash
# server
cd server
cp .env.example .env       # set DATABASE_URL for your SQL Server
npm install
npx prisma migrate dev
npm run dev

# web
cd web
npm install
npm run dev                # http://localhost:5173

# mobile
cd mobile
npm install
npx expo start             # scan QR with Expo Go on Android
```

## Cost estimate

| When | Cost |
|---|---|
| Building (laptop only) | **₹0** (Exotel free trial, ngrok free, Expo free, SQL Server local) |
| Going live | ~**₹1,000/mo** (VPS ₹500 + Exotel number ₹500) + ~₹1/min calling |

## Open items

- Exotel account creation (Phase 3)
- VPS purchase decision (deployment time)
- Number port vs forward (after MVP works)
