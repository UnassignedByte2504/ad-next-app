import { HomeContent } from "./HomeContent";

/**
 * Home Page - Server Component
 *
 * Landing page for Ayla Designs.
 * Server-rendered wrapper that delegates to HomeContent client component.
 */
export default function Home() {
  return <HomeContent />;
}
