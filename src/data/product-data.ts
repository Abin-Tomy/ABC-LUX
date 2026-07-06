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
import wlnew1 from "../assets/WALL LIGHTS/1.png";
import wlnew2 from "../assets/WALL LIGHTS/2.png";
import wlnew3 from "../assets/WALL LIGHTS/3.png";
import wlnew4 from "../assets/WALL LIGHTS/4.png";
import wlnew5 from "../assets/WALL LIGHTS/5.png";
import wlnew6 from "../assets/WALL LIGHTS/6.png";
import wlnew7 from "../assets/WALL LIGHTS/7.png";
import wlnew8 from "../assets/WALL LIGHTS/8.png";
// Imports for Product 2

// Imports for Product 2 — Table Lamp sub-category
import tb1 from "../assets/TABLE LAMPS/1.png";
import tb2 from "../assets/TABLE LAMPS/2.png";
import tb3 from "../assets/TABLE LAMPS/3.png";
import tb4 from "../assets/TABLE LAMPS/4.png";
import tb5 from "../assets/TABLE LAMPS/5.png";
import tb6 from "../assets/TABLE LAMPS/6.png";
import tb7 from "../assets/TABLE LAMPS/7.png";
import tb8 from "../assets/TABLE LAMPS/8.png";

// Imports for Product 2 — Floor Lamp sub-category
import fl1 from "../assets/FLOOR LAMPS/1.png";
import fl2 from "../assets/FLOOR LAMPS/2.png";
import fl3 from "../assets/FLOOR LAMPS/3.png";
import fl4 from "../assets/FLOOR LAMPS/4.png";
import fl5 from "../assets/FLOOR LAMPS/5.png";
import fl6 from "../assets/FLOOR LAMPS/6.png";
import fl7 from "../assets/FLOOR LAMPS/7.png";
import fl8 from "../assets/FLOOR LAMPS/8.png";

// Imports for Product 3 (Sculptures)
import sc1 from "../assets/SCULPTURE/1.png";
import sc2 from "../assets/SCULPTURE/2.png";
import sc3 from "../assets/SCULPTURE/3.png";
import sc4 from "../assets/SCULPTURE/4.png";
import sc5 from "../assets/SCULPTURE/5.png";
import sc6 from "../assets/SCULPTURE/6.png";
import sc7 from "../assets/SCULPTURE/7.png";
import sc8 from "../assets/SCULPTURE/8.png";

// Imports for Product 4
import wp1 from "../assets/MODERN PENDENT LIGHTS/1.png";
import wp2 from "../assets/MODERN PENDENT LIGHTS/2.png";
import wp3 from "../assets/MODERN PENDENT LIGHTS/3.png";
import wp4 from "../assets/MODERN PENDENT LIGHTS/4.png";
import wp5 from "../assets/MODERN PENDENT LIGHTS/5.png";
import wp6 from "../assets/MODERN PENDENT LIGHTS/6.png";
import wp7 from "../assets/MODERN PENDENT LIGHTS/7.png";
import wp8 from "../assets/MODERN PENDENT LIGHTS/8.png";

// Imports for Product 5 (Home Decor)
// Imports for Product 5 — Wall Art sub-category
import wa1 from "../assets/WALL ART/1.png";
import wa2 from "../assets/WALL ART/2.png";
import wa3 from "../assets/WALL ART/3.png";
import wa4 from "../assets/WALL ART/4.png";
import wa5 from "../assets/WALL ART/5.png";
import wa6 from "../assets/WALL ART/6.png";
import wa7 from "../assets/WALL ART/7.png";
import wa8 from "../assets/WALL ART/8.png";

// Imports for Product 5 — Ornaments sub-category
import or1 from "../assets/HOME DECOR ORNAMENTS/1.png";
import or2 from "../assets/HOME DECOR ORNAMENTS/2.png";
import or3 from "../assets/HOME DECOR ORNAMENTS/3.png";
import or4 from "../assets/HOME DECOR ORNAMENTS/4.png";
import or5 from "../assets/HOME DECOR ORNAMENTS/5.png";
import or6 from "../assets/HOME DECOR ORNAMENTS/6.png";
import or7 from "../assets/HOME DECOR ORNAMENTS/7.png";
import or8 from "../assets/HOME DECOR ORNAMENTS/8.png";

