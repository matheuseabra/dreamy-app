# Wizzard - AI Image Generation Platform

## Project Overview
Wizzard is a full-stack AI image generation platform that allows users to create high-quality images using multiple AI models including Flux, Recraft, Ideogram, and others. The platform features user authentication, credit-based generation, image gallery management, and a modern landing page.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, React Router
- **Backend**: Node.js, Express, TypeScript, Supabase (Auth + Database + Storage)
- **AI Services**: Fal.ai (primary)
- **Architecture**: Monorepo with npm workspaces (client/server separation)

## Code Organization Rules

### File Structure
- Follow the established monorepo structure with clear client/server separation
- Use TypeScript for all new files with strict type checking
- Place shared types in appropriate locations (client/src/integrations/supabase/types.ts, server/src/supabase/database.types.ts)
- Keep UI components in client/src/components/ with proper categorization (landing/, ui/)

### Naming Conventions
- Use PascalCase for React components and TypeScript interfaces
- Use camelCase for functions, variables, and file names
- Use kebab-case for CSS classes and API endpoints
- Prefix API routes with /api/ and group by feature (auth, generate, gallery, credits, webhooks)

### Component Architecture
- Create reusable UI components in client/src/components/ui/
- Separate business logic from presentation components
- Use proper TypeScript interfaces for all component props
- Implement proper error boundaries and loading states

## AI Integration Rules

### Model Management
- All AI models must be defined in centralized constants (AI_MODELS array)
- Include proper model metadata: id, name, description, icon
- Support both text-to-image and image-to-image generation
- Handle model-specific parameters through the validation schema

### Generation Flow
- Always validate input using Zod schemas before processing
- Implement proper credit checking before generation
- Support both synchronous and asynchronous generation modes
- Handle webhook callbacks for async operations
- Store generation metadata and results in Supabase

### Error Handling
- Implement comprehensive error handling for AI service failures
- Provide user-friendly error messages
- Log errors with proper context for debugging
- Handle rate limiting and quota exceeded scenarios

## Database & API Rules

### Supabase Integration
- Use proper TypeScript types from database.types.ts
- Implement Row Level Security (RLS) policies for data protection
- Use service role key for server-side operations
- Use anon key for client-side operations with proper authentication

### API Design
- Follow RESTful conventions with proper HTTP status codes
- Implement proper authentication middleware for protected routes
- Use rate limiting for API endpoints
- Validate all inputs using Zod schemas
- Return consistent response formats: { success: boolean, data?: any, error?: string }

### Data Models
- Maintain proper relationships between users, generations, and images
- Store image metadata including dimensions, format, and generation parameters
- Implement proper indexing for performance
- Use UUIDs for all primary keys

## Frontend Development Rules

### State Management
- Use React Query for server state management
- Use React Context for global application state (AuthContext)
- Implement proper loading and error states
- Use optimistic updates where appropriate

### UI/UX Guidelines
- Follow the established dark theme design system
- Use shadcn/ui components consistently
- Implement proper responsive design
- Use proper accessibility attributes
- Maintain consistent spacing and typography

### Performance
- Implement proper image lazy loading
- Use React.memo for expensive components
- Optimize bundle size with proper imports
- Implement proper caching strategies

## Security Rules

### Authentication
- Use Supabase Auth for user management
- Implement proper JWT token validation
- Protect all API routes with authentication middleware
- Handle token refresh properly

### Data Protection
- Never expose sensitive API keys in client code
- Use environment variables for all configuration
- Implement proper CORS policies
- Validate all user inputs on both client and server

### Image Storage
- Use Supabase Storage with proper bucket policies
- Generate signed URLs for image access
- Implement proper cleanup for deleted images
- Store images with proper metadata

## Development Workflow

### Code Quality
- Use ESLint and Prettier for code formatting
- Write TypeScript with strict mode enabled
- Implement proper error handling in all functions
- Use meaningful variable and function names

