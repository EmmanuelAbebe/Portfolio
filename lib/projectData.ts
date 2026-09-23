import { Project } from "@/types";

// lib/projectData.ts
// Order: most complete first, then the live, most polished UI; recruiters often only read the first cards.

export const projects: Project[] = [
  {
    slug: "coachmechess",
    title: "CoachMeChess — AI Chess Coach",
    oneLiner:
      "Stockfish finds the mistake; an LLM explains why, using the player's own game history.",
    note: "In active development; the most complete of my projects. Built with Claude Code as an AI pair programmer.",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "PostgreSQL + Prisma",
      "Auth.js",
      "Stockfish (WASM, Web Worker)",
      "chess.js",
      "Vercel AI SDK",
      "Python (polars, LightGBM, FAISS)",
      "FastAPI",
    ],
    highlights: [
      "Runs Stockfish in a Web Worker; move quality (best → blunder) is computed deterministically from eval swings, never by the LLM.",
      "Streaming coach endpoint with tool calls that annotate squares and arrows on the board; users bring their own OpenAI / Anthropic / Gemini / Groq key.",
      "Offline Python pipeline over the Lichess open database builds style + skill profiles; a FastAPI service matches a user to similar, stronger players.",
      "Imports games from Lichess and Chess.com; Auth.js + Prisma accounts, profiles, and game history.",
    ],
    links: {
      demo: "https://chessapp-five.vercel.app/",
      repo: "https://github.com/EmmanuelAbebe/chessapp",
    },
    details: {
      problem:
        "Engines say a move was bad but not why, and they know nothing about the player's habits. General-purpose chatbots explain fluently but get chess facts wrong.",
      architecture:
        "The browser runs Stockfish and chess.js to produce evaluations and move classifications. /api/coach sends those facts, plus a summary of the player's stored profile, to the selected LLM and streams the explanation back. /api/player-profile fetches the user's games and calls a separate Python FastAPI service, backed by an offline pipeline (ingest → features → engine labels → models → player vectors), to build the profile stored in PostgreSQL.",
      decisions: [
        "The engine decides, the LLM only phrases: classification happens before the model is called, so it can't invent a wrong evaluation.",
        "Engine analysis runs client-side, so it costs no server compute and needs no network round trip per move.",
        "All user-supplied API keys pass through one server function and are never logged.",
        "Pipeline ingest streams compressed monthly dumps without storing them and checkpoints so it can resume; the expensive Stockfish labelling stage runs on a cloud spot VM.",
      ],
    },
  },

  {
    slug: "studio-reservation",
    title: "Studio Reservation App",
    oneLiner:
      "Hourly booking for a recording studio: pick a package and time slot, then pay.",
    note: "In progress: the front end is finished and live; payments and persistence are on a feature branch.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL + Prisma",
      "Stripe (Payment Intents + webhooks)",
      "Zod",
    ],
    highlights: [
      "My most polished UI: responsive, mobile-first booking flow with pricing packages, calendar strip, time-slot grid, and live booking summary.",
      "Reservation schema tracks a full payment lifecycle (REQUIRES_PAYMENT → PAID → CONFIRMED / REFUNDED / DISPUTED).",
      "Stripe webhook verifies signatures and updates reservation status from payment events.",
    ],
    links: {
      demo: "https://studio-reservation-seven.vercel.app/",
      repo: "https://github.com/EmmanuelAbebe/StudioReservation",
    },
    details: {
      problem:
        "A small studio took bookings by phone and text, which caused double-bookings and unpaid no-shows.",
      architecture:
        "The client builds a reservation draft (package, studio, slot). The server validates it with Zod, inserts a REQUIRES_PAYMENT reservation, and creates a Stripe PaymentIntent. The Stripe webhook then marks the reservation PAID or FAILED.",
      decisions: [
        "Reserve the slot before charging: a unique slotKey makes the second request for the same slot fail with 409 instead of double-charging.",
        "Snapshot customer contact info and package on the reservation instead of relying on the User row.",
        "Webhook, not client redirect, is the source of truth for payment status.",
      ],
    },
  },

  {
    slug: "salon-booking",
    title: "Salon Booking & Management System",
    oneLiner:
      "Customer booking plus a role-protected staff/admin dashboard for a hair salon.",
    note: "In progress: backend and admin dashboard built; not yet deployed.",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "PostgreSQL + Prisma",
      "Session auth + RBAC",
      "Tailwind CSS",
    ],
    highlights: [
      "Three-step booking flow (services → date & time → confirm) backed by a live availability API.",
      "Availability computed from each stylist's weekly hours, breaks, and existing appointments.",
      "Server-side overlap check rejects double-bookings; customer + appointment are created in one transaction.",
      "Admin dashboard for appointments, staff, clients, services, and revenue, gated by role (STAFF < ADMIN).",
    ],
    links: {
      repo: "https://github.com/EmmanuelAbebe/Hiarsalon",
    },
    details: {
      problem:
        "A salon was managing bookings, stylist schedules, and client records across separate manual tools, with no separation between staff and admin access.",
      architecture:
        "Next.js route handlers under /api/booking and /api/admin sit on a Prisma data layer over PostgreSQL. The schema models services, staff, weekly hours and breaks, customers, and appointments. Appointment line items snapshot service name, duration, and price so later price changes don't rewrite history. Middleware redirects unauthenticated dashboard requests; each admin handler re-checks the DB-backed session and role.",
      decisions: [
        "Chose DB-backed session tokens over JWTs so deactivating a user takes effect immediately.",
        "Checked roles in every handler, not just middleware, so a missed route can't leak admin data.",
        "Stored times as minutes-from-midnight per weekday for staff hours, which keeps availability math simple.",
        "Known limitation: the overlap check runs just before the insert transaction, not inside it; an exclusion constraint would close the remaining race.",
      ],
    },
  },
];
