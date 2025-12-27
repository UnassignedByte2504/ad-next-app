import { routing } from "@/i18n/routing";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Nunito_Sans,
} from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Providers } from "../providers";

// Ayla Designs Typography
// Cormorant Garamond: Elegant serif for headings, titles, featured elements
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Nunito Sans: Rounded, friendly for body text and UI
const nunitoSans = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// JetBrains Mono: Monospace for prices, codes, technical data
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const metadata = (await import(`../../messages/${locale}/metadata.json`))
    .default;

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validar locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Habilitar static rendering
  setRequestLocale(locale);

  // Cargar mensajes para el locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${nunitoSans.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          fontFamily: "var(--font-body), 'Nunito Sans', system-ui, sans-serif",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
