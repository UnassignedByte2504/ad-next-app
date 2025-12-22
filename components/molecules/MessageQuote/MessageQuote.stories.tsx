import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import { MessageQuote } from "./MessageQuote";

const meta: Meta<typeof MessageQuote> = {
  title: "Molecules/MessageQuote",
  component: MessageQuote,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Quoted message reply component for displaying message references in chat.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOwnMessage: {
      control: "boolean",
      description: "Whether this is the current user's message being quoted",
    },
    showClose: {
      control: "boolean",
      description: "Show close button",
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 400, p: 2, bgcolor: "background.paper" }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MessageQuote>;

/**
 * Quote from another user.
 */
export const FromOther: Story = {
  args: {
    content: "Are you free this weekend for a jam session?",
    senderName: "Carlos García",
    onClose: () => console.log("Close quote"),
    onClick: () => console.log("Scroll to message"),
  },
};

/**
 * Quote from current user.
 */
export const FromSelf: Story = {
  args: {
    content: "I'll bring my guitar and amp!",
    senderName: "You",
    isOwnMessage: true,
    onClose: () => console.log("Close quote"),
    onClick: () => console.log("Scroll to message"),
  },
};

/**
 * Long message truncated.
 */
export const LongMessage: Story = {
  args: {
    content:
      "Hey! I've been working on some new material for our band. I think we should try a heavier sound for the next album. What do you think about incorporating some prog metal elements? I've been listening to a lot of Dream Theater and Opeth lately.",
    senderName: "Ana Martínez",
    onClose: () => console.log("Close quote"),
  },
};

/**
 * Without close button.
 */
export const NoCloseButton: Story = {
  args: {
    content: "Let's meet at the studio at 3pm",
    senderName: "Pedro López",
    showClose: false,
    onClick: () => console.log("Scroll to message"),
  },
};

/**
 * Without click handler (not clickable).
 */
export const NotClickable: Story = {
  args: {
    content: "Just a simple quote without interaction",
    senderName: "Laura Sánchez",
    showClose: false,
  },
};

/**
 * In input context - showing quote above message input.
 */
export const InInputContext: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <MessageQuote
        content="Are you free this weekend?"
        senderName="Carlos García"
        onClose={() => console.log("Close")}
      />
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "action.hover",
          color: "text.secondary",
          textAlign: "center",
        }}
      >
        [Message input field would go here]
      </Box>
    </Box>
  ),
};

/**
 * Multiple quotes stacked.
 */
export const MultipleQuotes: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <MessageQuote
        content="First quoted message"
        senderName="Carlos García"
        showClose={false}
        onClick={() => console.log("Go to first")}
      />
      <MessageQuote
        content="Second quoted message from yourself"
        senderName="You"
        isOwnMessage
        showClose={false}
        onClick={() => console.log("Go to second")}
      />
      <MessageQuote
        content="Third quoted message"
        senderName="Ana Martínez"
        showClose={false}
        onClick={() => console.log("Go to third")}
      />
    </Box>
  ),
};
