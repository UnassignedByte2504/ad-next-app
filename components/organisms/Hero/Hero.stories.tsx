import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "./Hero";

const meta: Meta<typeof Hero> = {
  title: "Organisms/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-width hero section with background image/video, headline, and call-to-action buttons. Follows M3 Expressive design guidelines.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    headline: {
      control: "text",
      description: "Main headline text",
    },
    subheadline: {
      control: "text",
      description: "Secondary text below headline",
    },
    ctaText: {
      control: "text",
      description: "Primary CTA button text",
    },
    ctaHref: {
      control: "text",
      description: "Primary CTA button href",
    },
    overlay: {
      control: "select",
      options: ["none", "dark", "light", "gradient"],
      description: "Background overlay type",
    },
    height: {
      control: "select",
      options: ["full", "large", "medium", "small"],
      description: "Hero section height",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Content horizontal alignment",
    },
    verticalAlign: {
      control: "select",
      options: ["top", "center", "bottom"],
      description: "Content vertical alignment",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

// Sample concert background from Unsplash
const concertBg = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&q=80";
const musicianBg = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80";

/**
 * Default hero with all elements.
 */
export const Default: Story = {
  args: {
    headline: "Conoce la música en vivo de tu localidad y conecta con músicos",
    subheadline: "Descubre conciertos, encuentra bandas y colabora con artistas cerca de ti",
    ctaText: "Únete hoy",
    ctaHref: "/signup",
    secondaryCtaText: "Explorar",
    secondaryCtaHref: "/explore",
    backgroundImage: concertBg,
    overlay: "gradient",
    height: "large",
  },
};

/**
 * Hero with dark overlay.
 */
export const DarkOverlay: Story = {
  args: {
    headline: "Encuentra tu próxima banda",
    subheadline: "Conecta con músicos que comparten tu pasión",
    ctaText: "Comenzar",
    ctaHref: "/signup",
    backgroundImage: musicianBg,
    overlay: "dark",
    height: "large",
  },
};

/**
 * Hero with gradient overlay (default for landing).
 */
export const GradientOverlay: Story = {
  args: {
    headline: "La red social para músicos",
    subheadline: "Crea, colabora y comparte tu música con el mundo",
    ctaText: "Crear cuenta",
    ctaHref: "/signup",
    backgroundImage: concertBg,
    overlay: "gradient",
    height: "full",
  },
};

/**
 * Hero without background (for interior pages).
 */
export const NoBackground: Story = {
  args: {
    headline: "Bienvenido a Bemyre",
    subheadline: "Tu comunidad musical te espera",
    ctaText: "Explorar músicos",
    ctaHref: "/musicians",
    overlay: "none",
    height: "medium",
  },
};

/**
 * Hero with left-aligned content.
 */
export const LeftAligned: Story = {
  args: {
    headline: "Músicos en tu zona",
    subheadline: "Descubre talento local y forma parte de la escena",
    ctaText: "Ver músicos",
    ctaHref: "/musicians",
    backgroundImage: musicianBg,
    overlay: "dark",
    align: "left",
    height: "medium",
  },
};

/**
 * Hero with only headline.
 */
export const HeadlineOnly: Story = {
  args: {
    headline: "¿Dónde nos vamos a rockear?",
    backgroundImage: concertBg,
    overlay: "gradient",
    height: "medium",
  },
};

/**
 * Small hero for section headers.
 */
export const SmallHero: Story = {
  args: {
    headline: "Conciertos en Madrid",
    subheadline: "Estos son los eventos de esta semana",
    backgroundImage: concertBg,
    overlay: "dark",
    height: "small",
  },
};

/**
 * Hero with single CTA.
 */
export const SingleCta: Story = {
  args: {
    headline: "¿Eres músico?",
    subheadline: "Únete a miles de músicos que ya están conectando",
    ctaText: "Crear perfil gratis",
    ctaHref: "/signup",
    backgroundImage: musicianBg,
    overlay: "gradient",
    height: "large",
  },
};

/**
 * Hero with content at bottom.
 */
export const BottomAligned: Story = {
  args: {
    headline: "Descubre tu sonido",
    subheadline: "Miles de músicos te están esperando",
    ctaText: "Explorar",
    ctaHref: "/explore",
    backgroundImage: concertBg,
    overlay: "gradient",
    height: "full",
    verticalAlign: "bottom",
  },
};
