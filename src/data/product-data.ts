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
  subCategories?: {
    label: string;
    images: ProductImage[];
  }[];
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

// Imports for Product 1 (Wall Lights)
import wlnew1 from "../assets/Wall Lights/wl-1.webp";
import wlnew2 from "../assets/Wall Lights/wl-2.webp";
import wlnew3 from "../assets/Wall Lights/wl-3.webp";
import wlnew4 from "../assets/Wall Lights/wl-4.webp";
import wlnew5 from "../assets/Wall Lights/wl-5.webp";
import wlnew6 from "../assets/Wall Lights/wl-6.webp";
import wlnew7 from "../assets/Wall Lights/wl-7.webp";
import wlnew8 from "../assets/Wall Lights/wl-8.webp";
// Imports for Product 2

// Imports for Product 2 — Table Lamp sub-category
import tb1 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-1.webp";
import tb2 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-2.webp";
import tb3 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-3.webp";
import tb4 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-4.webp";
import tb5 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-5.webp";
import tb6 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-6.webp";
import tb7 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-7.webp";
import tb8 from "../assets/TABLE & FLOOR LAMPS/TABLE LAMP/tb-8.webp";

// Imports for Product 2 — Floor Lamp sub-category
import fl1 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-1.webp";
import fl2 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-2.webp";
import fl3 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-3.webp";
import fl4 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-4.webp";
import fl5 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-5.webp";
import fl6 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-6.webp";
import fl7 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-7.webp";
import fl8 from "../assets/TABLE & FLOOR LAMPS/FLOOR LAMP/fl-8.webp";

// Imports for Product 3 (Sculptures)
import sc1 from "../assets/SCULPTURES/sc-1.webp";
import sc2 from "../assets/SCULPTURES/sc-2.webp";
import sc3 from "../assets/SCULPTURES/sc-3.webp";
import sc4 from "../assets/SCULPTURES/sc-4.webp";
import sc5 from "../assets/SCULPTURES/sc-5.webp";
import sc6 from "../assets/SCULPTURES/sc-6.webp";
import sc7 from "../assets/SCULPTURES/sc-7.webp";
import sc8 from "../assets/SCULPTURES/sc-8.webp";

// Imports for Product 4
import wp1 from "../assets/MODERN PENDANT LIGHTS/wp-1.webp";
import wp2 from "../assets/MODERN PENDANT LIGHTS/wp-2.webp";
import wp3 from "../assets/MODERN PENDANT LIGHTS/wp-3.webp";
import wp4 from "../assets/MODERN PENDANT LIGHTS/wp-4.webp";
import wp5 from "../assets/MODERN PENDANT LIGHTS/wp-5.webp";
import wp6 from "../assets/MODERN PENDANT LIGHTS/wp-6.webp";
import wp7 from "../assets/MODERN PENDANT LIGHTS/wp-7.webp";
import wp8 from "../assets/MODERN PENDANT LIGHTS/wp-8.webp";

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
    name: "Wall Lights",
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
      { src: wlnew1, alt: "Wall Light 1" },
      { src: wlnew2, alt: "Wall Light 2" },
      { src: wlnew3, alt: "Wall Light 3" },
      { src: wlnew4, alt: "Wall Light 4" },
      { src: wlnew5, alt: "Wall Light 5" },
      { src: wlnew6, alt: "Wall Light 6" },
      { src: wlnew7, alt: "Wall Light 7" },
      { src: wlnew8, alt: "Wall Light 8" },
    ]),
  },

  /* ─── 2  Table & Floor Lamps ───────────────────────────────── */
  {
    id: 2,
    name: "Table & Floor Lamps",
    category: "Table & Floor Lamps",
    tagline: "Modular Flexibility",
    description:
      "Discover next-generation lighting design with ABC Lights' Magnetic Profile Lights — the smart, flexible solution that combines modern aesthetics with endless customization. Whether it's for your home, office, retail, or gallery, these modular lights give you the freedom to design and adjust your lighting just the way you want.",
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
      { src: tb1, alt: "Table Lamp 1" },
      { src: tb2, alt: "Table Lamp 2" },
      { src: tb3, alt: "Table Lamp 3" },
      { src: tb4, alt: "Table Lamp 4" },
      { src: tb5, alt: "Table Lamp 5" },
      { src: tb6, alt: "Table Lamp 6" },
      { src: tb7, alt: "Table Lamp 7" },
      { src: tb8, alt: "Table Lamp 8" },
    ]),

    subCategories: [
      {
        label: "Table Lamp",
        images: buildRealImages([
          { src: tb1, alt: "Table Lamp 1" },
          { src: tb2, alt: "Table Lamp 2" },
          { src: tb3, alt: "Table Lamp 3" },
          { src: tb4, alt: "Table Lamp 4" },
          { src: tb5, alt: "Table Lamp 5" },
          { src: tb6, alt: "Table Lamp 6" },
          { src: tb7, alt: "Table Lamp 7" },
          { src: tb8, alt: "Table Lamp 8" },
        ]),
      },
      {
        label: "Floor Lamp",
        images: buildRealImages([
          { src: fl1, alt: "Floor Lamp 1" },
          { src: fl2, alt: "Floor Lamp 2" },
          { src: fl3, alt: "Floor Lamp 3" },
          { src: fl4, alt: "Floor Lamp 4" },
          { src: fl5, alt: "Floor Lamp 5" },
          { src: fl6, alt: "Floor Lamp 6" },
          { src: fl7, alt: "Floor Lamp 7" },
          { src: fl8, alt: "Floor Lamp 8" },
        ]),
      },
    ],
  },

  /* ─── 3  Modern Pendant Light ─────────────────────────────── */
  {
    id: 3,
    name: "Sculptures",
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
      { src: sc1, alt: "Sculpture 1" },
      { src: sc2, alt: "Sculpture 2" },
      { src: sc3, alt: "Sculpture 3" },
      { src: sc4, alt: "Sculpture 4" },
      { src: sc5, alt: "Sculpture 5" },
      { src: sc6, alt: "Sculpture 6" },
      { src: sc7, alt: "Sculpture 7" },
      { src: sc8, alt: "Sculpture 8" },
    ]),
  },

  /* ─── 4  Ceiling Lights ───────────────────────────────────── */
  {
    id: 4,
    name: "Modern Pendant Lights",
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
      { src: wp1, alt: "Modern Pendant Light 1" },
      { src: wp2, alt: "Modern Pendant Light 2" },
      { src: wp3, alt: "Modern Pendant Light 3" },
      { src: wp4, alt: "Modern Pendant Light 4" },
      { src: wp5, alt: "Modern Pendant Light 5" },
      { src: wp6, alt: "Modern Pendant Light 6" },
      { src: wp7, alt: "Modern Pendant Light 7" },
      { src: wp8, alt: "Modern Pendant Light 8" },
    ]),
  },

  /* ─── 5  Designer Chandeliers ─────────────────────────────── */
  {
    id: 5,
    name: "Home Decor",
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
    name: "Classic",
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
    name: "Chandeliers",
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
    name: "Ceiling Mounted",
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
