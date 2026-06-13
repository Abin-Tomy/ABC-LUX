/* =============================================================
   product-data.ts — Per-Product Image & Content Catalog
   =============================================================
   Purpose   : Centralised data for all 8 product detail pages.
   Used by   : pages/product-detail.tsx
   Notes     : Each product has 8 placeholder images with a uniform
               masonry grid layout. Replace placeholder src URLs
               with real assets as needed.
   ============================================================= */

export interface ProductImage {
  src: string;
  alt: string;
  gridColumn: string;
  gridRow: string;
  aspect: string;
  maxH?: string;
  minH?: string;
}

export interface ProductData {
  id: number;
  name: string;
  category: string;
  tagline: string;
  description: string;
  highlights: string[];
  spaces: string[];
  images: ProductImage[];
}

/* helper — builds a placehold.co URL with product-specific colour */
const ph = (w: number, h: number, bg: string, id: number, n: number) =>
  `https://placehold.co/${w}x${h}/${bg}/C9A962?text=P${id}-${n}`;

/*
 * Shared grid layout for every product page:
 *
 *  Row 1:  [1 / 4  · 3/4]   [4 / 10 · 4/3 hero ↕2]   [10 / 13 · 4/3]
 *  Row 2:  [1 / 4  · 16/9]                              [10 / 13 · 16/9]
 *  Row 3:  [1 / 5  · 16/9]  [5 / 9  · 4/3]             [9 / 13  · 16/9]
 *
 *  Total = 3 + 2 + 3 = 8 images
 */
const GRID: { gridColumn: string; gridRow: string; aspect: string; minH?: string }[] = [
  { gridColumn: "1 / 4", gridRow: "1", aspect: "3/4" },
  { gridColumn: "4 / 10", gridRow: "1 / 3", aspect: "4/3", minH: "40vh" },
  { gridColumn: "10 / 13", gridRow: "1", aspect: "4/3" },
  { gridColumn: "1 / 4", gridRow: "2", aspect: "16/9" },
  { gridColumn: "10 / 13", gridRow: "2", aspect: "16/9" },
  { gridColumn: "1 / 5", gridRow: "3", aspect: "16/9" },
  { gridColumn: "5 / 9", gridRow: "3", aspect: "4/3" },
  { gridColumn: "9 / 13", gridRow: "3", aspect: "16/9" },
];

/** Merges a product's image src/alt with the shared grid layout */
function makeImages(bg: string, id: number, alts: string[]): ProductImage[] {
  // Pixel sizes matching each grid slot's aspect ratio
  const sizes: [number, number][] = [
    [600, 800], // 3/4
    [800, 600], // 4/3 hero
    [800, 600], // 4/3
    [960, 540], // 16/9
    [960, 540], // 16/9
    [960, 540], // 16/9
    [800, 600], // 4/3
    [960, 540], // 16/9
  ];

  return GRID.map((g, i) => ({
    src: ph(sizes[i][0], sizes[i][1], bg, id, i + 1),
    alt: alts[i],
    gridColumn: g.gridColumn,
    gridRow: g.gridRow,
    aspect: g.aspect,
    ...(g.minH ? { minH: g.minH } : {}),
  }));
}

/**
 * Helper — maps your REAL imported images to the masonry grid layout.
 * You pass an array of 8 { src, alt } objects.
 */
export function buildRealImages(items: { src: string; alt: string }[]): ProductImage[] {
  return GRID.map((g, i) => ({
    src: items[i]?.src || "", // Uses your real image import
    alt: items[i]?.alt || `Image ${i + 1}`,
    gridColumn: g.gridColumn,
    gridRow: g.gridRow,
    aspect: g.aspect,
    ...(g.minH ? { minH: g.minH } : {}),
  }));
}

// Imports for Product 1
import lsl1 from "../assets/LSL_1.webp";
import lsl2 from "../assets/LSL_2.webp";
import lsl3 from "../assets/LSL_3.webp";
import lsl4 from "../assets/LSL_4.webp";
import lsl5 from "../assets/LSL_5.webp";
import lsl6 from "../assets/LSL_6.webp";
import lsl7 from "../assets/LSL_7.webp";
import lsl8 from "../assets/LSL_8.webp";

// Imports for Product 2
import mpl1 from "../assets/MPL_1.webp";
import mpl2 from "../assets/MPL_2.webp";
import mpl3 from "../assets/MPL_3.webp";
import mpl4 from "../assets/MPL_4.webp";
import mpl5 from "../assets/MPL_5.webp";
import mpl6 from "../assets/MPL_6.webp";
import mpl7 from "../assets/MPL_7.webp";
import mpl8 from "../assets/MPL_8.webp";

