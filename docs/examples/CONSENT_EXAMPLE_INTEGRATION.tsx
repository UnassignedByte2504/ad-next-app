/**
 * Example: How to integrate ConsentBanner into your app layout
 *
 * Copy this code to app/layout.tsx
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { ConsentBanner } from "@organisms"; // ADD THIS IMPORT
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bemyre - Red Social para Músicos",
  description: "Conecta con músicos, bandas y locales de tu zona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}

          {/* ADD CONSENT BANNER HERE - Will appear on all pages */}
          <ConsentBanner />
        </Providers>
      </body>
    </html>
  );
}

/**
 * Alternative: Add to specific pages only
 *
 * If you only want the banner on certain pages,
 * add it to those page components instead of the root layout
 */

// app/page.tsx
import { ConsentBanner } from "@organisms";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Bemyre</h1>
      {/* Your page content */}

      {/* Consent banner for this page only */}
      <ConsentBanner />
    </main>
  );
}

/**
 * Example: Settings page with consent management
 */

// app/settings/cookies/page.tsx
"use client";

import { useConsentActions, useConsentPreferences } from "@store";
import { Button, Stack, Typography, Paper, Switch } from "@mui/material";

export default function CookieSettingsPage() {
  const preferences = useConsentPreferences();
  const { updateConsent, resetConsent, showBanner } = useConsentActions();

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Configuración de Cookies
      </Typography>

      <Stack spacing={3} sx={{ mt: 3 }}>
        {/* Display current preferences */}
        <div>
          <Typography variant="h6">Preferencias Actuales</Typography>
          <Typography>Analytics: {preferences.analytics ? "✓" : "✗"}</Typography>
          <Typography>Marketing: {preferences.marketing ? "✓" : "✗"}</Typography>
          <Typography>Funcionales: {preferences.functional ? "✓" : "✗"}</Typography>
        </div>

        {/* Actions */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={showBanner}
          >
            Gestionar Cookies
          </Button>

          <Button
            variant="outlined"
            onClick={resetConsent}
            color="warning"
          >
            Restablecer
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

/**
 * Example: Conditional script loading based on consent
 */

// components/ConditionalAnalytics.tsx
"use client";

import { useConsentPreferences } from "@store";
import Script from "next/script";

export function ConditionalAnalytics() {
  const preferences = useConsentPreferences();

  // Only load if user has consented to analytics
  if (!preferences.analytics) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA-XXXXXX');
        `}
      </Script>

      {/* Hotjar */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:YOUR_ID,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
    </>
  );
}

/**
 * Example: Marketing pixels (only with marketing consent)
 */

// components/MarketingPixels.tsx
"use client";

import { useConsentPreferences } from "@store";
import Script from "next/script";

export function MarketingPixels() {
  const preferences = useConsentPreferences();

  // Only load if user has consented to marketing
  if (!preferences.marketing) {
    return null;
  }

  return (
    <>
      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'YOUR_PIXEL_ID');
          fbq('track', 'PageView');
        `}
      </Script>
    </>
  );
}

/**
 * Usage in app layout with all scripts
 */

// app/layout.tsx (full example)
import { ConsentBanner } from "@organisms";
import { ConditionalAnalytics } from "@/components/ConditionalAnalytics";
import { MarketingPixels } from "@/components/MarketingPixels";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}

          {/* Consent banner - appears on first visit */}
          <ConsentBanner />

          {/* Conditional scripts - only load with consent */}
          <ConditionalAnalytics />
          <MarketingPixels />
        </Providers>
      </body>
    </html>
  );
}
