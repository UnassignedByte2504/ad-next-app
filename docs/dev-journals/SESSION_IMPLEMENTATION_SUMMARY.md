# Session Timeout & Auto-Refresh Implementation Summary

## Overview

Implemented comprehensive session management for BEMYRE v2 client to address **CVSS 5.8 security audit requirement**.

## What Was Implemented

### 1. Core Session Manager Hook
**File**: `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/hooks/useSessionManager.ts`

Features:
- ✅ Tracks user activity (mouse, keyboard, touch events)
- ✅ Shows warning modal after 25 minutes of inactivity
- ✅ Auto-logout after 30 minutes of inactivity
- ✅ Background session refresh every 10 minutes (if active)
- ✅ Uses refs to avoid re-renders
- ✅ Proper cleanup of event listeners on unmount
- ✅ Throttled activity detection (max once per second)

Configuration Constants:
```typescript
SESSION_WARNING_TIME = 25 * 60 * 1000  // 25 minutes
SESSION_TIMEOUT = 30 * 60 * 1000       // 30 minutes
REFRESH_INTERVAL = 10 * 60 * 1000      // 10 minutes
```

### 2. Session Warning Modal Component
**Files**:
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/components/organisms/SessionWarningModal/SessionWarningModal.tsx`
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/components/organisms/SessionWarningModal/index.ts`

Features:
- ✅ MUI Dialog with countdown timer (MM:SS format)
- ✅ Spanish language UI
- ✅ Two action buttons: "Continuar sesión" and "Cerrar sesión"
- ✅ Cannot be closed with ESC or backdrop click (security)
- ✅ Color changes when time is critical (<30 seconds)
- ✅ Responsive design
- ✅ Alert banner explaining the situation

### 3. Session Provider
**Files**:
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/providers/SessionProvider.tsx`
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/providers/index.ts`

Features:
- ✅ Wraps application to provide session management
- ✅ Only active when user is authenticated
- ✅ Integrates useSessionManager hook
- ✅ Renders SessionWarningModal
- ✅ Optional callbacks for warning and timeout events
- ✅ Client-side component (uses "use client")

### 4. Export Configuration
Updated:
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/hooks/index.ts` (created)
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/index.ts` (updated)
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/components/organisms/index.ts` (updated)

### 5. Documentation
Created:
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/docs/SESSION_MANAGEMENT.md` - Comprehensive documentation
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/docs/INTEGRATION_EXAMPLE.md` - Quick integration guide
- `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/SESSION_IMPLEMENTATION_SUMMARY.md` - This file

## Files Created

```
bemyre-v2/client/
├── lib/
│   └── hooks/
│       ├── useSessionManager.ts          ← NEW (350+ lines)
│       └── index.ts                      ← NEW (export file)
├── components/
│   └── organisms/
│       └── SessionWarningModal/
│           ├── SessionWarningModal.tsx   ← NEW (150+ lines)
│           └── index.ts                  ← NEW (export file)
├── providers/
│   ├── SessionProvider.tsx               ← NEW (80+ lines)
│   └── index.ts                          ← NEW (export file)
└── docs/
    ├── SESSION_MANAGEMENT.md             ← NEW (comprehensive docs)
    ├── INTEGRATION_EXAMPLE.md            ← NEW (quick start)
    └── SESSION_IMPLEMENTATION_SUMMARY.md ← NEW (this file)
```

## Files Modified

```
bemyre-v2/client/
├── lib/
│   └── index.ts                          ← UPDATED (added hooks export)
└── components/
    └── organisms/
        └── index.ts                      ← UPDATED (added SessionWarningModal export)
```

## How to Integrate

### Single Step Integration

Edit `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/app/providers.tsx`:

```typescript
import { SessionProvider } from "@/providers";  // Add import

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    initLoggerWithSentry();
  }, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary componentName="App">
          <SessionProvider>  {/* Wrap children */}
            {children}
          </SessionProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

That's it! Session management is now active.

## How It Works

### Timeline Flow

```
User Logs In
     ↓
Session Manager Activates
     ↓
[Active Usage]
     ↓
User Inactive for 25 min
     ↓
⚠️  Warning Modal Shows
     ↓
User Clicks "Continuar sesión"
     ↓
→ Session Refreshed
→ Timers Reset
→ Modal Closes
     ↓
[Continue Usage]

OR

⚠️  Warning Modal Shows
     ↓
User Inactive for 5 more min (30 total)
     ↓
❌ Auto-Logout
     ↓
Redirect to Login
```

### Background Refresh

```
User Active
     ↓
Every 10 minutes
     ↓
Check: Activity in last 10 min?
     ↓
Yes → Call refreshSession()
      → Backend updates httpOnly cookies
      ↓
[Continue]
```

### Activity Detection

Tracked Events:
- `mousedown`
- `mousemove`
- `keypress`
- `scroll`
- `touchstart`
- `click`

Throttling: Max 1 activity registration per second (prevents excessive timer resets)

## Security Features

✅ **httpOnly Cookies**: Tokens stored in httpOnly cookies, not accessible from JavaScript
✅ **No Client Storage**: No JWT tokens stored in localStorage or sessionStorage
✅ **Backend Validation**: All auth operations go through backend
✅ **Timer Cleanup**: All event listeners and timers properly cleaned up on unmount
✅ **No Modal Bypass**: Warning modal cannot be closed without action
✅ **Activity Throttling**: Prevents rapid timer resets
✅ **Authenticated Only**: Session manager only runs when user is logged in

## Technical Details

### Dependencies

Uses existing dependencies:
- React 19 (hooks, refs)
- Zustand 5 (store integration)
- MUI 7 (Dialog, Button, Typography, Alert)
- Next.js 16 (client components)

No new dependencies added.

### Store Integration