// Imports for Product 3
import mopl1 from "../assets/MoPL_1.webp";
import mopl2 from "../assets/MoPL_2.webp";
import mopl3 from "../assets/MoPL_3.webp";
import mopl4 from "../assets/MoPL_4.webp";
import mopl5 from "../assets/MoPL_5.webp";
import mopl6 from "../assets/MoPL_6.webp";
import mopl7 from "../assets/MoPL_7.webp";
import mopl8 from "../assets/MoPL_8.webp";

// Imports for Product 4
import cl1 from "../assets/CL_1.webp";
import cl2 from "../assets/CL_2.webp";
import cl3 from "../assets/CL_3.webp";
import cl4 from "../assets/CL_4.webp";
import cl5 from "../assets/CL_5.webp";
import cl6 from "../assets/CL_6.webp";
import cl7 from "../assets/CL_7.webp";
import cl8 from "../assets/CL_8.webp";

// Imports for Product 5
import dc1 from "../assets/DC_1.webp";
import dc2 from "../assets/DC_2.webp";
import dc3 from "../assets/DC_3.webp";
import dc4 from "../assets/DC_4.webp";
import dc5 from "../assets/DC_5.webp";
import dc6 from "../assets/DC_6.webp";
import dc7 from "../assets/DC_7.webp";
import dc8 from "../assets/DC_8.webp";

// Imports for Product 6
import ol1 from "../assets/OL_1.webp";
import ol2 from "../assets/OL_2.webp";
import ol3 from "../assets/OL_3.webp";
import ol4 from "../assets/OL_4.webp";
import ol5 from "../assets/OL_5.webp";
import ol6 from "../assets/OL_6.webp";
import ol7 from "../assets/OL_7.webp";
import ol8 from "../assets/OL_8.webp";

// Imports for Product 7
import wl1 from "../assets/WL_1.webp";
import wl2 from "../assets/WL_2.webp";
import wl3 from "../assets/WL_3.webp";
import wl4 from "../assets/WL_4.webp";
import wl5 from "../assets/WL_5.webp";
import wl6 from "../assets/WL_6.webp";
import wl7 from "../assets/WL_7.webp";
import wl8 from "../assets/WL_8.webp";

// Imports for Product 8
import pl1 from "../assets/PL_1.webp";
import pl2 from "../assets/PL_2.webp";
import pl3 from "../assets/PL_3.webp";
import pl4 from "../assets/PL_4.webp";
import pl5 from "../assets/PL_5.webp";
import pl6 from "../assets/PL_6.webp";
import pl7 from "../assets/PL_7.webp";
import pl8 from "../assets/PL_8.webp";


