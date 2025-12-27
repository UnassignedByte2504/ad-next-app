"use client";

import { forwardRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import { primary, neutral, springs } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

export interface FAQAccordionProps {
  /** FAQ items or categories */
  items: FAQItem[] | FAQCategory[];
  /** Whether items are grouped by category */
  grouped?: boolean;
  /** Show search input */
  searchable?: boolean;
  /** Allow multiple items to be expanded */
  allowMultiple?: boolean;
  /** Default expanded item ID */
  defaultExpanded?: string;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

// =============================================================================
// HELPERS
// =============================================================================

function isCategory(item: FAQItem | FAQCategory): item is FAQCategory {
  return "items" in item;
}

function filterItems(items: FAQItem[], query: string): FAQItem[] {
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.question.toLowerCase().includes(lowerQuery) ||
      item.answer.toLowerCase().includes(lowerQuery)
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * FAQAccordion - Frequently Asked Questions accordion component.
 *
 * Features:
 * - Grouped or flat question lists
 * - Search/filter functionality
 * - Single or multiple expansion
 * - Animated transitions
 * - Accessible ARIA attributes
 *
 * @example
 * ```tsx
 * <FAQAccordion
 *   items={[
 *     { id: "1", question: "What is Ayla Designs?", answer: "A digital products e-commerce..." },
 *     { id: "2", question: "How do I join?", answer: "Simply create an account..." },
 *   ]}
 *   searchable
 * />
 * ```
 */
export const FAQAccordion = forwardRef<HTMLDivElement, FAQAccordionProps>(
  (
    {
      items,
      grouped = false,
      searchable = false,
      allowMultiple = false,
      defaultExpanded,
      className,
    },
    ref
  ) => {
    const t = useTranslations("Components.faqAccordion");
    const [expanded, setExpanded] = useState<string | string[]>(
      allowMultiple ? (defaultExpanded ? [defaultExpanded] : []) : (defaultExpanded || "")
    );
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (panelId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      if (allowMultiple) {
        setExpanded((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return isExpanded
            ? [...prevArray, panelId]
            : prevArray.filter((id) => id !== panelId);
        });
      } else {
        setExpanded(isExpanded ? panelId : "");
      }
    };

    const isExpanded = (panelId: string): boolean => {
      if (allowMultiple) {
        return Array.isArray(expanded) && expanded.includes(panelId);
      }
      return expanded === panelId;
    };

    // Get flat items for search
    const allItems: FAQItem[] = grouped
      ? (items as FAQCategory[]).flatMap((cat) => cat.items)
      : (items as FAQItem[]);

    const filteredItems = searchQuery ? filterItems(allItems, searchQuery) : null;

    // Render a single FAQ item
    const renderItem = (item: FAQItem, index: number) => (
      <MotionBox
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.smooth, delay: index * 0.03 }}
      >
        <Accordion
          expanded={isExpanded(item.id)}
          onChange={handleChange(item.id)}
          sx={{
            bgcolor: "transparent",
            boxShadow: "none",
            "&:before": { display: "none" },
            "&.Mui-expanded": {
              margin: 0,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`faq-${item.id}-content`}
            id={`faq-${item.id}-header`}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: neutral[850],
              mb: 1,
              "&:hover": {
                bgcolor: neutral[800],
              },
              "&.Mui-expanded": {
                bgcolor: `${primary.main}15`,
              },
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={isExpanded(item.id) ? 600 : 500}
              sx={{
                color: isExpanded(item.id) ? primary.main : "text.primary",
              }}
            >
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, py: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </MotionBox>
    );

    return (
      <Box ref={ref} className={className}>
        {/* Search input */}
        {searchable && (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {/* Search results */}
        {searchQuery && filteredItems && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("searchResults", { count: filteredItems.length })}
            </Typography>
          </Box>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {searchQuery && filteredItems ? (
            // Filtered results
            <MotionBox
              key="filtered"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => renderItem(item, index))
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  {t("noResults")}
                </Typography>
              )}
            </MotionBox>
          ) : grouped ? (
            // Grouped categories
            <MotionBox key="grouped">
              {(items as FAQCategory[]).map((category, catIndex) => (
                <Box key={category.id} sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2, color: primary.main }}
                  >
                    {category.title}
                  </Typography>
                  {category.items.map((item, index) =>
                    renderItem(item, catIndex * 10 + index)
                  )}
                </Box>
              ))}
            </MotionBox>
          ) : (
            // Flat list
            <MotionBox key="flat">
              {(items as FAQItem[]).map((item, index) => renderItem(item, index))}
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    );
  }
);

FAQAccordion.displayName = "FAQAccordion";

export default FAQAccordion;
