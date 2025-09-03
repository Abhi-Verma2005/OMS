# NextAuth.js v5 (Auth.js) Implementation Guide

This project implements a comprehensive authentication system using the latest NextAuth.js v5 (Auth.js) with modern React 19 and Next.js 15 features.

## 🚀 Features Implemented

### ✅ Core Authentication
- **NextAuth.js v5 (Auth.js)** with latest stable version
- **Next.js 15** with App Router and Edge Runtime
- **React 19** with latest hooks and concurrent features
- **TypeScript 5.x** with strict configurations
- **Prisma v6** with PostgreSQL and latest features

### ✅ Authentication Providers
- **Google OAuth 2.0** with latest scopes and PKCE
- **Discord OAuth** (modern alternative to GitHub)
- **Email/Passwordless** with Resend integration
- **WebAuthn/Passkeys** for modern passwordless authentication
- **Multi-factor Authentication (MFA)** with TOTP

### ✅ Security Features
- **Role-based Access Control** (USER, ADMIN, MODERATOR)
- **Rate Limiting** with sliding window algorithm
- **Security Headers** (CSP, HSTS, X-Frame-Options, etc.)
- **CSRF Protection** with token validation
- **Edge Runtime Middleware** for maximum performance

### ✅ Modern React Features
- **React 19 Hooks** (`use()`, `useActionState()`, `useOptimistic()`)
- **Server Components** and **Server Actions**
- **Suspense Boundaries** and **Streaming SSR**
- **Real-time Session Management** with SWR
- **Concurrent Rendering** optimizations

## 📁 Project Structure

```
├── lib/
│   ├── auth.ts              # Auth.js v5 configuration
│   ├── db.ts                # Prisma client with connection pooling
│   ├── validations.ts       # Zod schemas for auth
│   ├── mfa-utils.ts         # MFA/TOTP utilities
│   ├── rate-limit.ts        # Rate limiting implementation
│   └── security.ts          # Security headers and utilities
├── middleware.ts            # Edge Runtime middleware
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # Auth.js v5 handler
│   ├── auth/
│   │   ├── signin/page.tsx  # Sign-in page
│   │   ├── error/page.tsx   # Error handling
│   │   └── setup-mfa/page.tsx # MFA setup
│   ├── dashboard/page.tsx   # Protected dashboard
│   └── admin/page.tsx       # Admin-only page
├── components/auth/
│   ├── sign-in-form.tsx     # Email/password form
│   ├── sign-in-button.tsx   # OAuth provider buttons
│   ├── sign-out-button.tsx  # Sign out component
│   ├── user-menu.tsx        # User dropdown menu
│   ├── auth-provider.tsx    # Session provider wrapper
│   ├── passkey-setup.tsx    # WebAuthn/Passkeys setup
│   ├── mfa-setup.tsx        # MFA setup component
│   └── protected-route.tsx  # Route protection wrapper
├── hooks/
│   ├── use-auth.ts          # React 19 optimized auth hook
│   └── use-session.ts       # Session management with SWR
├── actions/
│   └── auth-actions.ts      # Server Actions for auth
├── types/
│   ├── auth.ts              # Auth type definitions
│   └── global.d.ts          # Global type declarations
└── prisma/
    └── schema.prisma        # Database schema with Auth.js models
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/oms_db"

# Auth.js v5 Configuration
AUTH_SECRET=your-auth-secret-here
AUTH_URL=http://localhost:3000

# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Discord OAuth
AUTH_DISCORD_ID=your-discord-client-id
AUTH_DISCORD_SECRET=your-discord-client-secret

# Resend for Email
AUTH_RESEND_KEY=your-resend-api-key
AUTH_EMAIL_FROM=noreply@yourapp.com

# WebAuthn/Passkeys (Optional)
AUTH_WEBAUTHN_RP_ID=localhost
AUTH_WEBAUTHN_RP_NAME="OMS - Publisher Directory"
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 3. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`

#### Resend Email
1. Sign up at [Resend](https://resend.com/)
2. Get your API key
3. Verify your domain (optional)

### 4. Start Development Server

```bash
pnpm dev
```

## 🔐 Authentication Flow

### Sign In Process
1. User visits `/auth/signin`
2. Chooses OAuth provider or email/password
3. Redirected to provider for authentication
4. Callback handled by Auth.js
5. Session created and stored in database
6. Redirected to `/dashboard`

### Protected Routes
- `/dashboard` - Requires authentication
- `/admin` - Requires ADMIN role
- `/profile` - Requires authentication

### MFA Setup
1. User visits `/auth/setup-mfa`
2. QR code generated for authenticator app
3. User scans QR code and enters verification code
4. MFA enabled for account
5. Backup codes generated and displayed

### WebAuthn/Passkeys
1. User clicks "Set Up Passkey" in security settings
2. Browser prompts for biometric authentication
3. Passkey registered and stored securely
4. Can be used for passwordless sign-in

## 🛡️ Security Features

### Rate Limiting
- Auth endpoints: 5 attempts per 15 minutes
- Configurable per endpoint
- IP-based tracking

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (production)
- Referrer-Policy: strict-origin-when-cross-origin

### CSRF Protection
- Token validation on state-changing requests
- Origin and referer validation
- Secure cookie settings

## 🚀 Performance Optimizations

### Edge Runtime
- Middleware runs on Edge Runtime
- Global performance improvements
- Reduced cold start times

### Caching
- Session data cached with SWR
- Database connection pooling
- Optimized Prisma queries

### Streaming
- Server Components with Suspense
- Progressive page loading
- Concurrent rendering

## 🧪 Testing

### Manual Testing Checklist
- [ ] OAuth flows (Google, Discord)
- [ ] Email/password authentication
- [ ] MFA setup and verification
- [ ] WebAuthn/Passkeys registration
- [ ] Role-based access control
- [ ] Rate limiting
- [ ] Session management
- [ ] Error handling

### Automated Testing
```bash
# Run tests (when implemented)
pnpm test

# Run E2E tests with Playwright
pnpm test:e2e
```

## 📱 Mobile & PWA Support

- Responsive design for all screen sizes
- Touch-friendly authentication flows
- Offline-capable with service workers
- App-like experience on mobile devices

## 🔧 Customization

### Adding New Providers
1. Install provider package
2. Add to `lib/auth.ts` providers array
3. Update environment variables
4. Test authentication flow

### Custom User Roles
1. Update `UserRole` enum in Prisma schema
2. Modify role checks in middleware
3. Update UI components
4. Run database migration

### Styling
- Uses TailwindCSS v4 with custom design system
- Consistent with existing app theme
- Dark/light mode support
- Accessible color contrast

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Run `npx prisma db push`

2. **OAuth Provider Errors**
   - Verify client IDs and secrets
   - Check redirect URIs
   - Ensure provider APIs are enabled

3. **Session Not Persisting**
   - Check AUTH_SECRET is set
   - Verify database connection
   - Clear browser cookies

4. **Rate Limiting Issues**
   - Check middleware configuration
   - Verify IP detection
   - Adjust rate limits if needed

### Debug Mode
```bash
# Enable debug logging
DEBUG=next-auth:* pnpm dev
```

## 📚 Additional Resources

- [NextAuth.js v5 Documentation](https://authjs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [WebAuthn Guide](https://webauthn.guide/)

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure security best practices
5. Test on multiple devices/browsers

## 📄 License

This implementation follows the same license as the main project.
