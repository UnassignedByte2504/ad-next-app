# SpainMap Bento Stage + Flashlight Design

## Overview

Enhance the SpainMap component with:
1. **Bento Stage Layout** - Mainland as main stage, islands in separate panels
2. **Flashlight Effect** - Teal spotlight that follows cursor across province paths

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         ┌─────────────────────────────┐                 │
│         │                             │    ┌─────────┐  │
│         │      MAINLAND               │    │Baleares │  │
│         │      (Main Stage)           │    │         │  │
│         │                             │    └─────────┘  │
│         │                             │                 │
│         └─────────────────────────────┘                 │
│                                                         │
│    ┌───────────────┐   ┌──────┐   ┌──────┐              │
│    │   Canarias    │   │Ceuta │   │Melilla│             │
│    │               │   │      │   │       │             │
│    └───────────────┘   └──────┘   └──────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Files to Create/Modify

```
components/molecules/SpainMap/
├── SpainMap.tsx              # Add flashlight effect to paths
├── SpainMapBento.tsx         # NEW - Bento layout container
├── RegionBox.tsx             # NEW - Individual region panel
├── regions.ts                # NEW - Region groupings & viewBoxes
├── provinces.ts              # Existing - add centroid data
└── index.ts                  # Update exports
```

### SpainMapBento.tsx (New)

Container component that:
- Arranges regions in Bento grid layout
- Passes shared state (selectedProvince, onSelect) to all regions
- Handles responsive layout

### RegionBox.tsx (New)

Individual panel component that:
- Wraps a SpainMap instance for a specific region
- Has subtle border styling (can optionally have flashlight border effect)
- Shows region label

### SpainMap.tsx (Enhanced)

Add flashlight effect:
- Track mouse position within SVG
- Calculate distance from cursor to each province centroid
- Apply teal glow (`drop-shadow`) based on proximity
- Glow intensity = `max(0, 1 - (distance / radius))`

## Flashlight Effect Details

### Color
- Teal: `#14B8A6` (accent color from theme)
- Creates contrast with coral selection highlight

### Implementation
```tsx
// Mouse tracking
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

// For each province, calculate glow
const getFlashlightGlow = (centroid: {x: number, y: number}) => {
  const distance = Math.sqrt(
    Math.pow(mousePos.x - centroid.x, 2) +
    Math.pow(mousePos.y - centroid.y, 2)
  );
  const intensity = Math.max(0, 1 - (distance / FLASHLIGHT_RADIUS));
  return intensity;
};

// Apply to path
<MotionPath
  style={{
    filter: flashlight
      ? `drop-shadow(0 0 ${intensity * 15}px rgba(20, 184, 166, ${intensity * 0.8}))`
      : undefined,
  }}
/>
```

### Props Added to SpainMap
```tsx
interface SpainMapProps {
  // ... existing props
  flashlight?: boolean;           // Enable flashlight effect
  flashlightColor?: string;       // Default: accent.main (#14B8A6)
  flashlightRadius?: number;      // Default: 150 (in SVG units)
}
```

## Region Data Structure

### regions.ts
```typescript
export interface Region {
  id: string;
  name: string;
  provinceIds: string[];
  viewBox: string;  // Calculated to fit just these provinces
}

export const regions: Region[] = [
  {
    id: 'mainland',
    name: 'Península',
    provinceIds: [...], // All except islands
    viewBox: '0 0 800 700',
  },
  {
    id: 'baleares',
    name: 'Islas Baleares',
    provinceIds: ['baleares'],
    viewBox: '850 250 150 150',
  },
  {
    id: 'canarias',
    name: 'Islas Canarias',
    provinceIds: ['las-palmas', 'santa-cruz-de-tenerife'],
    viewBox: '0 750 300 150',
  },
  {
    id: 'ceuta',
    name: 'Ceuta',
    provinceIds: ['ceuta'],
    viewBox: '...',
  },
  {
    id: 'melilla',
    name: 'Melilla',
    provinceIds: ['melilla'],
    viewBox: '...',
  },
];
```

## Responsive Behavior

- **Desktop**: Full Bento layout as shown
- **Tablet**: Mainland full width, islands in 2x2 grid below
- **Mobile**: Vertical stack - Mainland, then islands

## Animation Details

- Flashlight glow: CSS transition 150ms for smooth follow
- Province selection: Existing Framer Motion spring animation
- Hover scale: Existing 1.02 scale on hover

## Testing Plan

1. Storybook stories for each configuration
2. Test flashlight effect performance (many provinces)
3. Test responsive layouts
4. Test province selection across regions
