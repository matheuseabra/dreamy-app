# AGENTS.md - AI Assistant Guide for Wizzard

This document provides comprehensive guidance for AI coding assistants working on the Wizzard AI image generation platform.

## Project Identity

**Name**: Wizzard (also referenced as "Dreamy Studio" in some files)
**Type**: Full-stack AI image generation SaaS platform
**Architecture**: Monorepo with separate client and server workspaces

## Quick Context

Wizzard allows users to generate AI images using multiple models (Flux, Recraft, Ideogram, etc.) via Fal.ai. Users sign up, receive credits, generate images (text-to-image and image-to-image), manage their gallery, and purchase additional credits via Stripe.

## Tech Stack Overview

### Frontend (`client/`)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Query (server state) + Context API (auth)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation

### Backend (`server/`)
- **Runtime**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with JWT tokens
- **Storage**: Supabase Storage (buckets: `generated-images`, `public-images`)
- **AI Provider**: Fal.ai for image generation
- **Payments**: Stripe (to be implemented)
- **Image Processing**: Sharp for WebP optimization

### Key Dependencies
```json
// Server
"@fal-ai/client": "^1.6.2"
"@supabase/supabase-js": "^2.58.0"
"express-rate-limit": "^8.1.0"
"sharp": "^0.34.4"
"zod": "^4.1.11"

// Client
"@tanstack/react-query": "^5.90.2"
"@supabase/supabase-js": "^2.58.0"
"react-router-dom": "^6.30.1"
"lucide-react": "^0.462.0"
```

## Architecture Patterns

### Monorepo Structure
```
wizzard/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── context/     # React Context providers
│   │   ├── lib/         # Utilities and API client
│   │   └── integrations/# Supabase client setup
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic layer
│   │   ├── middleware/  # Express middleware
│   │   ├── types/       # TypeScript types
│   │   └── supabase/    # Supabase admin client
│   └── package.json
└── package.json         # Root workspace config
```

### API Response Format
**CRITICAL**: All API responses MUST follow this structure:
```typescript
{
  success: boolean,
  data?: any,           // Or domain-specific keys
  error?: string,
  details?: string
}
```

**Known Issue**: `server/src/routes/generate.ts` returns `success: "no"` - this should be `success: false`.

### Database Schema (Key Tables)

#### profiles
```typescript
{
  id: string (UUID, references auth.users)
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: timestamp
  updated_at: timestamp
}
```

#### user_credits
```typescript
{
  id: string (UUID)
  user_id: string (references profiles.id)
  credits_remaining: number
  credits_total: number
  last_refill_date: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

#### generations
```typescript
{
  id: string (UUID)
  user_id: string
  model: string
  prompt: string
  status: string (pending|in_queue|processing|completed|failed)
  fal_request_id: string | null
  credits_used: number
  // ... many more fields (see database.types.ts)
}
```

#### images
```typescript
{
  id: string (UUID)
  generation_id: string
  user_id: string
  storage_path: string (original image)
  webp_path: string | null (optimized version)
  url: string | null (fal URL)
  is_favorited: boolean
  is_public: boolean
  // ... dimensions, metadata, etc.
}
```

## Coding Conventions

### Naming
- **Files**: camelCase (e.g., `creditService.ts`, `authContext.tsx`)
- **Components**: PascalCase (e.g., `PromptBar.tsx`, `ModelSelector.tsx`)
- **Functions/Variables**: camelCase
- **CSS Classes**: kebab-case (Tailwind utilities)
- **API Routes**: kebab-case with `/api/` prefix (e.g., `/api/auth/me`, `/api/generate`)
- **Environment Variables**: UPPER_SNAKE_CASE

### TypeScript Rules
- **Strict Mode**: Enabled - no implicit `any`
- **Interfaces**: Use for component props and data shapes
- **Types**: Import from `database.types.ts` (server) or `types.ts` (client)
- **Validation**: Use Zod schemas for all API input validation

### File Organization
```typescript
// ✅ Good: Proper imports and structure
import { Router } from 'express';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { someSchema } from '../types/validation';
import { SomeService } from '../services/some-service';

