# Session Management Implementation

## Overview

This document describes the session timeout and automatic refresh implementation for BEMYRE v2 client, addressing the **CVSS 5.8 security audit requirement**.

## Features

- **Automatic Inactivity Detection**: Tracks user activity (mouse, keyboard, touch events)
- **Session Warning Modal**: Shows countdown warning before session expires
- **Auto-logout**: Automatically logs out user after timeout period
- **Background Session Refresh**: Periodically refreshes tokens while user is active
- **Security**: Uses httpOnly cookies (tokens not accessible from JavaScript)

## Configuration

Located in `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/hooks/useSessionManager.ts`:

```typescript
// 25 minutes of inactivity before showing warning
export const SESSION_WARNING_TIME = 25 * 60 * 1000;

// 30 minutes total before auto-logout
export const SESSION_TIMEOUT = 30 * 60 * 1000;

// Refresh session every 10 minutes if active
export const REFRESH_INTERVAL = 10 * 60 * 1000;
```

### Customization

You can override these defaults when using the hook:

```typescript
useSessionManager({
  warningTime: 20 * 60 * 1000,      // 20 minutes
  timeoutDuration: 25 * 60 * 1000,  // 25 minutes
  refreshInterval: 5 * 60 * 1000,   // 5 minutes
});
```

## Architecture

### Files Created

```
bemyre-v2/client/
├── lib/hooks/
│   ├── useSessionManager.ts      # Core session management hook
│   └── index.ts                  # Exports
├── components/organisms/
│   └── SessionWarningModal/
│       ├── SessionWarningModal.tsx  # Warning modal component
│       └── index.ts                 # Exports
├── providers/
│   ├── SessionProvider.tsx       # Session provider wrapper
│   └── index.ts                  # Exports
└── docs/
    └── SESSION_MANAGEMENT.md     # This file
```

### Component Hierarchy

```
SessionProvider
├── useSessionManager hook
│   ├── Activity tracking
│   ├── Timer management
│   └── Session refresh
└── SessionWarningModal
    ├── Countdown display
    ├── Continue button
    └── Logout button
```

## Integration Guide

### Step 1: Wrap Your App with SessionProvider

Edit `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/app/providers.tsx`:

```typescript
"use client";

import { ReactNode, useEffect } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ErrorBoundary } from "@organisms";
import { SessionProvider } from "@/providers";  // Add this import
import { initLoggerWithSentry } from "@lib/logger/init";
import theme from "./theme";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    initLoggerWithSentry();
  }, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary componentName="App">
          <SessionProvider>  {/* Add this wrapper */}
            {children}
          </SessionProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

### Step 2: Verify Zustand Store Configuration

Ensure your store has the `auth` slice configured. The session manager uses:

- `state.auth.isAuthenticated` - To determine if session management should be active
- `state.auth.logout()` - To logout on timeout
- `state.auth.refreshSession()` - To refresh tokens

These are already configured in `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/store/slices/authSlice.ts`.

### Step 3: Test the Implementation

1. **Start the dev server**:
   ```bash
   cd /home/nexus/workspace/bemyre/bemyre/bemyre-v2/client
   pnpm dev
   ```

2. **Login to the application**

3. **Test inactivity detection**:
   - After login, don't interact with the page
   - After 25 minutes, the warning modal should appear
   - After 30 minutes total, you should be logged out

4. **Test manual continuation**:
   - Wait for warning modal (25 min)
   - Click "Continuar sesión"
   - Modal should close and timers reset

5. **Test background refresh**:
   - Keep using the app actively
   - Every 10 minutes, tokens should refresh automatically
   - Check browser DevTools Network tab for `/api/v1/auth/refresh` calls

## How It Works

### 1. Activity Tracking

The hook listens to these events to detect user activity:

```typescript
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];
```

Activity is throttled to avoid excessive timer resets (max once per second).

### 2. Timer Flow

```
User Authenticates
        ↓
Activity Detected → Reset Warning Timer (25 min)
        ↓           Reset Timeout Timer (30 min)
        ↓
25 min Inactive
        ↓
Show Warning Modal ← Start Countdown
        ↓
User Clicks "Continuar" → Refresh Session
        ↓                 Reset Timers
        ↓                 Close Modal
        ↓
OR
        ↓
5 min Pass (30 total)
        ↓
Auto Logout
```

### 3. Background Refresh

```
User Active
     ↓
Schedule Refresh (every 10 min)
     ↓
Check if active in last 10 min
     ↓
Yes → Call refreshSession()
      ↓
      Update httpOnly cookies