// Imports for Product 6 (Classic)
import cl1 from "../assets/CLASSIC CHANDERLIERS/1.png";
import cl2 from "../assets/CLASSIC CHANDERLIERS/2.png";
import cl3 from "../assets/CLASSIC CHANDERLIERS/3.png";
import cl4 from "../assets/CLASSIC CHANDERLIERS/4.png";
import cl5 from "../assets/CLASSIC CHANDERLIERS/5.png";
import cl6 from "../assets/CLASSIC CHANDERLIERS/6.png";
import cl7 from "../assets/CLASSIC CHANDERLIERS/7.png";
import cl8 from "../assets/CLASSIC CHANDERLIERS/8.png";

// Imports for Product 7 (Chandeliers)
import ch1 from "../assets/CHANDELIERS/1.png";
import ch2 from "../assets/CHANDELIERS/2.png";
import ch3 from "../assets/CHANDELIERS/3.png";
import ch4 from "../assets/CHANDELIERS/4.png";
import ch5 from "../assets/CHANDELIERS/5.png";
import ch6 from "../assets/CHANDELIERS/6.png";
import ch7 from "../assets/CHANDELIERS/7.png";
import ch8 from "../assets/CHANDELIERS/8.png";

// Imports for Product 8 (Ceiling Mounted)
import cm1 from "../assets/CEILING LIGHTS/1.png";
import cm2 from "../assets/CEILING LIGHTS/2.png";
import cm3 from "../assets/CEILING LIGHTS/3.png";
import cm4 from "../assets/CEILING LIGHTS/4.png";
import cm5 from "../assets/CEILING LIGHTS/5.png";
import cm6 from "../assets/CEILING LIGHTS/6.png";
import cm7 from "../assets/CEILING LIGHTS/7.png";
import cm8 from "../assets/CEILING LIGHTS/8.png";

