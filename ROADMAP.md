# Wizzard MVP Roadmap

Status legend:
- [x] Completed
- [] Pending

Goal: Launch a reliable MVP that enables users to sign up, generate images (T2I/I2I) using multiple models, manage their gallery, and purchase credits via Stripe.

## 1) Platform & Architecture

- [x] Monorepo with `client/` and `server/` workspaces
- [x] TypeScript across client and server
- [x] Basic tooling (Vite, Tailwind, shadcn/ui, React Query, React Router)
- [x] Server foundation (Express, Helmet, CORS, rate limiting)
- [x] Supabase integration (Auth, DB, Storage clients)
- [] Enforce and document RLS policies and storage bucket policies (private `generated-images`, public `public-images`)
- [] Align environment variable names across code and docs (see Security & Config)

## 2) Authentication & Profiles

- [x] Client auth context and protected routing
  - `client/src/context/AuthContext.tsx`
  - `client/src/components/ProtectedRoute.tsx`
  - `client/src/App.tsx`
- [x] Server auth middleware and profile endpoints
  - `server/src/middleware/auth.ts`
  - `GET /api/auth/me`, `PATCH /api/auth/me` in `server/src/routes/auth.ts`
- [] Public profile endpoint: `GET /api/auth/profile/:id`
  - Add server route to return minimal public profile (id, email, full_name, avatar_url)
  - Update `API.md`
  - Wire to `client/src/lib/api.ts:getProfile`

## 3) Credits System

- [x] Credit check/deduct/refund flows (service-layer)
  - `server/src/services/credit-service.ts`
  - Integrated in `POST /api/generate`, cancel, and webhook completion
- [x] Credits endpoint
  - `GET /api/credits` (`server/src/routes/credits.ts`)
- [] Stripe-powered credit purchases (see section 7)
  - Create Stripe Checkout integration and webhook to increment credits

## 4) Image Generation (Fal.ai)

- [x] Core generation endpoints
  - `POST /api/generate` (sync/async), `GET /api/generate/:id`, `DELETE /api/generate/:id`
  - `server/src/routes/generate.ts`
- [x] Zod validation of inputs
  - `server/src/types/validation.ts`
- [x] Fal service integration
  - `server/src/services/fal-service.ts` (queue submit/status/result/subscribe)
  - Nano Banana aspect ratio handling in `server/src/utils/aspect-ratio.ts`
- [x] Webhook processing (async mode)
  - `POST /api/webhooks/fal/:generationId` (`server/src/routes/webhook.ts`)
- [x] I2I upload to Fal storage
  - `POST /api/upload` (`server/src/routes/upload.ts`)
  - Client integration in `PromptBar.tsx`

## 5) Storage & Gallery

- [x] Storage service
  - Original + WebP upload, signed URLs, delete
  - `server/src/services/storage-service.ts`, `server/src/services/image-optimizer.ts`
- [x] Gallery endpoints
  - `GET /api/gallery` (with pagination params in request), `GET /api/gallery/:id`, `PATCH /api/gallery/:id`, `DELETE /api/gallery/:id`, `GET /api/gallery/favorites/list`
  - `server/src/routes/gallery.ts`
- [] Enforce pagination range
  - Re-enable `.range(offset, offset + limit - 1)` in gallery list
- [] Public image publishing
  - On `PATCH /api/gallery/:id` toggle `is_public`, copy/remove asset to/from `public-images` bucket
  - Add utility to `StorageService` for cross-bucket copy/delete
  - Ensure Explore surfaces only published items

## 6) Frontend UI/UX

- [x] Landing page with sections (Hero, Features, Pricing, FAQ, CTA)
- [x] Generate page (PromptBar, Model selector, I2I upload UX)
- [x] Assets/My Gallery page
- [x] Explore page backed by `/api/public-images`
  - `client/src/pages/Explore.tsx`
- [] Make Explore public (optional but recommended)
  - Remove `ProtectedRoute` wrapper for `/explore` in `client/src/App.tsx`
- [] Unify model metadata usage across components
- [] Improve loading/error states consistently (Account/Assets/Explore)
- [] Add Billing section under Account Settings
  - “Billing” tab/page to:
    - Show current credits
    - List credit packs (client-configured)
    - “Buy credits” buttons (start Checkout Session)
    - “Manage billing” via Stripe Customer Portal
    - Show purchase history (if implemented on server)

## 7) Stripe Billing & Checkout (Credits Purchase)

Backend
- [] Add Stripe dependencies and env config
  - Env:
    - `STRIPE_SECRET_KEY`
    - `STRIPE_WEBHOOK_SECRET`
    - `STRIPE_PRICE_SMALL_PACK`, `STRIPE_PRICE_MEDIUM_PACK`, `STRIPE_PRICE_LARGE_PACK` (or a generic mapping)
  - Update `ENVIRONMENT.md` for dev/prod examples
