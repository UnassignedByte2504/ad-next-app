import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import { ChatDateDivider } from "./ChatDateDivider";

const meta: Meta<typeof ChatDateDivider> = {
  title: "Atoms/ChatDateDivider",
  component: ChatDateDivider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Date separator for chat conversations with smart date formatting.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Box sx={{ width: 400, p: 2, bgcolor: "background.paper" }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatDateDivider>;

/**
 * Today's date.
 */
export const Today: Story = {
  args: {
    date: new Date(),
  },
};

/**
 * Yesterday's date.
 */
export const Yesterday: Story = {
  args: {
    date: new Date(Date.now() - 86400000),
  },
};

/**
 * Date within current year.
 */
export const ThisYear: Story = {
  args: {
    date: new Date(2025, 5, 15), // June 15, 2025
  },
};

/**
 * Date from previous year.
 */
export const PreviousYear: Story = {
  args: {
    date: new Date(2024, 11, 25), // December 25, 2024
  },
};

/**
 * Multiple dividers in a chat context.
 */
export const InContext: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <ChatDateDivider date={new Date(2024, 11, 20)} />
      <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
        ... messages from Dec 20 ...
      </Box>
      <ChatDateDivider date={new Date(Date.now() - 86400000)} />
      <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
        ... yesterday's messages ...
      </Box>
      <ChatDateDivider date={new Date()} />
      <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
        ... today's messages ...
      </Box>
    </Box>
  ),
};