const router = Router();
const service = new SomeService();

router.post('/',
  authenticateUser,
  validateBody(someSchema),
  async (req: AuthRequest, res) => {
    try {
      // Business logic
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
```

## Common Tasks

### Adding a New API Endpoint

1. **Create/Update Route File** (`server/src/routes/`)
   ```typescript
   router.post('/new-endpoint',
     authenticateUser,        // Auth middleware
     rateLimiter,            // Optional rate limiting
     validateBody(schema),    // Zod validation
     async (req: AuthRequest, res) => {
       try {
         const userId = req.user!.id;
         // Business logic
         res.json({ success: true, data: result });
       } catch (error: any) {
         res.status(500).json({ success: false, error: error.message });
       }
     }
   );
   ```

2. **Add Validation Schema** (`server/src/types/validation.ts`)
   ```typescript
   export const newEndpointSchema = z.object({
     field: z.string().min(1),
     // ... more fields
   });

   export type NewEndpointInput = z.infer<typeof newEndpointSchema>;
   ```

3. **Update API.md** with endpoint documentation

4. **Add Client API Method** (`client/src/lib/api.ts`)
   ```typescript
   export const newEndpoint = async (data: NewEndpointInput) => {
     const response = await fetch(`${API_URL}/api/new-endpoint`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     });
     return response.json();
   };
   ```

### Adding a New AI Model

1. **Update AI_MODELS constant** (wherever it's defined - check codebase)
   ```typescript
   {
     id: 'fal-ai/new-model',
     name: 'New Model',
     description: 'Model description',
     icon: '🎨',
     type: 'text-to-image' | 'image-to-image',
   }
   ```

2. **Add model-specific validation** if needed in `generateImageSchema`

3. **Update FalService** (`server/src/services/fal-service.ts`) if model needs special parameter handling

4. **Test generation** with the new model

5. **Update documentation** (API.md, user-facing docs)

### Adding a New React Component

1. **Create component file** with proper TypeScript
   ```typescript
   interface ComponentNameProps {
     prop1: string;
     prop2?: number;
   }

   export const ComponentName: React.FC<ComponentNameProps> = ({
     prop1,
     prop2 = 0
   }) => {
     return (
       <div className="container">
         {/* JSX */}
       </div>
     );
   };
   ```

2. **Use shadcn/ui components** when possible (Button, Card, Dialog, etc.)

3. **Add to appropriate directory**:
   - `components/ui/` for reusable UI components
   - `components/landing/` for landing page sections
   - `components/` for feature-specific components

4. **Import and use** in pages or parent components

### Working with Supabase Storage

**Server-Side** (signed URLs):
```typescript
const { data, error } = await supabaseAdmin.storage
  .from('generated-images')
  .createSignedUrl(path, expiresIn);
```

**Client-Side** (public buckets only):
```typescript
const { data } = supabase.storage
  .from('public-images')
  .getPublicUrl(path);
```

**Image Upload Pattern**:
1. Download from Fal URL
2. Optimize to WebP using Sharp
3. Upload both original and WebP to storage
4. Store both paths in database
5. Serve WebP for display, original for download

## Critical Rules

### ❌ Don't Do This

1. **Never hardcode API keys** in client code
2. **Never expose Supabase service role key** to client
3. **Never use `success: "no"`** - use `success: false`
4. **Never skip authentication** on protected routes
5. **Never skip input validation** with Zod
6. **Never commit `.env` files**
7. **Never use `any` type** without a good reason
8. **Never skip error handling** in async functions
9. **Never use localStorage/sessionStorage** in artifacts (Claude specific)

### ✅ Always Do This

1. **Always validate inputs** with Zod schemas
2. **Always use TypeScript** with proper types
3. **Always handle errors** with try-catch
4. **Always return consistent response formats**
5. **Always use environment variables** for config
6. **Always authenticate protected routes**
7. **Always check credits** before generation
8. **Always use signed URLs** for private storage
9. **Always log errors** with context
10. **Always update documentation** when changing APIs

## Environment Variables

### Server Required
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # NEVER expose to client

# Fal.ai
FAL_API_KEY=xxx

# Server
PORT=9000
NODE_ENV=development|production
FRONTEND_URL=http://localhost:5173
WEBHOOK_BASE_URL=https://api.example.com  # For Fal webhooks

# Stripe (to be added)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Client Required
```bash
# Supabase (client-safe)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # Client-safe anon key

# API
VITE_API_URL=http://localhost:9000
```

## Key Files Reference

### Server
- `server/src/server.ts` - Express app setup
- `server/src/routes/` - All API endpoints
- `server/src/services/` - Business logic (CreditService, FalService, StorageService, etc.)
- `server/src/middleware/auth.ts` - JWT authentication
- `server/src/middleware/validate.ts` - Zod validation middleware
- `server/src/middleware/rate-limit.ts` - Rate limiting config
- `server/src/types/validation.ts` - Zod schemas
- `server/src/supabase/database.types.ts` - Generated DB types

### Client
- `client/src/App.tsx` - Router setup
- `client/src/context/AuthContext.tsx` - Auth state management
- `client/src/lib/api.ts` - API client functions
- `client/src/integrations/supabase/client.ts` - Supabase client setup
- `client/src/pages/` - Route components
- `client/src/components/` - Reusable components

## Current State & TODOs

### ✅ Completed
- User authentication and profiles
- Image generation (sync/async, T2I/I2I)
- Credits system (check/deduct/refund)
- Gallery management with favorites
- Image storage with WebP optimization
- Rate limiting
- Webhook handling for async generation

### 🚧 In Progress (from ROADMAP.md)
- **Public profile endpoint** (`GET /api/auth/profile/:id`)
- **Gallery pagination** (currently commented out `.range()`)
- **Public image publishing** (copy to `public-images` bucket)
- **Stripe billing integration** (checkout, webhooks, portal)
- **Billing UI** in Account settings
- **API response standardization** (fix `success: "no"`)
- **RLS policy verification**
- **Environment variable alignment**

### Critical Gaps
1. **Missing Stripe Integration** - No payment processing yet
2. **Pagination Not Enforced** - Gallery list doesn't limit results
3. **Public Publishing Flow** - Can't move images to public bucket
4. **Response Format Inconsistent** - Some endpoints don't follow standard
5. **Auth Rate Limiting** - Not applied to `/api/auth` routes

## Development Workflow

### Starting Development
```bash
# Install dependencies
npm install

# Start dev servers (from root)
npm run dev  # Runs both client and server concurrently

# Or separately
cd client && npm run dev   # Frontend on :5173
cd server && npm run dev   # Backend on :9000
```

### Making Changes

1. **Backend changes**: Edit files in `server/src/`, server auto-reloads
2. **Frontend changes**: Edit files in `client/src/`, Vite HMR applies changes
3. **Database changes**: Update in Supabase dashboard, regenerate types
4. **API changes**: Update endpoint → update client API function → update docs

### Testing Checklist
- [ ] Does it require authentication? Add `authenticateUser` middleware
- [ ] Does it accept input? Add Zod validation
- [ ] Does it modify credits? Check before, deduct after
- [ ] Does it handle errors? Wrap in try-catch
- [ ] Does it return consistent format? `{ success, data, error }`
- [ ] Does it need rate limiting? Apply appropriate limiter
- [ ] Did you update API.md? Document new endpoints
- [ ] Did you test both success and error cases?

## Debugging Tips

### Common Issues

**"Invalid or expired token"**
- Check `Authorization: Bearer <token>` header
- Verify token is from Supabase Auth (`supabase.auth.getSession()`)
- Check token hasn't expired

**"Insufficient credits"**
- Verify user has credits: `GET /api/credits`
- Check credit deduction logic in generation flow
- Ensure credits refunded on generation failure

**"Generation not found"**
- Check generation ID is correct UUID
- Verify generation belongs to user (RLS might filter)
- Check generation status in database

**Fal webhook not firing**
- Verify `WEBHOOK_BASE_URL` is publicly accessible
- Check webhook URL format: `${WEBHOOK_BASE_URL}/api/webhooks/fal/${generationId}`
- Test with Fal dashboard webhook logs

**Images not displaying**
- Check signed URL expiration (default 3600s = 1 hour)
- Verify storage path is correct
- Check RLS policies on `generated-images` bucket
- Ensure WebP path exists or fallback to original

### Useful Queries

```sql
-- Check user credits
SELECT * FROM user_credits WHERE user_id = 'xxx';

-- Check recent generations
SELECT * FROM generations
WHERE user_id = 'xxx'
ORDER BY created_at DESC
LIMIT 10;

-- Check failed generations
SELECT id, error_message, created_at
FROM generations
WHERE status = 'failed'
ORDER BY created_at DESC;

-- Check images without WebP
SELECT id, storage_path, webp_path
FROM images
WHERE webp_path IS NULL;
```

## Security Checklist

When adding new features:
- [ ] Input validation with Zod
- [ ] Authentication on protected routes
- [ ] Authorization (user owns resource)
- [ ] Rate limiting on expensive operations
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (React auto-escapes, but be careful with dangerouslySetInnerHTML)
- [ ] CSRF protection (not needed for API-only backend with JWT)
- [ ] Secrets in environment variables only
- [ ] RLS policies enforced in Supabase
- [ ] Storage bucket policies correct (private vs public)

## AI Model Integration Guide

### Supported Models (as of now)
- Flux (dev, schnell, pro variants)
- Recraft V3 (T2I, I2I)
- Ideogram V2, V3
- Nano Banana (special aspect ratio handling)
- WAN V2.2

### Parameter Mapping
Some models use different parameter names:
- **Standard**: `image_size` (e.g., "square_hd")
- **Nano Banana**: `aspect_ratio` (e.g., "1:1")
  - Conversion in `server/src/utils/aspect-ratio.ts` via `SIZE_TO_NANO_RATIO`

### Adding Model Support
1. Identify model ID from Fal.ai documentation
2. Add to AI_MODELS array with metadata
3. Check if parameters need mapping (like Nano Banana)
4. Add special handling in `FalService.buildGenerationInput()` if needed
5. Test with various parameter combinations
6. Document in API.md

## Stripe Integration (Pending)

When implementing Stripe billing:

### Backend Tasks
1. **Install Stripe SDK**: `npm install stripe --workspace=server`
2. **Add environment variables**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs
3. **Create billing routes**: `/api/billing/create-checkout-session`, `/api/billing/portal`
4. **Create webhook handler**: `/api/webhooks/stripe` (verify signature, handle events)
5. **Credit increment logic**: On successful payment, update `user_credits`
6. **Transaction logging**: Optional table for audit trail

### Frontend Tasks
1. **Billing UI**: New tab in Account Settings
2. **Credit packs display**: Show packages with pricing
3. **Checkout flow**: Call API → redirect to Stripe
4. **Portal link**: "Manage billing" button → Customer Portal
5. **Purchase history**: Optional, if implemented on backend

### Testing
- Use Stripe test mode keys
- Test webhook locally with Stripe CLI: `stripe listen --forward-to localhost:9000/api/webhooks/stripe`
- Test checkout flow with test card: 4242 4242 4242 4242

## Final Notes

### Code Quality Standards
- **Readability**: Code should be self-documenting with clear variable names
- **Modularity**: Break complex logic into small, focused functions
- **Error Messages**: User-friendly for client, detailed for logs
- **Documentation**: Update docs when changing behavior
- **Testing**: Test both happy path and error cases

### When in Doubt
1. Check existing patterns in similar files
2. Refer to PRD.md for business logic
3. Check API.md for endpoint contracts
4. Review ROADMAP.md for planned changes
5. Look at database.types.ts for data structures

### Getting Help
- Review existing code for patterns
- Test in development before production
- Log generously for debugging

---

**Remember**: This is a user-facing SaaS product. Prioritize user experience, security, and reliability over clever code. Keep it simple, keep it safe, keep it documented.