- [] Endpoints
  - `POST /api/billing/create-checkout-session`
    - Body: `{ packId: 'small' | 'medium' | 'large' }`
    - Creates a Checkout Session with the correct price ID, associates Supabase userId in `metadata`
    - Returns `url` to redirect
  - `GET /api/billing/portal`
    - Creates a Customer Portal session (with Stripe customer created/linked by email or stored mapping in DB)
    - Returns `url` to redirect for managing payment methods/invoices
- [] Webhook: `POST /api/webhooks/stripe`
  - Verify signature with `STRIPE_WEBHOOK_SECRET`
  - On `checkout.session.completed` (or `payment_intent.succeeded` via session linkage), lookup `user_id` from `metadata`, determine the purchased pack, and increment `user_credits.credits_remaining`
  - Idempotency handling to avoid double-crediting
  - Optional: record transaction in a new table `credit_transactions` for audit (user_id, credits_added, stripe_event_id, created_at)
  - Return 200 on success; log errors but avoid leaking sensitive info
- [] Types & DB updates (optional but recommended)
  - Add `credit_transactions` table in Supabase and update `server/src/supabase/database.types.ts`
  - Server-side mapping pack => credits (e.g., small=50, medium=250, large=1000) in a single constants file

Frontend (Billing UI)
- [] Account Settings → Billing section (new tab or route)
  - Show current credits (from `GET /api/credits`)
  - Show credit packs with pricing (client-configured list that maps to server pack IDs)
  - “Buy credits” button → calls `POST /api/billing/create-checkout-session`, then `window.location.href = url`
  - “Manage billing” button → calls `GET /api/billing/portal` then redirect to portal
  - Optional: show recent purchases if we implement a `GET /api/billing/history` backed by `credit_transactions`
- [] Update Landing’s Pricing CTA and header pricing dialog to point to the same Billing flow

Docs
- [] Update `API.md` with billing endpoints and webhook payloads
- [] Update `DEVELOPMENT.md` and `ENVIRONMENT.md` with Stripe env vars, local webhook testing instructions (Stripe CLI)
- [] Add “Billing setup” section (how to configure prices and map to packs)

## 8) API Consistency & Middleware

- [x] Global rate limiting and generation rate limiting
  - `server/src/middleware/rate-limit.ts`
- [] Apply `authLimiter` to `/api/auth` routes
- [] Standardize response envelope
  - Ensure all endpoints use `{ success: boolean, data?: any, error?: string }`
  - Fix `success: "no"` to boolean in `server/src/routes/generate.ts`
  - Either wrap payload in `data` or update `API.md` to reflect domain keys consistently
- [] Enrich logs with context (generation ID, user ID, model) at critical paths

## 9) Security & Config

- [] Remove hardcoded Supabase anon key fallback from:
  - `client/src/integrations/supabase/client.ts` (require `VITE_SUPABASE_ANON_KEY`)
- [] Align environment variable names
  - Client currently uses `VITE_API_URL` in `client/src/config.ts`
  - Standardize to `VITE_API_URL` and `VITE_SUPABASE_ANON_KEY` everywhere
- [] Validate and document RLS policies across tables (profiles, generations, images, user_credits, credit_transactions)
- [] Confirm storage bucket policies:
  - `generated-images` private (signed URLs)
  - `public-images` public (list/read for Explore)
- [] CORS: ensure `FRONTEND_URL` covers dev/prod origins

## 10) Testing & QA

- [] Smoke test runbook:
  - Signup, login, profile update
  - Generate T2I and I2I (sync and async)
  - Credits: read, deduct on success, refund on cancel
  - Gallery: paginate, favorite, toggle public (appears in Explore), delete
  - Billing: buy a credit pack via Stripe Checkout; credits increment via webhook
- [] Minimal unit tests:
  - `utils/aspect-ratio`, `services/image-optimizer`, webhook handlers (mocked)
- [] Error handling regression checks (rate limit, validation, insufficient credits)

## 11) Timeline (estimate ~1–2 weeks to MVP)

- Days 1–3: API/storage correctness
  - [ ] Public profile route
  - [ ] Gallery pagination fix
  - [ ] Public publish/unpublish flow for `public-images`
  - [ ] API response envelope standardization
- Days 3–5: Billing
  - [ ] Stripe backend endpoints + webhook
  - [ ] Billing UI in Account settings
  - [ ] Docs & env updates
- Days 5–7: Security & polish
  - [ ] Env var alignment, remove hardcoded keys
  - [ ] Apply `authLimiter`, logging improvements
  - [ ] RLS and bucket policy verification
- Days 7–10: QA & Docs
  - [ ] Smoke tests
  - [ ] Unit tests (minimal)
  - [ ] Final pass on `API.md`, `DEVELOPMENT.md`, `ENVIRONMENT.md`

## 12) Post-MVP (backlog)

- [] Admin dashboard (user management, credit adjustments)
- [] Advanced analytics (generation success/failure rates, model popularity)
- [] Content moderation (NSFW detection pipelines)
- [] Subscriptions (recurring credits) and richer Customer Portal config
- [] Real-time generation status via websockets/Server-Sent Events
