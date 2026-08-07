import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
    projectId: "m90b2lrb",
    dataset: "production",
    apiVersion: "2026-07-24",
    useCdn: true,
});

// ─── Image URL builder ────────────────────────────────────────────────────────
// Wraps @sanity/image-url so any component can call:
//   urlFor(post.mainImage).width(800).url()
const builder = imageUrlBuilder(sanityClient);

// The source type accepted by @sanity/image-url's .image() call.
// We use Parameters<> to stay in sync without importing internal types.
type ImageSource = Parameters<typeof builder.image>[0];

export function urlFor(source: ImageSource) {
    return builder.image(source);
}

// ─── Collections Section Query ────────────────────────────────────────────────
// Fetches all 8 homepage showcase slots ordered by slot number.
// The -> operator dereferences the asset reference to get the direct CDN URL.
export const collectionsQuery = `
  *[_type == "collectionSlot"] | order(order asc) {
    order,
    label,
    "imageUrl": image.asset->url
  }
`;

// Type for a single slot returned by collectionsQuery
export type CollectionItem = {
    order: number;
    label: string;
    imageUrl: string | null;
};