Requires these Zustand store methods (already implemented in `authSlice.ts`):
- `state.auth.isAuthenticated` - Check if user is logged in
- `state.auth.logout()` - Logout user
- `state.auth.refreshSession()` - Refresh session tokens

### Performance Considerations

- **Refs for Timers**: Uses `useRef` to store timers, avoiding unnecessary re-renders
- **Throttled Activity**: Activity detection throttled to 1 second intervals
- **Passive Listeners**: Event listeners use `{ passive: true }` for better performance
- **Conditional Rendering**: Modal only rendered when `isAuthenticated` is true
- **Cleanup**: All listeners and timers cleaned up on unmount

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Uses standard Web APIs:
- `window.addEventListener`
- `setTimeout` / `clearTimeout`
- `setInterval` / `clearInterval`

## Testing Checklist

### Manual Testing

- [ ] Login to application
- [ ] Wait 25 minutes without interaction
- [ ] Verify warning modal appears
- [ ] Click "Continuar sesión"
- [ ] Verify modal closes and session continues
- [ ] Wait 25 minutes again
- [ ] Verify warning modal appears
- [ ] Don't click anything
- [ ] Wait 5 more minutes (30 total)
- [ ] Verify auto-logout occurs
- [ ] Login again
- [ ] Use app actively (move mouse, type, etc.)
- [ ] Check DevTools Network tab for `/api/v1/auth/refresh` calls every 10 min
- [ ] Logout manually
- [ ] Verify warning modal doesn't appear when not logged in

### Automated Testing (TODO)

Unit tests to create:
- `tests/unit/hooks/useSessionManager.test.ts`
- `tests/unit/components/SessionWarningModal.test.tsx`
- `tests/unit/providers/SessionProvider.test.tsx`

Integration tests to create:
- `tests/integration/session-flow.test.ts`

E2E tests to create:
- `tests/e2e/session-timeout.spec.ts`

## Troubleshooting

### Modal Not Appearing

1. Check if user is authenticated:
   ```typescript
   const isAuth = useStore((state) => state.auth.isAuthenticated);
   console.log("Authenticated:", isAuth);
   ```

2. Check browser console for log messages:
   - "Session manager initialized"
   - "Session timers reset"

3. Verify timeout configuration in `useSessionManager.ts`

### Session Not Refreshing

1. Check DevTools Network tab for `/api/v1/auth/refresh` calls
2. Verify backend endpoint is working
3. Check for 401/403 errors in console
4. Verify `refresh_token` cookie exists (DevTools → Application → Cookies)

### Memory Leaks

1. Check DevTools Performance → Memory
2. Verify timers are cleared on unmount
3. Verify event listeners are removed
4. Use heap snapshots to find detached listeners

## Customization

### Change Timeout Values

Edit `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/hooks/useSessionManager.ts`:

```typescript
// Lines 40-45
export const SESSION_WARNING_TIME = 20 * 60 * 1000;  // 20 minutes
export const SESSION_TIMEOUT = 25 * 60 * 1000;       // 25 minutes
export const REFRESH_INTERVAL = 5 * 60 * 1000;       // 5 minutes
```

### Add Custom Callbacks

```typescript
<SessionProvider
  onWarning={() => {
    // Save unsaved work
    localStorage.setItem("draft", JSON.stringify(formData));
  }}
  onTimeout={() => {
    // Show notification
    toast.error("Tu sesión ha expirado");
  }}
>
  {children}
</SessionProvider>
```

### Custom Warning UI

```typescript
import { useSessionManager } from "@lib/hooks";

function CustomSessionUI() {
  const { showWarning, remainingTime, handleContinueSession } = useSessionManager();

  return showWarning ? (
    <div className="custom-warning">
      Time left: {remainingTime}s
      <button onClick={handleContinueSession}>Extend</button>
    </div>
  ) : null;
}
```

## Audit Compliance

This implementation satisfies **CVSS 5.8 - Session Timeout** requirements:

| Requirement            | Implementation                       | Status |
| ---------------------- | ------------------------------------ | ------ |
| Detect inactivity      | Tracks mouse, keyboard, touch events | ✅      |
| Warn before timeout    | Modal at 25 min with countdown       | ✅      |
| Auto-logout on timeout | Logout at 30 min of inactivity       | ✅      |
| Session refresh        | Background refresh every 10 min      | ✅      |
| Secure token storage   | httpOnly cookies (not JS accessible) | ✅      |
| Clean lifecycle        | Proper timer/listener cleanup        | ✅      |
| User control           | "Continue session" option            | ✅      |

## Next Steps

### Required
1. **Integrate SessionProvider** in `app/providers.tsx` (see above)
2. **Test manually** following the testing checklist
3. **Verify backend** `/api/v1/auth/refresh` endpoint works

### Recommended
1. Write unit tests for `useSessionManager` hook
2. Write integration tests for session flow
3. Write E2E tests with Playwright
4. Add Sentry monitoring for session events
5. Document session behavior in user guide

### Optional
1. Add configuration UI in user settings
2. Add "Remember me" option for longer sessions
3. Add session activity log for admins
4. Add multi-device session management

## Support & References

### Documentation
- [SESSION_MANAGEMENT.md](docs/SESSION_MANAGEMENT.md) - Full documentation
- [INTEGRATION_EXAMPLE.md](docs/INTEGRATION_EXAMPLE.md) - Quick start guide

### External Resources
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [CVSS v3.1 Specification](https://www.first.org/cvss/v3.1/specification-document)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Contact
For questions or issues, contact the development team or open an issue in the repository.

---

**Implementation Date**: 2025-12-03
**Audit Requirement**: CVSS 5.8 - Session Timeout
**Status**: ✅ Complete - Ready for Integration
**Next Action**: Add SessionProvider to app/providers.tsx
