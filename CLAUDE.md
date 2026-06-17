# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (flat config, next/core-web-vitals)
```

There is no test suite configured.

## Architecture

**CoreAcademy Payment Gateway** — a Next.js 15 App Router application that handles enrollment and payment for an online academy. Users complete a multi-step form, pay via Stripe (USD) or Paystack (NGN), and upon success receive Discord role assignment and an email with an S3-signed roadmap PDF.

### Request lifecycle

1. `/api/submit` — validates form, checks Discord membership via `BOT_URL`, creates `User` + `Payment` (status: `pending`) in MongoDB
2. `/api/stripe` or `/api/paystack` — initializes payment session with the respective provider, returns authorization URL
3. User completes payment externally, redirects to `/api/payment-success`
4. `/api/payment-success` — verifies transaction with provider, marks `Payment` as `completed`, assigns Discord role via bot, sends email via Nodemailer with S3 presigned URL for roadmap PDF

### Key directories

- [app/](coreAcademy-payment-gateway/app/) — Next.js App Router pages and API routes
- [Components/](coreAcademy-payment-gateway/Components/) — React client components (`"use client"`)
- [Config/DataBase.js](coreAcademy-payment-gateway/Config/DataBase.js) — MongoDB connection with global caching (required for Next.js serverless)
- [Models/](coreAcademy-payment-gateway/Models/) — Mongoose schemas: `User` (name, email, role, discordId, flags) and `Payment` (userId, amount, currency, status)
- [Lib/nodemailer.js](coreAcademy-payment-gateway/Lib/nodemailer.js) — Gmail transporter using app password

### Path alias

`@/*` resolves to the project root (defined in `jsconfig.json`).

### Environment variables

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PAYSTACK_SECRET_KEY` | Paystack secret |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `BOT_URL` | Discord bot endpoint (member check + role assignment) |
| `EMAIL_USER` | Gmail address |
| `EMAIL_PASS` | Gmail app password |
| `AWS_REGION` | S3 region |
| `AWS_ACCESS_KEY_ID` | S3 credentials |
| `AWS_SECRET_ACCESS_KEY` | S3 credentials |
| `NEXT_PUBLIC_URL` | Public base URL (used in payment callback URLs) |

### UI stack

Tailwind CSS 4 (via `@tailwindcss/postcss`), Framer Motion (step animations), FontAwesome + Lucide React (icons), React Toastify (notifications). The main enrollment flow lives in [Components/HomeClient.js](coreAcademy-payment-gateway/Components/HomeClient.js) as a multi-step client component.
