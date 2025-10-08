# Dreamy Studio - AI Image Generation Platform

<div align="center">
  <img src="client/public/dreamy.png" alt="Dreamy Studio Logo" width="200" />
  
  **Create stunning AI-generated images with cutting-edge technology**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

## 🚀 Overview

Dreamy Studio is a full-stack AI image generation platform that empowers users to create high-quality images using multiple state-of-the-art AI models including Flux, Recraft, Ideogram, and more. The platform features user authentication, credit-based generation, image gallery management, and a modern, responsive interface.

### ✨ Key Features

- **Multiple AI Models**: Support for 10+ cutting-edge AI models
- **Real-time Generation**: Both synchronous and asynchronous image generation
- **User Management**: Complete authentication and profile management
- **Credit System**: Flexible credit-based usage model
- **Image Gallery**: Organize, favorite, and manage generated images
- **Modern UI**: Beautiful, responsive interface with dark theme
- **API Access**: RESTful API for integration with other applications

## 🏗️ Architecture

This is a monorepo containing two main workspaces:

- **`client/`** — React frontend application with TypeScript, Tailwind CSS, and shadcn/ui
- **`server/`** — Express.js backend API with TypeScript, Supabase integration, and AI service connections

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for state management
- React Router for navigation
- Supabase for authentication

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- Supabase for database and storage
- Fal.ai for AI image generation
- Zod for input validation
- Helmet for security

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Fal.ai API key

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd dreamy-studio
```

2. **Install dependencies:**
```bash
npm run install:all
```

3. **Set up environment variables:**
   - Copy environment templates and fill in your values
   - See [Environment Setup Guide](ENVIRONMENT.md) for detailed instructions

4. **Start development servers:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:9000

## 📚 Documentation

- **[Development Guide](DEVELOPMENT.md)** - Comprehensive development setup and guidelines
- **[API Documentation](API.md)** - Complete API reference with examples
- **[Environment Setup](ENVIRONMENT.md)** - Environment variables configuration
- **[Cursor Rules](.cursorrules)** - AI-assisted development rules and guidelines

## 🛠️ Available Scripts

### Root Level
- `npm run install:all` — Install dependencies for all workspaces
- `npm run dev` — Run both client and server in development mode
- `npm run dev:client` — Run only the client development server
- `npm run dev:server` — Run only the server development server
- `npm run build` — Build both client and server for production
- `npm start` — Start the production server

### Client Scripts
- `npm run dev` — Start Vite development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

### Server Scripts
- `npm run dev` — Start development server with hot reload
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Start production server

## 🎨 AI Models

Dreamy Studio supports multiple AI models for different use cases:

| Model | Type | Description |
|-------|------|-------------|
| **Flux Dev** | Text-to-Image | High-quality generation with excellent detail |
| **Flux Schnell** | Text-to-Image | Fast generation for quick iterations |
| **Flux Pro Kontext** | Text-to-Image | Professional context-aware generation |
| **Recraft V3** | Text-to-Image | Advanced generation with style control |
| **Ideogram V3** | Text-to-Image | Excellent text rendering capabilities |
| **Nano Banana** | Text-to-Image | Lightweight and fast generation |

## 🔧 Configuration

### Environment Variables

The application requires several environment variables for proper operation:

**Client (.env):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:9000
```

**Server (.env):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FAL_API_KEY=your_fal_api_key
PORT=9000
NODE_ENV=development
```

See [Environment Setup Guide](ENVIRONMENT.md) for complete configuration details.

## 🏛️ Project Structure

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
├── .cursorrules           # Cursor AI development rules
├── DEVELOPMENT.md         # Development guide
├── API.md                # API documentation
├── ENVIRONMENT.md        # Environment setup guide
└── package.json          # Root package.json
```

## 🔐 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Configurable rate limits per endpoint
- **CORS**: Properly configured cross-origin resource sharing
- **Environment Variables**: Secure handling of sensitive data

## 🚀 Deployment

### Production Build

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

### Environment Setup

1. Set up production environment variables
2. Configure Supabase production instance
3. Set up proper domain and SSL certificates
4. Configure CDN for static assets

See [Development Guide](DEVELOPMENT.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the coding standards** outlined in [.cursorrules](.cursorrules)
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use the established component architecture
- Implement proper error handling
- Write meaningful commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the comprehensive guides in this repository
- **Issues**: Create an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact support at support@dreamystudio.com

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for backend infrastructure
- [Fal.ai](https://fal.ai/) for AI image generation services
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for fast development experience

---

<div align="center">
  <p>Made with ❤️ for creators worldwide</p>
  <p>
    <a href="https://dreamystudio.com">Website</a> •
    <a href="https://docs.dreamystudio.com">Documentation</a> •
    <a href="https://github.com/dreamystudio/dreamy-studio/issues">Issues</a> •
    <a href="https://github.com/dreamystudio/dreamy-studio/discussions">Discussions</a>
  </p>
</div>
