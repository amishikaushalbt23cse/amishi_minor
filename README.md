# Wallet Recovery System - Frontend

A Next.js frontend application for secure wallet recovery using Shamir Secret Sharing (SSS).

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **NextAuth.js v5** - Authentication library with Google OAuth support
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Component library
- **Crypto-JS** - Encryption utilities
- **Shamir Secret Sharing** - Client-side share generation

## Features

### Pages

1. **Login/Signup Page** (`/login`)
   - Email and password authentication
   - Google OAuth integration

2. **Dashboard** (`/dashboard`)
   - Main navigation hub
   - Quick access to all features

3. **Wallet Setup** (`/wallet/setup`)
   - Private key input/generation
   - SSS configuration (n shares, t threshold)
   - Guardian management
   - Share generation and distribution

4. **Guardians Management** (`/guardians`)
   - View all guardians
   - Add/remove guardians
   - Monitor guardian status

5. **Recovery** (`/recovery`)
   - Start recovery session
   - Guardian approval tracking
   - Private key reconstruction

6. **Vault** (`/vault`)
   - Display recovered private key
   - Copy to clipboard
   - Regenerate shares

### Components

1. **InputField** - Reusable input component
2. **Button** - Primary button component with variants
3. **Card** - Container component for content
4. **GuardianList** - Display list of guardians
5. **ShareStatusList** - Show guardian approval status
6. **Toast** - Success/error notifications
7. **Loader** - Loading spinner
8. **Modal** - Dialog component

## Getting Started

### Installation

```bash
npm install
```

### Google OAuth Setup

1. **Create Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Copy the Client ID and Client Secret

2. **Configure Environment Variables**:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```env
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-secret-key-here
     GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```
   - Generate `NEXTAUTH_SECRET` using:
     ```bash
     openssl rand -base64 32
     ```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
.
├── app/
│   ├── components/          # Reusable components
│   ├── dashboard/           # Dashboard page
│   ├── guardians/           # Guardians management page
│   ├── login/               # Login page
│   ├── recovery/            # Recovery page
│   ├── vault/               # Vault page
│   ├── wallet/
│   │   └── setup/           # Wallet setup page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects to login)
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts  # NextAuth API route handler
│   └── providers.tsx         # Session provider wrapper
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── encryption.ts        # Encryption utilities
│   ├── sss.ts               # Shamir Secret Sharing implementation
│   └── utils.ts             # Utility functions
├── types/
│   └── next-auth.d.ts       # NextAuth TypeScript definitions
└── package.json
```

## API Integration

The frontend includes placeholder API calls that need to be connected to your backend:

- `/api/auth/login` - User authentication
- `/api/wallet/setup` - Wallet setup and share distribution
- `/api/guardians` - Guardian management
- `/api/recovery/start` - Start recovery session
- `/api/recovery/shares` - Get guardian shares
- `/api/vault/key` - Get recovered key
- `/api/vault/regenerate` - Regenerate shares

## Security Notes

⚠️ **Important**: This is a frontend implementation. In production:

1. Use proper key management for encryption passwords
2. Implement secure API endpoints
3. Add proper authentication and authorization
4. Use HTTPS in production
5. Implement rate limiting
6. Add input validation and sanitization
7. Use environment variables for sensitive configuration

## License

MIT

