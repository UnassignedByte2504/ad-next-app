import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "./SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "Molecules/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Section header with title, optional subtitle, and action link. Used to introduce content sections.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
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
    showDivider: {
      control: "boolean",
      description: "Show decorative divider line",
    },
    animate: {
      control: "boolean",
      description: "Animate on scroll into view",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

/**
 * Default section header with title only.
 */
export const Default: Story = {
  args: {
    title: "Conciertos en tu zona",
  },
};

/**
 * With subtitle description.
 */
export const WithSubtitle: Story = {
  args: {
    title: "Contacta con músicos",
    subtitle: "Encuentra colaboradores cerca de ti y forma parte de la escena local",
  },
};

/**
 * With "View all" action link.
 */
export const WithAction: Story = {
  args: {
    title: "Locales con música en vivo",
    subtitle: "Descubre los mejores sitios para tocar y disfrutar de música",
    actionText: "Ver todos",
    actionHref: "/venues",
  },
};

/**
 * Small size - for compact sections.
 */
export const Small: Story = {
  args: {
    title: "Géneros populares",
    actionText: "Ver más",
    actionHref: "/genres",
    size: "sm",
  },
};

/**
 * Large size - for prominent sections.
 */
export const Large: Story = {
  args: {
    title: "Bandas de música",
    subtitle: "Explora bandas en busca de nuevos miembros o forma la tuya propia",
    actionText: "Explorar bandas",
    actionHref: "/bands",
    size: "lg",
  },
};

/**
 * Center aligned header.
 */
export const Centered: Story = {
  args: {
    title: "Descubre músicos cerca de ti",
    subtitle: "Miles de artistas te están esperando",
    size: "lg",
    align: "center",
  },
};

/**
 * With decorative divider.
 */
export const WithDivider: Story = {
  args: {
    title: "Nuestros servicios",
    subtitle: "Todo lo que necesitas para conectar con la comunidad musical",
    showDivider: true,
    align: "center",
    size: "lg",
  },
};

/**
 * Right aligned header.
 */
export const RightAligned: Story = {
  args: {
    title: "Actividad reciente",
    actionText: "Ver historial",
    actionHref: "/activity",
    align: "right",
  },
};

/**
 * Without animation.
 */
export const NoAnimation: Story = {
  args: {
    title: "Músicos destacados",
    subtitle: "Los perfiles más activos de esta semana",
    actionText: "Ver ranking",
    actionHref: "/ranking",
    animate: false,
  },
};

/**
 * Multiple headers in context.
 */
export const MultipleInContext: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <SectionHeader
          title="Conciertos en tu zona"
          subtitle="Madrid esta semana"
          actionText="Ver todos"
          actionHref="/concerts"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginTop: "-0.5rem",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "150px",
                background: "#333",
                borderRadius: "12px",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          title="Contacta con músicos"
          actionText="Ver todos"
          actionHref="/musicians"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginTop: "-0.5rem",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "150px",
                background: "#333",
                borderRadius: "12px",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          title="Bandas de música"
          subtitle="Grupos buscando miembros"
          actionText="Explorar"
          actionHref="/bands"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginTop: "-0.5rem",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: "120px",
                background: "#333",
                borderRadius: "12px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};
