import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Carousel, type CarouselItem } from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Organisms/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Image/content carousel with auto-play, swipe gestures, and navigation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    autoPlay: {
      control: { type: "number", min: 0, max: 10000, step: 500 },
      description: "Auto-play interval in milliseconds (0 to disable)",
    },
    showArrows: {
      control: "boolean",
    },
    showDots: {
      control: "boolean",
    },
    swipeable: {
      control: "boolean",
    },
    loop: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 600, bgcolor: "background.paper", borderRadius: 3 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// Sample slide component
const Slide = ({
  title,
  color,
  image,
}: {
  title: string;
  color: string;
  image?: string;
}) => (
  <Box
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: color,
      backgroundImage: image ? `url(${image})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    }}
  >
    {!image && (
      <Typography variant="h4" fontWeight={700} color="white">
        {title}
      </Typography>
    )}
    {image && (
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          left: 24,
          bgcolor: "rgba(0, 0, 0, 0.6)",
          px: 3,
          py: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="white">
          {title}
        </Typography>
      </Box>
    )}
  </Box>
);

// Sample items
const colorSlides: CarouselItem[] = [
  {
    id: "1",
    content: <Slide title="Slide 1" color="#F15640" />,
  },
  {
    id: "2",
    content: <Slide title="Slide 2" color="#FFA151" />,
  },
  {
    id: "3",
    content: <Slide title="Slide 3" color="#14B8A6" />,
  },
  {
    id: "4",
    content: <Slide title="Slide 4" color="#6366F1" />,
  },
];

const imageSlides: CarouselItem[] = [
  {
    id: "concert-1",
    content: (
      <Slide
        title="Rock en Madrid"
        color="#000"
        image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"
      />
    ),
  },
  {
    id: "concert-2",
    content: (
      <Slide
        title="Jazz Night"
        color="#000"
        image="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800"
      />
    ),
  },
  {
    id: "concert-3",
    content: (
      <Slide
        title="Festival de Verano"
        color="#000"
        image="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800"
      />
    ),
  },
];

/**
 * Default carousel with color slides.
 */
export const Default: Story = {
  args: {
    items: colorSlides,
  },
};

/**
 * With auto-play.
 */
export const AutoPlay: Story = {
  args: {
    items: colorSlides,
    autoPlay: 3000,
  },
};

/**
 * Without arrows.
 */
export const NoArrows: Story = {
  args: {
    items: colorSlides,
    showArrows: false,
  },
};

/**
 * Without dots.
 */
export const NoDots: Story = {
  args: {
    items: colorSlides,
    showDots: false,
  },
};

/**
 * Without loop.
 */
export const NoLoop: Story = {
  args: {
    items: colorSlides,
    loop: false,
  },
};

/**
 * Not swipeable.
 */
export const NotSwipeable: Story = {
  args: {
    items: colorSlides,
    swipeable: false,
  },
};

/**
 * With images.
 */
export const WithImages: Story = {
  args: {
    items: imageSlides,
    autoPlay: 5000,
  },
};

/**
 * Minimal (no arrows, no dots).
 */
export const Minimal: Story = {
  args: {
    items: imageSlides,
    showArrows: false,
    showDots: false,
    autoPlay: 4000,
  },
};

/**
 * Single item.
 */
export const SingleItem: Story = {
  args: {
    items: [colorSlides[0]],
  },
};

/**
 * Two items.
 */
export const TwoItems: Story = {
  args: {
    items: colorSlides.slice(0, 2),
  },
};

/**
 * Custom content.
 */
export const CustomContent: Story = {
  args: {
    items: [
      {
        id: "custom-1",
        content: (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
              p: 4,
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Únete a Bemyre
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Conecta con miles de músicos y encuentra tu próxima banda
            </Typography>
          </Box>
        ),
      },
      {
        id: "custom-2",
        content: (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #F15640 0%, #FFA151 100%)",
              p: 4,
            }}
          >
            <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
              +10,000 músicos
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.9)" textAlign="center">
              Ya están conectando en nuestra plataforma
            </Typography>
          </Box>
        ),
      },
    ],
  },
};