```

### 4. Security Considerations

- **httpOnly Cookies**: Tokens are stored in httpOnly cookies, not accessible from JS
- **No Token Storage**: The client never stores or handles JWT tokens directly
- **Backend Validation**: All auth operations go through the backend
- **Clean Timers**: All event listeners and timers are cleaned up on unmount
- **No Bypass**: Warning modal cannot be closed with ESC or backdrop click

## Advanced Usage

### Custom Callbacks

```typescript
<SessionProvider
  onWarning={() => {
    // Custom action when warning shows
    console.log("Session warning!");
    // e.g., save draft data
  }}
  onTimeout={() => {
    // Custom action on timeout
    console.log("Session expired!");
    // e.g., redirect to login page
  }}
>
  {children}
</SessionProvider>
```

### Direct Hook Usage

If you need finer control, use the hook directly:

```typescript
import { useSessionManager } from "@lib/hooks";
import { SessionWarningModal } from "@organisms";

function CustomSessionManager() {
  const {
    showWarning,
    remainingTime,
    handleContinueSession,
    handleLogout,
  } = useSessionManager({
    warningTime: 20 * 60 * 1000,
    timeoutDuration: 25 * 60 * 1000,
  });

  return (
    <>
      {/* Your custom UI */}
      {showWarning && (
        <CustomWarningBanner
          timeLeft={remainingTime}
          onExtend={handleContinueSession}
        />
      )}
    </>
  );
}
```

### Disable for Specific Routes

```typescript
"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "@/providers";

export function ConditionalSessionProvider({ children }) {
  const pathname = usePathname();

  // Don't enable session management on public pages
  const isPublicRoute = pathname.startsWith("/public");

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
```

## Testing

### Unit Tests

Create tests in `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/tests/unit/hooks/useSessionManager.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSessionManager } from "@lib/hooks";

describe("useSessionManager", () => {
  it("should initialize timers on mount", () => {
    const { result } = renderHook(() => useSessionManager());
    expect(result.current.showWarning).toBe(false);
  });

  it("should show warning after warning time", async () => {
    vi.useFakeTimers();
    const onWarning = vi.fn();

    const { result } = renderHook(() =>
      useSessionManager({ onWarning, warningTime: 1000 })
    );

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.showWarning).toBe(true);
    expect(onWarning).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
```

### Integration Tests

Test the full flow with Playwright:

```typescript
import { test, expect } from "@playwright/test";

test("session timeout flow", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password");
  await page.click('button[type="submit"]');

  // Wait for dashboard
  await expect(page).toHaveURL("/dashboard");

  // Simulate inactivity (mock timers)
  await page.evaluate(() => {
    // Fast-forward 25 minutes
    const event = new Event("mockInactivity");
    window.dispatchEvent(event);
  });

  // Warning modal should appear
  await expect(page.getByText("Tu sesión está por expirar")).toBeVisible();

  // Continue session
  await page.click('button:has-text("Continuar sesión")');

  // Modal should close
  await expect(page.getByText("Tu sesión está por expirar")).not.toBeVisible();
});
```

## Troubleshooting

### Warning Modal Not Appearing

1. **Check authentication**:
   ```typescript
   const isAuth = useStore((state) => state.auth.isAuthenticated);
   console.log("Is authenticated:", isAuth);
   ```

2. **Check timers in DevTools**:
   - Open browser console
   - Look for log messages: "Session manager initialized"
   - Look for: "Session timers reset"

3. **Verify activity events**:
   - Check if events are being captured
   - Test with explicit mouse movement

### Session Not Refreshing

1. **Check backend endpoint**:
   - Verify `/api/v1/auth/refresh` is working
   - Check browser Network tab for 401/403 errors

2. **Check httpOnly cookies**:
   - Open DevTools → Application → Cookies
   - Look for `refresh_token` cookie
   - Verify it has `HttpOnly` flag

3. **Check refresh interval**:
   - Default is 10 minutes
   - Look for console logs: "Refreshing session in background"

### Memory Leaks

If you notice performance issues:

1. **Check cleanup**:
   - All timers should be cleared on unmount
   - Event listeners should be removed

2. **Monitor with DevTools**:
   - Performance → Memory
   - Take heap snapshots
   - Look for detached event listeners

## Security Audit Compliance

This implementation addresses **CVSS 5.8 - Session Timeout**:

✅ **Inactivity Detection**: Tracks user activity
✅ **Automatic Logout**: Logs out after 30 minutes of inactivity
✅ **Warning Before Logout**: Shows warning at 25 minutes
✅ **Session Refresh**: Refreshes tokens every 10 minutes when active
✅ **httpOnly Cookies**: Tokens not accessible from JavaScript
✅ **No Client-Side Token Storage**: All auth handled server-side
✅ **Clean Lifecycle**: Proper cleanup of timers and listeners

## References

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [CVSS v3.1 Specification](https://www.first.org/cvss/v3.1/specification-document)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review logs in browser console
3. Check backend logs for auth errors
4. Open an issue in the repository
