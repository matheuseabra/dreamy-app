# Environment Variables Guide

## Overview
This document describes all environment variables required for the Dreamy Studio application. Environment variables are used to configure the application for different environments (development, staging, production).

## Client Environment Variables

### File: `client/.env`

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=http://localhost:9000

# Optional: Analytics and Monitoring
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### Client Variables Description

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key for client-side auth | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_API_BASE_URL` | Yes | Backend API base URL | `http://localhost:9000` or `https://api.dreamystudio.com` |
| `VITE_ANALYTICS_ID` | No | Google Analytics tracking ID | `G-XXXXXXXXXX` |
| `VITE_SENTRY_DSN` | No | Sentry DSN for error tracking | `https://abc123@sentry.io/123456` |

## Server Environment Variables

### File: `server/.env`

```env
# Server Configuration
PORT=9000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service API Keys
FAL_API_KEY=your_fal_api_key

# Webhook Configuration
WEBHOOK_BASE_URL=http://localhost:9000

# Optional: Monitoring and Logging
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### Server Variables Description

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port number | `9000` |
| `NODE_ENV` | Yes | Environment mode | `development`, `production` |
| `FRONTEND_URL` | Yes | Frontend application URL for CORS | `http://localhost:5173` |
| `SUPABASE_URL` | Yes | Supabase project URL | `https://abc123.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key for server operations | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `FAL_API_KEY` | Yes | Fal.ai API key for image generation | `fal_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `OPENAI_API_KEY` | No | OpenAI API key for additional AI services | `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `REPLICATE_API_KEY` | No | Replicate API key for additional models | `r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `WEBHOOK_BASE_URL` | Yes | Base URL for webhook callbacks | `http://localhost:9000` or `https://api.dreamystudio.com` |
| `SENTRY_DSN` | No | Sentry DSN for error tracking | `https://abc123@sentry.io/123456` |
| `LOG_LEVEL` | No | Logging level | `error`, `warn`, `info`, `debug` |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limiting window in milliseconds | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Maximum requests per window | `100` |
| `JWT_SECRET` | No | JWT secret for token signing | `your-secret-key` |
| `CORS_ORIGIN` | No | CORS origin (overrides FRONTEND_URL) | `http://localhost:5173` |

## Environment-Specific Configurations

### Development Environment

**client/.env.development:**
```env
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_dev_supabase_anon_key
VITE_API_BASE_URL=http://localhost:9000
```

**server/.env.development:**
```env
PORT=9000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_dev_supabase_service_role_key
SUPABASE_ANON_KEY=your_dev_supabase_anon_key
FAL_API_KEY=your_fal_api_key
WEBHOOK_BASE_URL=http://localhost:9000
LOG_LEVEL=debug
```

### Production Environment

**client/.env.production:**
```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_prod_supabase_anon_key
VITE_API_BASE_URL=https://api.dreamystudio.com
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://abc123@sentry.io/123456
```

**server/.env.production:**
```env
PORT=9000
NODE_ENV=production
FRONTEND_URL=https://dreamystudio.com
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_prod_supabase_service_role_key
SUPABASE_ANON_KEY=your_prod_supabase_anon_key
FAL_API_KEY=your_fal_api_key
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_KEY=your_replicate_api_key
WEBHOOK_BASE_URL=https://api.dreamystudio.com
SENTRY_DSN=https://abc123@sentry.io/123456
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://dreamystudio.com
```

## Setting Up Environment Variables

### Local Development

1. **Create environment files:**
```bash
# In project root
cp client/.env.example client/.env
cp server/.env.example server/.env
```

2. **Fill in the values:**
   - Get Supabase credentials from your Supabase dashboard
   - Get Fal.ai API key from your Fal.ai account
   - Set appropriate URLs for your local development

3. **Verify setup:**
```bash
npm run dev
```

### Production Deployment

1. **Set environment variables in your hosting platform:**
   - Vercel, Netlify, Railway, etc.
   - Use their environment variable configuration

2. **For Docker deployment:**
```dockerfile
# In Dockerfile
ENV NODE_ENV=production
ENV PORT=9000
# ... other variables
```

3. **For server deployment:**
```bash
# Create .env file on server
sudo nano /opt/dreamy-studio/.env
# Add all production variables
```

## Security Best Practices

### 1. Never Commit Secrets
```bash
# Add to .gitignore
.env
.env.local
.env.development
.env.production
*.env
```

### 2. Use Different Keys for Different Environments
- Development: Use test/development API keys
- Staging: Use staging API keys
- Production: Use production API keys

### 3. Rotate Keys Regularly
- Set up key rotation schedule
- Monitor for compromised keys
- Use key management services when possible

### 4. Limit Key Permissions
- Use least privilege principle
- Create separate keys for different services
- Monitor key usage

### 5. Use Environment-Specific Configurations
```typescript
// Example: Different configurations per environment
const config = {
  development: {
    apiUrl: 'http://localhost:9000',
    logLevel: 'debug'
  },
  production: {
    apiUrl: 'https://api.dreamystudio.com',
    logLevel: 'info'
  }
}[process.env.NODE_ENV || 'development'];
```

## Validation

### Client-Side Validation
```typescript
// Validate required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_API_BASE_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### Server-Side Validation
```typescript
// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'FAL_API_KEY',
  'PORT'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## Troubleshooting

### Common Issues

1. **"Missing environment variable" error:**
   - Check if .env file exists
   - Verify variable name spelling
   - Ensure no extra spaces in variable names

2. **API connection issues:**
   - Verify API URLs are correct
   - Check if API keys are valid
   - Ensure network connectivity

3. **Supabase connection issues:**
   - Verify Supabase URL format
   - Check if keys are correct
   - Ensure RLS policies are set up

4. **CORS errors:**
   - Check FRONTEND_URL configuration
   - Verify CORS_ORIGIN setting
   - Ensure URLs match exactly

### Debug Commands
```bash
# Check environment variables
node -e "console.log(process.env)"

# Test Supabase connection
node -e "const { createClient } = require('@supabase/supabase-js'); console.log('Supabase client created')"

# Test API endpoints
curl -X GET http://localhost:9000/health
```

## Environment Variable Templates

### .env.example (Client)
```env
# Copy this file to .env and fill in your values

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=http://localhost:9000

# Optional: Analytics and Monitoring
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### .env.example (Server)
```env
# Copy this file to .env and fill in your values

# Server Configuration
PORT=9000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service API Keys
FAL_API_KEY=your_fal_api_key
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_KEY=your_replicate_api_key

# Webhook Configuration
WEBHOOK_BASE_URL=http://localhost:9000

# Optional: Monitoring and Logging
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
```

## Monitoring and Alerts

### Set up monitoring for:
- Environment variable changes
- API key expiration
- Service availability
- Error rates
- Performance metrics

### Recommended tools:
- Sentry for error tracking
- DataDog for monitoring
- PagerDuty for alerts
- Custom health checks

Remember to keep this documentation updated when adding new environment variables or changing existing ones.
