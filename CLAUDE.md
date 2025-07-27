    # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start development server with Vite
- `npm run build` - Build production version
- `npm run preview` - Preview production build
- `npm run server` - Start Express backend server
- `npm run dev` - Run both frontend and backend concurrently

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express + TypeScript with MySQL/SQL Server support
- **Styling**: Tailwind CSS + PostCSS
- **Database**: IndexedDB (frontend storage) + MySQL (backend)
- **Encryption**: Web Crypto API (AES-GCM with PBKDF2)
- **Routing**: React Router v7

## Architecture Overview

This is a password manager web application with client-side encryption and optional backend synchronization.

### Core Architecture
- **Frontend-first design**: Primary data storage in IndexedDB with encryption
- **Master password system**: All data encrypted with user's master password using PBKDF2 key derivation
- **Dual authentication flow**: Master password setup → Login authentication
- **Route protection**: Nested route structure with authentication guards

### Key Services

**`src/services/crypto.ts`**: Handles all encryption/decryption using Web Crypto API
- Uses AES-GCM encryption with 256-bit keys
- PBKDF2 key derivation (100,000 iterations)
- Stores salt in IndexedDB for key recreation

**`src/services/storage.ts`**: Manages IndexedDB operations for account data
- Encrypts passwords before storage
- Provides search, filtering, and CRUD operations
- Handles data import/export functionality

**`src/services/autoLock.ts`**: Auto-lock functionality for security
**`src/services/passwordStrength.ts`**: Password strength validation

### Route Structure
- **AuthRoutes** (`src/routes/AuthRoutes.tsx`): Login, Register, Master Password setup
- **AppRoutes** (`src/routes/index.tsx`): Main application routes
- **DashboardRoutes** (`src/routes/DashboardRoutes.tsx`): Account management interface

### Component Organization
- **Pages**: Feature-complete page components in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Layout**: `MainLayout.tsx` provides consistent app structure
- **Context**: `AuthContext.tsx` manages authentication state

### Data Flow
1. User sets master password (first time) or logs in (returning user)
2. Master password derives encryption key stored in memory
3. Account passwords encrypted/decrypted on-demand using master key
4. IndexedDB stores encrypted account data locally
5. Optional backend sync (server.ts) for cross-device access

## Security Considerations

- **Client-side encryption**: All sensitive data encrypted before storage
- **Master key in memory**: Encryption key never persisted to disk
- **Auto-lock functionality**: Automatic logout after inactivity
- **Password masking**: Passwords displayed as asterisks in storage
- **Secure key derivation**: PBKDF2 with high iteration count

## Backend API

The Express server (`server.ts`) provides:
- Database connectivity testing via `/api/test-db`
- CORS enabled for frontend integration
- MySQL connection with SSL support
- Currently contains hardcoded database credentials (should be environment variables)

## Common Patterns

- **Authentication flow**: Check master password → set authentication state → route protection
- **Encrypted storage**: Always encrypt sensitive data before IndexedDB storage
- **Component composition**: Use composition over inheritance for UI components
- **TypeScript interfaces**: Well-defined types for Account, AuthContext, etc.

## Development Notes

- Uses Vite for fast development with HMR
- Tailwind CSS for styling with responsive design
- Concurrent development: frontend (port 3000) + backend (port 3001)
- No testing framework currently configured
- Chinese language comments and UI text throughout codebase