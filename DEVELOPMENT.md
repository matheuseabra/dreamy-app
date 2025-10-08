# Dreamy Studio - Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Fal.ai API key

### Environment Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd dreamy-studio
npm run install:all
```

2. **Environment Variables:**
Create `.env` files in both `client/` and `server/` directories:

**client/.env:**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:9000
```

**server/.env:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
FAL_API_KEY=your_fal_api_key
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_KEY=your_replicate_api_key
FRONTEND_URL=http://localhost:5173
WEBHOOK_BASE_URL=http://localhost:9000
PORT=9000
NODE_ENV=development
```

3. **Start development servers:**
```bash
npm run dev
```

## Project Structure

```
dreamy-studio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── landing/   # Landing page components
│   │   │   └── ...        # Other components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utility functions
│   │   ├── integrations/  # External service integrations
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic services
│   │   ├── supabase/      # Database types and client
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── package.json
├── .cursorrules           # Cursor AI rules
├── DEVELOPMENT.md         # This file
└── package.json          # Root package.json
```

## Database Schema

### Core Tables

**users (Supabase Auth)**
- Handled by Supabase Auth
- Additional profile data in `profiles` table

**profiles**
```sql
id: uuid (primary key, references auth.users)
email: text
full_name: text
avatar_url: text
created_at: timestamp
updated_at: timestamp
```

**generations**
```sql
id: uuid (primary key)
user_id: uuid (references profiles.id)
model: text
prompt: text
negative_prompt: text
image_size: text
num_images: integer
seed: integer
guidance_scale: number
num_inference_steps: integer
model_options: jsonb
status: text (pending, in_queue, processing, completed, failed)
fal_request_id: text
credits_used: integer
queue_position: integer
error_message: text
started_at: timestamp
completed_at: timestamp
duration_ms: integer
created_at: timestamp
updated_at: timestamp
```

**images**
```sql
id: uuid (primary key)
generation_id: uuid (references generations.id)
user_id: uuid (references profiles.id)
storage_path: text
url: text
width: integer
height: integer
content_type: text
format: text
file_size_bytes: integer
is_favorited: boolean
is_public: boolean
fal_metadata: jsonb
storage_bucket: text
created_at: timestamp
updated_at: timestamp
```

**user_credits**
```sql
id: uuid (primary key)
user_id: uuid (references profiles.id)
credits_remaining: integer
credits_total: integer
last_refill_date: timestamp
created_at: timestamp
updated_at: timestamp
```

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/me` - Update user profile

### Image Generation
- `POST /api/generate` - Generate images
- `GET /api/generate/:id` - Get generation status
- `DELETE /api/generate/:id` - Cancel generation

### Gallery
- `GET /api/gallery` - Get user images (paginated)
- `GET /api/gallery/:id` - Get specific image
- `PATCH /api/gallery/:id` - Update image (favorite, public)
- `DELETE /api/gallery/:id` - Delete image
- `GET /api/gallery/favorites/list` - Get favorited images

### Credits
- `GET /api/credits` - Get user credit balance

### Webhooks
- `POST /api/webhooks/fal/:generationId` - Fal.ai webhook handler

## AI Models Integration

### Supported Models
- **Flux Dev** (`fal-ai/flux/dev`) - High quality text-to-image
- **Flux Schnell** (`fal-ai/flux/schnell`) - Fast text-to-image
- **Flux Pro Kontext** (`fal-ai/flux-pro/kontext`) - Professional context-aware
- **Recraft V3** (`fal-ai/recraft/v3/text-to-image`) - Advanced text-to-image
- **Ideogram V3** (`fal-ai/ideogram/v3`) - Text rendering capabilities
- **Nano Banana** (`fal-ai/nano-banana`) - Lightweight fast generation
- **WAN V2.2** (`fal-ai/wan/v2.2-5b/text-to-image`) - 5B parameter model

### Adding New Models

1. **Update Model Constants:**
```typescript
// In client/src/components/ModelSelector.tsx and PromptBar.tsx
const AI_MODELS = [
  // ... existing models
  {
    id: "new-model-id",
    name: "New Model Name",
    description: "Model description",
    icon: ModelIcon,
  },
];
```

2. **Update Validation Schema:**
```typescript
// In server/src/types/validation.ts
export const generateImageSchema = z.object({
  // ... existing fields
  // Add model-specific parameters if needed
});
```

3. **Test Integration:**
- Test with various prompts
- Verify parameter handling
- Check error scenarios

## Development Workflow

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
# Make changes
git add .
git commit -m "feat: add feature description"
git push origin feature/feature-name
# Create pull request
```

### Testing
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Common Tasks

### Adding a New Page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Add navigation link if needed
4. Implement proper TypeScript types

### Adding a New API Endpoint
1. Create route handler in `server/src/routes/`
2. Add middleware (auth, validation, rate limiting)
3. Implement business logic
4. Add proper error handling
5. Update API documentation

### Adding a New UI Component
1. Create component in appropriate directory
2. Use shadcn/ui components when possible
3. Implement proper TypeScript interfaces
4. Add proper accessibility attributes
5. Test responsive design

### Database Changes
1. Create migration in Supabase
2. Update TypeScript types
3. Update API endpoints if needed
4. Test with existing data

## Troubleshooting

### Common Issues

**Build Errors:**
- Check TypeScript errors
- Verify all imports are correct
- Ensure environment variables are set

**API Errors:**
- Check server logs
- Verify authentication tokens
- Check rate limiting

**Database Errors:**
- Verify Supabase connection
- Check RLS policies
- Verify data types

**AI Generation Errors:**
- Check API keys
- Verify model availability
- Check credit balance
- Review error logs

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev:server

# Check specific service
DEBUG=fal-service npm run dev:server
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement proper image lazy loading
- Optimize bundle size
- Use proper caching strategies

### Backend
- Implement database indexing
- Use connection pooling
- Add proper caching
- Monitor slow queries

### Images
- Use appropriate formats (WebP, PNG, JPEG)
- Implement proper compression
- Use CDN for delivery
- Optimize loading strategies

## Security Checklist

- [ ] Environment variables properly configured
- [ ] API keys not exposed in client code
- [ ] Proper authentication on all protected routes
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] RLS policies in place
- [ ] Error messages don't leak sensitive info

## Deployment

### Environment Setup
1. Set up production environment variables
2. Configure Supabase production instance
3. Set up proper domain and SSL
4. Configure CDN for static assets

### Build Process
```bash
# Build both client and server
npm run build

# Start production server
npm start
```

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor API performance
- Track user generation patterns
- Monitor credit usage

## Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Add proper documentation
4. Test your changes thoroughly
5. Update this guide if needed

## Support

For questions or issues:
1. Check this documentation
2. Review the codebase
3. Check existing issues
4. Create a new issue with proper details
