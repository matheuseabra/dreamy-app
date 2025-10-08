# Dreamy Studio - Project Setup Guide

## Quick Setup Script

Run this script to set up your development environment:

```bash
#!/bin/bash

echo "🚀 Setting up Dreamy Studio..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Create environment files
echo "🔧 Setting up environment files..."

# Client environment
cat > client/.env << 'EOF'
# Dreamy Studio - Client Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:9000
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
EOF

# Server environment
cat > server/.env << 'EOF'
# Dreamy Studio - Server Environment Variables
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
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
EOF

echo "✅ Environment files created"
echo ""
echo "🔑 Next steps:"
echo "1. Set up your Supabase project:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Get your URL and keys from Settings > API"
echo ""
echo "2. Get your Fal.ai API key:"
echo "   - Go to https://fal.ai"
echo "   - Sign up and get your API key"
echo ""
echo "3. Update the environment files with your actual values:"
echo "   - client/.env"
echo "   - server/.env"
echo ""
echo "4. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🎉 Setup complete! Check the documentation for more details."
```

## Manual Setup

If you prefer to set up manually:

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Create Environment Files

**client/.env:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:9000
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

**server/.env:**
```env
PORT=9000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

FAL_API_KEY=your_fal_api_key
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_KEY=your_replicate_api_key

WEBHOOK_BASE_URL=http://localhost:9000

SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### 3. Set Up Supabase

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your project URL and keys
5. Update your environment files

### 4. Set Up Fal.ai

1. Go to [Fal.ai](https://fal.ai)
2. Sign up for an account
3. Get your API key from the dashboard
4. Update your environment files

### 5. Start Development

```bash
npm run dev
```

## Verification

After setup, verify everything is working:

1. **Check health endpoint:**
```bash
curl http://localhost:9000/health
```

2. **Check frontend:**
   - Open http://localhost:5173
   - You should see the landing page

3. **Check API:**
   - Open http://localhost:9000/health
   - You should see a JSON response

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports 5173 and 9000
lsof -ti:5173 | xargs kill -9
lsof -ti:9000 | xargs kill -9
```

**Environment variables not loading:**
- Check file names (should be `.env`, not `.env.txt`)
- Restart the development servers
- Check for typos in variable names

**Supabase connection issues:**
- Verify your URL and keys are correct
- Check if your Supabase project is active
- Ensure RLS policies are set up

**Fal.ai API issues:**
- Verify your API key is correct
- Check your account balance
- Ensure the model IDs are valid

## Next Steps

1. Read the [Development Guide](DEVELOPMENT.md)
2. Check the [API Documentation](API.md)
3. Review the [Environment Setup](ENVIRONMENT.md)
4. Follow the [Cursor Rules](.cursorrules) for development

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the documentation
3. Create an issue in the repository
4. Contact support at support@dreamystudio.com