export const PRODUCT_CATALOG: ProductData[] = [
  /* ─── 1  LED Strip Lights ─────────────────────────────────── */
  {
    id: 1,
    name: "LED Strip Lights",
    category: "Linear Lighting",
    tagline: "Professional Illumination",
    description:
      "Bring your imagination to life with ABC Lights’ premium LED Strip Lights — the ultimate solution for stylish, energy-efficient, and flexible illumination. Whether you want to create a cozy ambiance in your living room, vibrant accent lighting in your bedroom, or modern backlighting for your ceilings and furniture, our LED strip lights deliver endless possibilities. ",
    highlights: [
      "Ultra-Bright & Energy Efficient",
      "Flexible & Easy to Install",
      "Customizable Colors & Modes",
      "Durable & Long-lasting",
    ],
    spaces: [
      "Bedrooms & Living Rooms",
      "Kitchens & Cabinets",
      "Entertainment Areas",
      "Commercial & Decorative Installations",
    ],

    images: buildRealImages([
      { src: lsl1, alt: "LED Strip 1" },
      { src: lsl2, alt: "LED Strip 2" },
      { src: lsl3, alt: "LED Strip 3" },
      { src: lsl4, alt: "LED Strip 4" },
      { src: lsl5, alt: "LED Strip 5" },
      { src: lsl6, alt: "LED Strip 6" },
      { src: lsl7, alt: "LED Strip 7" },
      { src: lsl8, alt: "LED Strip 8" },
    ]),
  },

  /* ─── 2  Magnetic Profile Lights ──────────────────────────── */
  {
    id: 2,
    name: "Magnetic Profile Lights",
    category: "Track Systems",
    tagline: "Modular Flexibility",
    description:
      "Discover next-generation lighting design with ABC Lights’ Magnetic Profile Lights — the smart, flexible solution that combines modern aesthetics with endless customization. Whether it’s for your home, office, retail, or gallery, these modular lights give you the freedom to design and adjust your lighting just the way you want.",
    highlights: [
      "Seamless Magnetic System",
      "Modular & Customizable",
      "Efficient & Reliable Performance",
      "Sleek, Minimalist Design",
    ],
    spaces: [
      "Residential Interiors",
      "Retail Stores & Showrooms",
      "Offices & Workspaces",
      "Gallaries & Hospitality Spaces",
    ],

    images: buildRealImages([
      { src: mpl1, alt: "Magnetic Profile 1" },
      { src: mpl2, alt: "Magnetic Profile 2" },
      { src: mpl3, alt: "Magnetic Profile 3" },
      { src: mpl4, alt: "Magnetic Profile 4" },
      { src: mpl5, alt: "Magnetic Profile 5" },
      { src: mpl6, alt: "Magnetic Profile 6" },
      { src: mpl7, alt: "Magnetic Profile 7" },
      { src: mpl8, alt: "Magnetic Profile 8" },
    ]),
  },

  /* ─── 3  Modern Pendant Light ─────────────────────────────── */
  {
    id: 3,
    name: "Modern Pendant Light",
    category: "Pendants",
    tagline: "Artistic Elegance",
    description:
      "Add a touch of modern sophistication to your interiors with ABC Lights’ exclusive collection of Modern Pendant Lights. Designed to captivate and inspire, our pendant lights effortlessly combine artistic form with functional brilliance, turning ordinary spaces into extraordinary experiences. ",
    highlights: [
      "Contemporary Designs for Every Taste",
      "Premium Craftsmanship",
      "Warm, Inviting Glow",
      "Height-Adjustable & Versatile",
    ],
    spaces: [
      "Dining Rooms & Kitchens",
      "Living Areas & Bedrooms",
      "Entryways & Stairwells",
      "Commercial Spaces",
    ],

    images: buildRealImages([
      { src: mopl1, alt: "Modern Light 1" },
      { src: mopl2, alt: "Modern Light 2" },
      { src: mopl3, alt: "Modern Light 3" },
      { src: mopl4, alt: "Modern Light 4" },
      { src: mopl5, alt: "Modern Light 5" },
      { src: mopl6, alt: "Modern Light 6" },
      { src: mopl7, alt: "Modern Light 7" },
      { src: mopl8, alt: "Modern Light 8" },
    ]),
  },

  /* ─── 4  Ceiling Lights ───────────────────────────────────── */
  {
    id: 4,
    name: "Ceiling Lights",
    category: "Ambient Lighting",
    tagline: "Ambient Sophistication",
    description:
      "Discover the perfect blend of style and functionality with ABC Lights’ versatile range of Ceiling Lights. Designed to suit every interior, our ceiling fixtures provide brilliant, glare-free illumination while adding a touch of modern elegance to your living spaces.",
    highlights: [
      "Contemporary Designs for Every Room",
      "Soft, Ambient Illumination",
      "Space-Saving & Practical",
      "Energy-Efficient LED Technology",
    ],
    spaces: [
      "Bedrooms & Living Rooms",
      "Dining Rooms & Kitchens",
      "Hallways & Entrances",
      "Commercial Interiors",
    ],

    images: buildRealImages([
      { src: cl1, alt: "Ceiling Light 1" },
      { src: cl2, alt: "Ceiling Light 2" },
      { src: cl3, alt: "Ceiling Light 3" },
      { src: cl4, alt: "Ceiling Light 4" },
      { src: cl5, alt: "Ceiling Light 5" },
      { src: cl6, alt: "Ceiling Light 6" },
      { src: cl7, alt: "Ceiling Light 7" },
      { src: cl8, alt: "Ceiling Light 8" },
    ]),
  },

  /* ─── 5  Designer Chandeliers ─────────────────────────────── */
  {
    id: 5,
    name: "Designer Chandeliers",
    category: "Chandeliers",
    tagline: "Grand Installations",
    description:
      "At ABC Lights, we believe every space deserves a masterpiece that’s as unique as you are. Our Customized Chandeliers service transforms your ideas into breathtaking, one-of-a-kind installations that elevate luxury homes, hotels, and statement spaces with unmatched elegance and individuality. ",
    highlights: [
      "Designed Just for You",
      "Perfectly Tailored for Any Spacr",
      "Endless Material & Finish Options",
      "Expert Craftmanship",
    ],
    spaces: [
      "Hotel Lobbies & Reception Areas",
      "Residential Living & Dining Rooms",
      "Corporate & Commercial Spaces",
      "Event Venues & Showpieces",
    ],

    images: buildRealImages([
      { src: dc1, alt: "Designer Chandelier 1" },
      { src: dc2, alt: "Designer Chandelier 2" },
      { src: dc3, alt: "Designer Chandelier 3" },
      { src: dc4, alt: "Designer Chandelier 4" },
      { src: dc5, alt: "Designer Chandelier 5" },
      { src: dc6, alt: "Designer Chandelier 6" },
      { src: dc7, alt: "Designer Chandelier 7" },
      { src: dc8, alt: "Designer Chandelier 8" },
    ]),
  },

  /* ─── 6  Outdoor Lights ───────────────────────────────────── */
  {
    id: 6,
    name: "Outdoor Lights",
    category: "Exterior Lighting",
    tagline: "Exterior Excellence",
    description:
      "Transform your exterior spaces into inviting, functional, and secure areas with ABC Lights’ curated range of Outdoor Lights. Designed to withstand the elements while enhancing the beauty of your home or commercial property, our outdoor lighting solutions bring together durability, style, and efficiency.",
    highlights: [
      "Versatile Designs for Every Exterior",
      "Enhanced Ambience & Safety",
      "Weather-Resistant & Durable",
      "Flexible Installation Options",
    ],
    spaces: [
      "Entrances & Facades",
      "Pathways & Driveways",
      "Patios & Decks",
      "Gardens & Landscapes",
    ],

    images: buildRealImages([
      { src: ol1, alt: "Outdoor Light 1" },
      { src: ol2, alt: "Outdoor Light 2" },
      { src: ol3, alt: "Outdoor Light 3" },
      { src: ol4, alt: "Outdoor Light 4" },
      { src: ol5, alt: "Outdoor Light 5" },
      { src: ol6, alt: "Outdoor Light 6" },
      { src: ol7, alt: "Outdoor Light 7" },
      { src: ol8, alt: "Outdoor Light 8" },
    ]),
  },

  /* ─── 7  Wall Lights ──────────────────────────────────────── */
  {
    id: 7,
    name: "Wall Lights",
    category: "Sconces & Wall",
    tagline: "Sculpted Illumination",
    description:
      "Add layers of warmth, style, and functionality to your interiors with ABC Lights’ stunning collection of Wall Lights. Perfect for accentuating architectural features, creating cozy nooks, or adding practical task lighting, our wall fixtures combine beautiful design with exceptional performance.",
    highlights: [
      "Designer Styles for Every Space",
      "Ambient & Accent Lighting",
      "Space-Saving Elegance",
      "Premium Materials & Craftsmanship",
    ],
    spaces: [
      "Living Rooms & Bedrooms",
      "Hallways & Staircases",
      "Bathrooms & Vanity Areas",
      "Hospitality & Commercial Spaces",
    ],

    images: buildRealImages([
      { src: wl1, alt: "Wall Light 1" },
      { src: wl2, alt: "Wall Light 2" },
      { src: wl3, alt: "Wall Light 3" },
      { src: wl4, alt: "Wall Light 4" },
      { src: wl5, alt: "Wall Light 5" },
      { src: wl6, alt: "Wall Light 6" },
      { src: wl7, alt: "Wall Light 7" },
      { src: wl8, alt: "Wall Light 8" },
    ]),
  },

  /* ─── 8  Pole Lights ──────────────────────────────────────── */
  {
    id: 8,
    name: "Pole Lights",
    category: "Outdoor Poles",
    tagline: "Vertical Presence",
    description:
      "Discover the perfect way to brighten pathways, gardens, and public areas with ABC Lights’ stylish range of Pole Lights. Combining practical illumination with beautiful design, our pole lighting solutions enhance safety while adding timeless charm to any exterior setting.",
    highlights: [
      "Versatile Styles for Every Landscape",
      "Reliable, Even Illumination",
      "Weather-Resistant Durability",
      "Easy Installation & Maintenance",
    ],
    spaces: [
      "Pathways & Walkways",
      "Gardens & Lawns",
      "Public Parks & Streets",
      "Commercial & Residential Entrances",
    ],

    images: buildRealImages([
      { src: pl1, alt: "Pole Light 1" },
      { src: pl2, alt: "Pole Light 2" },
      { src: pl3, alt: "Pole Light 3" },
      { src: pl4, alt: "Pole Light 4" },
      { src: pl5, alt: "Pole Light 5" },
      { src: pl6, alt: "Pole Light 6" },
      { src: pl7, alt: "Pole Light 7" },
      { src: pl8, alt: "Pole Light 8" },
    ]),
  },
];
