import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import { MessageBubble } from "./MessageBubble";

const meta: Meta<typeof MessageBubble> = {
  title: "Atoms/MessageBubble",
  component: MessageBubble,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Chat message bubble component with support for incoming/outgoing messages, status indicators, and avatars.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "radio",
      options: ["incoming", "outgoing"],
      description: "Direction of the message",
    },
    status: {
      control: "select",
      options: ["sending", "sent", "delivered", "read"],
      description: "Message status (for outgoing messages)",
    },
    showAvatar: {
      control: "boolean",
      description: "Show avatar",
    },
    showTimestamp: {
      control: "boolean",
      description: "Show timestamp",
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
type Story = StoryObj<typeof MessageBubble>;

/**
 * Incoming message from another user.
 */
export const Incoming: Story = {
  args: {
    content: "Hey! Are you free to jam this weekend?",
    timestamp: new Date(),
    direction: "incoming",
    senderName: "Carlos García",
    avatar: "https://i.pravatar.cc/150?u=carlos",
  },
};

/**
 * Outgoing message sent by the current user.
 */
export const Outgoing: Story = {
  args: {
    content: "Sure! Saturday afternoon works for me. What time?",
    timestamp: new Date(),
    direction: "outgoing",
    status: "read",
  },
};

/**
 * Message being sent.
 */
export const Sending: Story = {
  args: {
    content: "Let me check my schedule...",
    timestamp: new Date(),
    direction: "outgoing",
    status: "sending",
  },
};

/**
 * Message sent but not yet delivered.
 */
export const Sent: Story = {
  args: {
    content: "I'll bring my guitar and amp.",
    timestamp: new Date(),
    direction: "outgoing",
    status: "sent",
  },
};

/**
 * Message delivered but not yet read.
 */
export const Delivered: Story = {
  args: {
    content: "Cool! See you then.",
    timestamp: new Date(),
    direction: "outgoing",
    status: "delivered",
  },
};

/**
 * Message read by the recipient.
 */
export const Read: Story = {
  args: {
    content: "Perfect! Can't wait to hear those new riffs.",
    timestamp: new Date(),
    direction: "outgoing",
    status: "read",
  },
};

/**
 * Long message with text wrapping.
 */
export const LongMessage: Story = {
  args: {
    content:
      "Hey! I've been working on some new material for our band. I think we should try a heavier sound for the next album. What do you think about incorporating some prog metal elements? I've been listening to a lot of Dream Theater and Opeth lately and they've been a huge inspiration.",
    timestamp: new Date(),
    direction: "incoming",
    senderName: "Ana Martínez",
    avatar: "https://i.pravatar.cc/150?u=ana",
  },
};

/**
 * Message without avatar.
 */
export const NoAvatar: Story = {
  args: {
    content: "Quick message without avatar",
    timestamp: new Date(),
    direction: "incoming",
    senderName: "Pedro López",
    showAvatar: false,
  },
};

/**
 * Message without timestamp.
 */
export const NoTimestamp: Story = {
  args: {
    content: "Message without timestamp",
    timestamp: new Date(),
    direction: "outgoing",
    showTimestamp: false,
  },
};

/**
 * Conversation flow example.
 */
export const Conversation: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <MessageBubble
        content="Hey! Are you coming to rehearsal tonight?"
        timestamp={new Date(Date.now() - 3600000)}
        direction="incoming"
        senderName="Carlos García"
        avatar="https://i.pravatar.cc/150?u=carlos"
      />
      <MessageBubble
        content="Yeah, I'll be there around 7pm"
        timestamp={new Date(Date.now() - 3000000)}
        direction="outgoing"
        status="read"
      />
      <MessageBubble
        content="Great! Don't forget to bring the new setlist"
        timestamp={new Date(Date.now() - 2400000)}
        direction="incoming"
        senderName="Carlos García"
        avatar="https://i.pravatar.cc/150?u=carlos"
      />
      <MessageBubble
        content="Got it! Also bringing some new pedals to try out 🎸"
        timestamp={new Date()}
        direction="outgoing"
        status="delivered"
      />
    </Box>
  ),
};
