import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Organisms/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Site footer with navigation columns, social links, and tagline. Features amber accent colors and dark background for Ayla Designs branding.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showLogo: {
      control: "boolean",
      description: "Show the Ayla Designs logo",
    },
    showTagline: {
      control: "boolean",
      description: "Show the tagline under the logo",
    },
    maxWidth: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", false],
      description: "Max width of container",
    },
    copyright: {
      control: "text",
      description: "Custom copyright text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

/**
 * Default footer with Products and Support columns, tagline, and social links.
 */
export const Default: Story = {
  args: {},
};

/**
 * Footer without logo.
 */
export const WithoutLogo: Story = {
  args: {
    showLogo: false,
  },
};

/**
 * Footer without tagline.
 */
export const WithoutTagline: Story = {
  args: {
    showTagline: false,
  },
};

/**
 * Footer with custom columns.
 */
export const CustomColumns: Story = {
  args: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "API", href: "/api" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Careers", href: "/careers" },
        ],
      },
    ],
  },
};

/**
 * Footer with all social links (Instagram, Pinterest, Etsy, Email).
 */
export const AllSocialLinks: Story = {
  args: {
    socialLinks: [
      { platform: "instagram", href: "https://instagram.com/ayladesigns" },
      { platform: "pinterest", href: "https://pinterest.com/ayladesigns" },
      { platform: "etsy", href: "https://etsy.com/shop/ayladesigns" },
      { platform: "email", href: "mailto:hello@ayladesigns.me" },
    ],
  },
};

/**
 * Footer with custom copyright text.
 */
export const CustomCopyright: Story = {
  args: {
    copyright: "Made with love in Madrid",
  },
};

/**
 * Narrow footer for smaller containers.
 */
export const NarrowWidth: Story = {
  args: {
    maxWidth: "md",
  },
};

/**
 * Footer in context - showing how it looks at page bottom.
 */
export const InPageContext: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "50vh",
          background: "linear-gradient(180deg, #FAFAF9 0%, #F5F5F4 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