export const PRODUCT_CATALOG: ProductData[] = [
  /* ─── 1  Wall Lights ─────────────────────────────────── */
  {
    id: 1,
    name: "Wall Lights",
    category: "Wall Lighting",
    tagline: "Elegant Wall Illuminations",
    description:
      "Enhance the ambiance of any room with ABC LUX's premium Wall Lights. Designed to provide both functional lighting and a decorative touch, our wall fixtures seamlessly blend with modern and classic interiors. Illuminate hallways, frame your bed, or create a warm, inviting atmosphere in your living areas with these stunning pieces.",
    highlights: [
      "Sleek & Modern Designs",
      "Warm & Inviting Glow",
      "Space-Saving Illumination",
      "Easy to Install & Maintain",
    ],
    spaces: [
      "Hallways & Corridors",
      "Bedrooms & Living Rooms",
      "Bathroom Vanities",
      "Exterior Patios & Walkways",
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
    category: "Freestanding Lamps",
    tagline: "Versatile & Stylish Illumination",
    description:
      "Add flexibility and charm to your lighting design with our collection of Table & Floor Lamps. Perfect for reading nooks, bedside tables, or as a statement piece in your living room, these lamps offer portable and stylish illumination. Choose from a variety of contemporary and classic designs to match your unique decor.",
    highlights: [
      "Portable & Versatile",
      "Targeted Task Lighting",
      "Statement-Making Designs",
      "Adjustable Brightness Options",
    ],
    spaces: [
      "Living Rooms & Dens",
      "Bedrooms & Nurseries",
      "Home Offices & Studies",
      "Reading Nooks",
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

  /* ─── 3  Sculptures ─────────────────────────────── */
  {
    id: 3,
    name: "Sculptures",
    category: "Sculptural Art",
    tagline: "Artistic Focal Points",
    description:
      "Elevate your interior design with our striking collection of Sculptures. These exquisite art pieces are crafted to inspire and captivate, serving as the perfect centerpiece for any room. Whether you prefer modern minimalism or intricate classic designs, our sculptures add a profound sense of sophistication and personality to your space.",
    highlights: [
      "Unique Artistic Expressions",
      "Premium Quality Materials",
      "Captivating Focal Points",
      "Diverse Styles & Finishes",
    ],
    spaces: [
      "Living Room Mantels",
      "Entryway Consoles",
      "Corporate Lobbies",
      "Art Galleries & Displays",
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

  /* ─── 4  Modern Pendant Lights ───────────────────────────────────── */
  {
    id: 4,
    name: "Modern Pendants",
    category: "Pendant Lighting",
    tagline: "Contemporary Suspended Elegance",
    description:
      "Redefine your ceilings with the sleek and stylish Modern Pendant Lights from ABC LUX. Hanging gracefully from above, these fixtures provide excellent task and ambient lighting while acting as a modern work of art. Perfect for kitchen islands, dining tables, or double-height living areas, they bring a sophisticated contemporary edge.",
    highlights: [
      "Eye-Catching Modern Aesthetics",
      "Adjustable Hanging Heights",
      "Focused Task Illumination",
      "High-Quality Finishes",
    ],
    spaces: [
      "Kitchen Islands & Counters",
      "Dining Room Tables",
      "Stairwells & Foyers",
      "Trendy Cafes & Restaurants",
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

  /* ─── 5  Home Decor ─────────────────────────────── */
  {
    id: 5,
    name: "Home Decor",
    category: "Home Accessories",
    tagline: "Curated Accents for Your Space",
    description:
      "Complete your interior vision with ABC LUX's curated Home Decor collection. From captivating wall art that transforms blank spaces to delicate ornaments that add personality to your shelves, our decor pieces are carefully selected to complement any aesthetic. Make every corner of your home feel thoughtfully designed.",
    highlights: [
      "Handpicked Artistic Pieces",
      "Complements Any Interior Style",
      "High-Quality Craftsmanship",
      "Distinctive & Elegant Textures",
    ],
    spaces: [
      "Living Room Walls & Shelves",
      "Bedroom Nightstands",
      "Office Desks & Bookcases",
      "Console Tables",
    ],

    images: buildRealImages([
      { src: wa1, alt: "Wall Art 1" },
      { src: wa2, alt: "Wall Art 2" },
      { src: wa3, alt: "Wall Art 3" },
      { src: wa4, alt: "Wall Art 4" },
      { src: wa5, alt: "Wall Art 5" },
      { src: wa6, alt: "Wall Art 6" },
      { src: wa7, alt: "Wall Art 7" },
      { src: wa8, alt: "Wall Art 8" },
    ]),

    subCategories: [
      {
        label: "Wall Art",
        images: buildRealImages([
          { src: wa1, alt: "Wall Art 1" },
          { src: wa2, alt: "Wall Art 2" },
          { src: wa3, alt: "Wall Art 3" },
          { src: wa4, alt: "Wall Art 4" },
          { src: wa5, alt: "Wall Art 5" },
          { src: wa6, alt: "Wall Art 6" },
          { src: wa7, alt: "Wall Art 7" },
          { src: wa8, alt: "Wall Art 8" },
        ]),
      },
      {
        label: "Ornaments",
        images: buildRealImages([
          { src: or1, alt: "Ornament 1" },
          { src: or2, alt: "Ornament 2" },
          { src: or3, alt: "Ornament 3" },
          { src: or4, alt: "Ornament 4" },
          { src: or5, alt: "Ornament 5" },
          { src: or6, alt: "Ornament 6" },
          { src: or7, alt: "Ornament 7" },
          { src: or8, alt: "Ornament 8" },
        ]),
      },
    ],
  },

  /* ─── 6  Classic ───────────────────────────────────── */
  {
    id: 6,
    name: "Classic",
    category: "Traditional Lighting",
    tagline: "Timeless Elegance & Charm",
    description:
      "Bring a sense of enduring beauty to your home with our Classic lighting collection. Featuring ornate details, rich finishes, and traditional silhouettes, these fixtures evoke a sense of history and grace. Perfect for traditional, transitional, or vintage-inspired spaces that require a touch of sophisticated nostalgia.",
    highlights: [
      "Ornate Traditional Details",
      "Rich & Durable Finishes",
      "Warm, Nostalgic Glow",
      "Timeless Silhouettes",
    ],
    spaces: [
      "Formal Dining Rooms",
      "Grand Entryways",
      "Traditional Living Spaces",
      "Heritage Properties",
    ],

    images: buildRealImages([
      { src: cl1, alt: "Classic Light 1" },
      { src: cl2, alt: "Classic Light 2" },
      { src: cl3, alt: "Classic Light 3" },
      { src: cl4, alt: "Classic Light 4" },
      { src: cl5, alt: "Classic Light 5" },
      { src: cl6, alt: "Classic Light 6" },
      { src: cl7, alt: "Classic Light 7" },
      { src: cl8, alt: "Classic Light 8" },
    ]),
  },

  /* ─── 7  Chandeliers ──────────────────────────────────────── */
  {
    id: 7,
    name: "Chandeliers",
    category: "Statement Lighting",
    tagline: "Grand & Luxurious Illumination",
    description:
      "Make a breathtaking statement with ABC LUX's luxurious Chandeliers. Designed to be the crown jewel of any room, our chandeliers combine shimmering crystals, elegant metals, and masterful craftsmanship to create spectacular light displays. Elevate your grandest spaces with these dazzling centerpieces.",
    highlights: [
      "Dazzling Centerpiece Designs",
      "Intricate Craftsmanship",
      "Superior Ambient Lighting",
      "Luxurious Materials",
    ],
    spaces: [
      "Grand Foyers & Staircases",
      "Formal Dining Rooms",
      "Luxury Master Bedrooms",
      "Ballrooms & Banquet Halls",
    ],

    images: buildRealImages([
      { src: ch1, alt: "Chandelier 1" },
      { src: ch2, alt: "Chandelier 2" },
      { src: ch3, alt: "Chandelier 3" },
      { src: ch4, alt: "Chandelier 4" },
      { src: ch5, alt: "Chandelier 5" },
      { src: ch6, alt: "Chandelier 6" },
      { src: ch7, alt: "Chandelier 7" },
      { src: ch8, alt: "Chandelier 8" },
    ]),
  },

  /* ─── 8  Ceiling Mounted ──────────────────────────────────────── */
  {
    id: 8,
    name: "Ceiling Mounted",
    category: "Flush Mounts",
    tagline: "Sleek Overhead Brilliance",
    description:
      "Maximize your room's potential with our low-profile Ceiling Mounted lights. Ideal for rooms with lower ceilings or areas where you need unobtrusive yet powerful illumination, these flush and semi-flush fixtures provide a clean, modern look without compromising on brightness or style.",
    highlights: [
      "Space-Saving Low Profile",
      "Clean & Unobtrusive Look",
      "Broad & Even Light Distribution",
      "Ideal for Low Ceilings",
    ],
    spaces: [
      "Hallways & Corridors",
      "Bedrooms & Closets",
      "Kitchens & Pantries",
      "Bathrooms & Utility Rooms",
    ],

    images: buildRealImages([
      { src: cm1, alt: "Ceiling Mounted 1" },
      { src: cm2, alt: "Ceiling Mounted 2" },
      { src: cm3, alt: "Ceiling Mounted 3" },
      { src: cm4, alt: "Ceiling Mounted 4" },
      { src: cm5, alt: "Ceiling Mounted 5" },
      { src: cm6, alt: "Ceiling Mounted 6" },
      { src: cm7, alt: "Ceiling Mounted 7" },
      { src: cm8, alt: "Ceiling Mounted 8" },
    ]),
  },
];
