# Session Management - Quick Integration Example

## Step-by-Step Integration

### 1. Update `app/providers.tsx`

```typescript
"use client";

import { ReactNode, useEffect } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ErrorBoundary } from "@organisms";
import { SessionProvider } from "@/providers";  // ← ADD THIS
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
          <SessionProvider>  {/* ← ADD THIS */}
            {children}
          </SessionProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

### 2. That's It!

The session management is now fully integrated. It will:

- ✅ Automatically start when user logs in
- ✅ Track user activity (mouse, keyboard, touch)
- ✅ Show warning modal after 25 minutes of inactivity
- ✅ Auto-logout after 30 minutes of inactivity
- ✅ Refresh session every 10 minutes if user is active
- ✅ Clean up when user logs out

### 3. Test It

```bash
# Start dev server
pnpm dev

# Navigate to http://localhost:3000
# Login to your account
# Don't interact with the page for 25 minutes
# Warning modal should appear
```

## Optional: Custom Configuration

If you need different timeout values:

```typescript
<SessionProvider
  onWarning={() => {
    console.log("Session warning shown!");
    // Save any unsaved work
  }}
  onTimeout={() => {
    console.log("Session expired!");
    // Redirect or show message
  }}
>
  {children}
</SessionProvider>
```

To change timeout values, edit `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/hooks/useSessionManager.ts`:

```typescript
// Line 40-45
export const SESSION_WARNING_TIME = 25 * 60 * 1000;  // 25 minutes
export const SESSION_TIMEOUT = 30 * 60 * 1000;       // 30 minutes
export const REFRESH_INTERVAL = 10 * 60 * 1000;      // 10 minutes
```

## Verification

Open browser DevTools console and look for these log messages:

```
✅ "Session manager initialized"
✅ "Session timers reset"
✅ "Refreshing session in background" (every 10 min)
⚠️ "Session warning - user inactive" (at 25 min)
❌ "Session expired - logging out user" (at 30 min)
```

## Files Modified

Only one file needs to be modified:
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/app/providers.tsx`

## Files Created

All new files are already created and ready to use:
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/hooks/useSessionManager.ts`
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/components/organisms/SessionWarningModal/`
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/providers/SessionProvider.tsx`
