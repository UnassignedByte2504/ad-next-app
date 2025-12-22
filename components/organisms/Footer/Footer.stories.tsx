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
          "Site footer with navigation columns, social links, and legal information. Follows M3 Expressive design guidelines.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showLogo: {
      control: "boolean",
      description: "Show the Bemyre logo",
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
 * Default footer with all navigation columns and social links.
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
 * Footer with custom social links.
 */
export const CustomSocialLinks: Story = {
  args: {
    socialLinks: [
      { platform: "instagram", href: "https://instagram.com/bemyre" },
      { platform: "x", href: "https://x.com/bemyre" },
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
 * Footer in context with dark background.
 */
export const InDarkContext: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "50vh",
          background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
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
