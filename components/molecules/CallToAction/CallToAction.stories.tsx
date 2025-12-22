import type { Meta, StoryObj } from "@storybook/react";
import { CallToAction } from "./CallToAction";

const meta: Meta<typeof CallToAction> = {
  title: "Molecules/CallToAction",
  component: CallToAction,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Promotional banner component with title, description, and action buttons. Multiple variants for different use cases.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "gradient", "outline", "subtle"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Content alignment",
    },
    fullWidth: {
      control: "boolean",
      description: "Use container for full width",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CallToAction>;

/**
 * Primary variant - main brand color.
 */
export const Primary: Story = {
  args: {
    title: "¿Eres músico?",
    description: "Conecta con melómanos como tú y forma tu propia banda",
    primaryText: "Crear perfil",
    primaryHref: "/signup",
    variant: "primary",
    size: "md",
  },
};

/**
 * Gradient variant - eye-catching promotional banner.
 */
export const Gradient: Story = {
  args: {
    title: "Únete a la comunidad",
    description: "Miles de músicos te están esperando. Crea tu perfil gratis y empieza a conectar.",
    primaryText: "Empezar ahora",
    primaryHref: "/signup",
    secondaryText: "Saber más",
    secondaryHref: "/about",
    variant: "gradient",
    size: "lg",
  },
};

/**
 * Secondary variant - amber accent color.
 */
export const Secondary: Story = {
  args: {
    title: "Hay 3 bandas que buscan guitarrista",
    description: "¡Únete a una de ellas!",
    primaryText: "Ver bandas",
    primaryHref: "/bands",
    variant: "secondary",
    size: "md",
  },
};

/**
 * Outline variant - minimal style.
 */
export const Outline: Story = {
  args: {
    title: "¿Necesitas ayuda?",
    description: "Consulta nuestras preguntas frecuentes o contacta con nosotros",
    primaryText: "Ver FAQ",
    primaryHref: "/faq",
    secondaryText: "Contactar",
    secondaryHref: "/contact",
    variant: "outline",
    size: "md",
  },
};

/**
 * Subtle variant - for in-content promotions.
 */
export const Subtle: Story = {
  args: {
    title: "Completa tu perfil",
    description: "Añade tus instrumentos y géneros para aparecer en las búsquedas",
    primaryText: "Editar perfil",
    primaryHref: "/profile/edit",
    variant: "subtle",
    size: "sm",
  },
};

/**
 * Small size - compact CTA.
 */
export const Small: Story = {
  args: {
    title: "¿Te gusta lo que ves?",
    primaryText: "Registrarse",
    primaryHref: "/signup",
    variant: "primary",
    size: "sm",
  },
};

/**
 * Large size - prominent CTA.
 */
export const Large: Story = {
  args: {
    title: "La red social para músicos",
    description: "Crea, colabora y comparte tu música con el mundo. Únete a miles de artistas que ya están conectando.",
    primaryText: "Crear cuenta gratis",
    primaryHref: "/signup",
    secondaryText: "Ver demo",
    secondaryHref: "/demo",
    variant: "gradient",
    size: "lg",
  },
};

/**
 * Left aligned content.
 */
export const LeftAligned: Story = {
  args: {
    title: "Descubre músicos cerca de ti",
    description: "Explora perfiles y encuentra colaboradores en tu zona",
    primaryText: "Explorar",
    primaryHref: "/explore",
    variant: "subtle",
    size: "md",
    align: "left",
  },
};

/**
 * Without description - title only.
 */
export const TitleOnly: Story = {
  args: {
    title: "¡Empieza tu viaje musical hoy!",
    primaryText: "Comenzar",
    primaryHref: "/signup",
    variant: "primary",
    size: "md",
  },
};

/**
 * Single CTA button.
 */
export const SingleButton: Story = {
  args: {
    title: "¿Listo para rockear?",
    description: "Únete a la comunidad de músicos más grande de España",
    primaryText: "Únete gratis",
    primaryHref: "/signup",
    variant: "gradient",
    size: "md",
  },
};

/**
 * Not full width - inline CTA.
 */
export const InlineNotFullWidth: Story = {
  args: {
    title: "Newsletter",
    description: "Recibe las últimas novedades",
    primaryText: "Suscribirse",
    primaryHref: "/newsletter",
    variant: "outline",
    size: "sm",
    fullWidth: false,
  },
};