### Testing
- Write unit tests for utility functions
- Test API endpoints with proper test data
- Implement integration tests for critical flows
- Test error scenarios and edge cases

### Documentation
- Document all API endpoints with proper examples
- Include JSDoc comments for complex functions
- Maintain README files for setup instructions
- Document environment variables and configuration

## Business Logic Rules

### Credit System
- Implement proper credit checking before generation
- Handle credit deduction after successful generation
- Implement credit refund for failed generations
- Track credit usage and provide user feedback

### Image Management
- Support image favoriting and public/private settings
- Implement proper image deletion with storage cleanup
- Provide image metadata and generation history
- Support image download and sharing

### User Experience
- Provide real-time generation status updates
- Implement proper loading states and progress indicators
- Handle generation failures gracefully
- Provide clear feedback for all user actions

## Deployment & Environment

### Environment Variables
- Use proper environment variable naming (UPPER_CASE)
- Document all required environment variables
- Use different configurations for development/production
- Never commit sensitive data to version control

### Build Process
- Use proper build scripts for both client and server
- Implement proper TypeScript compilation
- Use proper asset optimization
- Test builds before deployment

## Monitoring & Logging

### Error Tracking
- Implement proper error logging with context
- Use structured logging for better debugging
- Monitor API performance and error rates
- Track user generation patterns

### Analytics
- Track generation success/failure rates
- Monitor credit usage patterns
- Track popular models and features
- Monitor system performance metrics

## AI Model Integration Guidelines

### Adding New Models
- Update AI_MODELS constant with proper metadata
- Add model-specific validation rules
- Test generation with various parameters
- Update documentation and user interface

### Model Configuration
- Support model-specific parameters (LoRA, strength, etc.)
- Implement proper parameter validation
- Handle model-specific error cases
- Provide model-specific UI controls

## Performance Optimization

### Image Handling
- Implement proper image compression
- Use appropriate image formats (WebP, PNG, JPEG)
- Implement proper caching strategies
- Optimize image loading and display

### API Performance
- Implement proper database indexing
- Use connection pooling for database connections
- Implement proper caching for frequently accessed data
- Monitor and optimize slow queries

## Compliance & Legal

### Data Privacy
- Implement proper data retention policies
- Provide user data export/deletion capabilities
- Comply with privacy regulations (GDPR, CCPA)
- Document data processing activities

### Content Policy
- Implement proper content filtering
- Handle NSFW content detection
- Provide content reporting mechanisms
- Maintain proper usage terms and conditions

## Specific Implementation Guidelines

### When creating new components:
1. Use TypeScript interfaces for all props
2. Implement proper error boundaries
3. Add loading states where appropriate
4. Follow the established design system
5. Use shadcn/ui components when possible

### When adding new API endpoints:
1. Add proper authentication middleware
2. Implement input validation with Zod
3. Add rate limiting
4. Return consistent response format
5. Add proper error handling

### When integrating new AI models:
1. Add to AI_MODELS constant with metadata
2. Update validation schemas
3. Test with various parameters
4. Update UI components
5. Document model-specific features

### When working with the database:
1. Use proper TypeScript types
2. Implement RLS policies
3. Add proper indexing
4. Handle relationships correctly
5. Use transactions for complex operations

### When handling images:
1. Use Supabase Storage
2. Generate signed URLs
3. Store proper metadata
4. Implement cleanup on deletion
5. Optimize for performance

## Code Examples

### Component Structure:
```typescript
interface ComponentProps {
  // Define all props with proper types
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX with proper accessibility
  );
};
```

### API Endpoint Structure:
```typescript
router.post('/endpoint',
  authenticateUser,
  validateBody(schema),
  async (req: AuthRequest, res) => {
    try {
      // Business logic
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);
```

### Error Handling:
```typescript
try {
  // Operation
} catch (error) {
  console.error('Context:', error);
  throw createError('User-friendly message', 500);
}
```

Remember: Always prioritize user experience, security, and code maintainability when implementing new features or making changes to existing code.
