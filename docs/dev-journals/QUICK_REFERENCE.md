# Session Management - Quick Reference Card

## File Paths

All files use absolute paths from: `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/`

### Created Files

```
lib/hooks/useSessionManager.ts
lib/hooks/index.ts
components/organisms/SessionWarningModal/SessionWarningModal.tsx
components/organisms/SessionWarningModal/index.ts
providers/SessionProvider.tsx
providers/index.ts
docs/SESSION_MANAGEMENT.md
docs/INTEGRATION_EXAMPLE.md
SESSION_IMPLEMENTATION_SUMMARY.md
SESSION_FILES_STRUCTURE.txt
QUICK_REFERENCE.md (this file)
```

### Modified Files

```
lib/index.ts
components/organisms/index.ts
```

### Integration Required

```
app/providers.tsx  ← Add <SessionProvider> here
```

## Integration (Copy-Paste)

Add to `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/app/providers.tsx`:

```typescript
// 1. Add import at top
import { SessionProvider } from "@/providers";

// 2. Wrap children with SessionProvider
export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    initLoggerWithSentry();
  }, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary componentName="App">
          <SessionProvider>
            {children}
          </SessionProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

## Configuration Values

Edit `/home/nexus/workspace/bemyre/bemyre/bemyre-v2/client/lib/hooks/useSessionManager.ts`:

```typescript
// Lines 40-45
export const SESSION_WARNING_TIME = 25 * 60 * 1000;  // Change here
export const SESSION_TIMEOUT = 30 * 60 * 1000;       // Change here
export const REFRESH_INTERVAL = 10 * 60 * 1000;      // Change here
```

## Import Paths

```typescript
// Hook
import { useSessionManager } from "@lib/hooks";

// Component
import { SessionWarningModal } from "@organisms";

// Provider
import { SessionProvider } from "@/providers";

// Constants
import { SESSION_WARNING_TIME, SESSION_TIMEOUT, REFRESH_INTERVAL } from "@lib/hooks";
```

## TypeScript Types

```typescript
import type {
  SessionManagerOptions,
  SessionManagerReturn,
  SessionWarningModalProps,
  SessionProviderProps,
} from "@lib/hooks" | "@organisms" | "@/providers";
```

## Testing Commands

```bash
# TypeScript check
cd /home/nexus/workspace/bemyre/bemyre/bemyre-v2/client
pnpm exec tsc --noEmit

# Run dev server
pnpm dev

# Run tests (when created)
pnpm test
pnpm test:e2e
```

## Verification Checklist

After integration:

- [ ] No TypeScript errors
- [ ] App compiles successfully
- [ ] Can login to app
- [ ] Session manager initializes (check console)
- [ ] Warning modal appears after 25 min inactivity
- [ ] Auto-logout happens after 30 min inactivity
- [ ] Session refreshes every 10 min when active
- [ ] No memory leaks (check DevTools Performance)

## Troubleshooting Quick Fixes

### Modal not appearing
```typescript
// Check authentication
const isAuth = useStore((state) => state.auth.isAuthenticated);
console.log("Auth:", isAuth);
```

### Not refreshing
```typescript
// Check refresh method exists
const refresh = useStore((state) => state.auth.refreshSession);
console.log("Has refresh:", typeof refresh === "function");
```

### Timer issues
```typescript
// Temporarily reduce timeout for testing
// In useSessionManager.ts, change:
export const SESSION_WARNING_TIME = 1 * 60 * 1000;  // 1 minute for testing
export const SESSION_TIMEOUT = 2 * 60 * 1000;       // 2 minutes for testing
```

## Key Features Summary

- Tracks: mousedown, mousemove, keypress, scroll, touchstart, click
- Warns: After 25 min inactivity
- Logouts: After 30 min inactivity
- Refreshes: Every 10 min if active
- Security: httpOnly cookies, no client storage
- UI: Spanish language, MUI Dialog
- Performance: Refs for timers, throttled activity, passive listeners

## Documentation Links

- Full docs: `docs/SESSION_MANAGEMENT.md`
- Quick start: `docs/INTEGRATION_EXAMPLE.md`
- Summary: `SESSION_IMPLEMENTATION_SUMMARY.md`
- Structure: `SESSION_FILES_STRUCTURE.txt`

## Support

For issues:
1. Check browser console logs
2. Check DevTools Network tab
3. Review troubleshooting section in SESSION_MANAGEMENT.md
4. Check backend logs for auth errors

## CVSS 5.8 Compliance

Status: COMPLETE
- Inactivity detection
- Warning before timeout
- Auto-logout
- Session refresh
- Secure storage
- Clean lifecycle
