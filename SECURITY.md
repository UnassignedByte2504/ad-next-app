# Security Policy - BEMYRE Client

## Security Implementation Status

**Last Updated:** December 2024

| Category | Status | Details |
|----------|--------|---------|
| React Security Patch | ✅ | CVE-2025-55182 fixed (v19.2.1) |
| Security Headers | ✅ | OWASP headers via next.config.ts |
| XSS Prevention | ✅ | React auto-escaping + CSP |
| CSRF Protection | ✅ | SameSite cookies + state param |
| Dependency Scanning | ✅ | GitHub Dependabot |

---

## Implemented Security Features

### Security Headers (next.config.ts)

```text
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Authentication Flow

| Feature | Implementation |
|---------|----------------|
| JWT Storage | HttpOnly cookies (NOT localStorage) |
| Token Refresh | Automatic via API route |
| OAuth State | CSRF protection via state parameter |
| Session Timeout | Configurable via server |

### XSS Prevention

| Protection | Status |
|------------|--------|
| React Auto-Escaping | ✅ Built-in |
| No `dangerouslySetInnerHTML` | ✅ Avoided |
| Input Sanitization | ✅ Zod validation |
| CSP Headers | ✅ Server-side |

---

## Security Best Practices

### Never Store Sensitive Data in localStorage

```typescript
// NEVER do this
localStorage.setItem("token", jwt);
localStorage.setItem("user", JSON.stringify(userData));

// Tokens are stored in HttpOnly cookies by the server
// Access user data via secure API calls
```

### Always Validate User Input

```typescript
import { z } from "zod";

// Define schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Validate before submission
const result = loginSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
}
```

### Avoid Dangerous React Patterns

```typescript
// NEVER use dangerouslySetInnerHTML with user content
<div dangerouslySetInnerHTML={{ __html: userContent }} /> // BAD

// Use text content instead
<div>{userContent}</div> // GOOD - React escapes automatically

// If HTML is absolutely needed, sanitize first
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

### Secure API Calls

```typescript
// Always use relative URLs for API calls
const response = await fetch("/api/data", {
  credentials: "include", // Include cookies
});

// Never interpolate user input into URLs without validation
const userId = validateUUID(params.id);
const response = await fetch(`/api/users/${userId}`);
```

### Environment Variables

```typescript
// Public env vars (exposed to browser) - prefix with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.bemyre.com

// Private env vars (server-only) - no prefix
DATABASE_URL=...
JWT_SECRET=...

// Access in code
// Client-side: process.env.NEXT_PUBLIC_API_URL
// Server-side: process.env.DATABASE_URL (only in API routes/server components)
```

---

## Security Checklist for PRs

Before merging frontend code:

- [ ] No sensitive data in localStorage/sessionStorage
- [ ] No hardcoded API keys or secrets
- [ ] User input validated with Zod schemas
- [ ] No `dangerouslySetInnerHTML` with user content
- [ ] External links use `rel="noopener noreferrer"`
- [ ] Images from external sources validated
- [ ] No console.log with sensitive data in production
- [ ] Forms have proper CSRF protection

---

## Dependency Security

### Automated Scanning

- GitHub Dependabot (enabled)
- `bun audit` for vulnerability checks

### Update Dependencies

```bash
# Check for vulnerabilities
bun audit

# Update all dependencies
bun update

# Update specific package (e.g., security patch)
bun add react@latest react-dom@latest
```

### Recent Security Updates

| Date | Package | CVE | Action |
|------|---------|-----|--------|
| 2024-12-05 | react | CVE-2025-55182 | Updated to 19.2.1 |

---

## Content Security Policy

The CSP is configured server-side. For development, it's relaxed to allow hot reload. In production, it's strict:

```text
# Production CSP (configured on API server)
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';  # Required for MUI
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://api.bemyre.com;
```

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: `security@bemyre.com`
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

Response time: Within 48 hours.

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Zod Validation](https://zod.dev/)
