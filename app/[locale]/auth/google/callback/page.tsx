/**
 * Google OAuth Callback Page
 *
 * Esta página maneja el callback de Google OAuth.
 * Procesa el código de autorización y completa el login.
 *
 * NOTE: This is a server component wrapper that forces dynamic rendering.
 * The actual callback logic is in the GoogleCallbackClient component.
 */

// Force dynamic rendering - this page handles OAuth callbacks and cannot be pre-rendered
export const dynamic = "force-dynamic";

import GoogleCallbackClient from "./GoogleCallbackClient";

export default function GoogleCallbackPage() {
  return <GoogleCallbackClient />;
}
