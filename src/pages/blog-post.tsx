/* =============================================================
   blog-post.tsx — Dynamic Single Post Page
   =============================================================
   Purpose   : Reads the :slug route param, fetches the matching Sanity post,
               and renders full body content using @portabletext/react.
   Used by   : Router (mapped to /blog/:slug)
   Depends on: react-router-dom, @sanity/client, @sanity/image-url,
               @portabletext/react, src/lib/sanity.ts
   Notes     : mainImage renders as a full-width hero banner above the title.
               Author name + circular photo appear beside the published date.
               Supports featureColumns and alignment-aware image blocks.
   ============================================================= */

import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityClient, urlFor } from "@/lib/sanity";

// ─── Brand colours ────────────────────────────────────────────────────────────
const BG = "#D3C8B6";
const FG = "#1A1819";
const GOLD = "#C9A962";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SanityImageRef {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  alignment?: "full" | "left" | "right";
  caption?: string;
}

interface SanityAuthor {
  name?: string;
  image?: SanityImageRef;
}

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: SanityImageRef;
  author?: SanityAuthor;
  body?: PortableTextBlock[];
  publishedAt?: string;
  _createdAt: string;
}

// ─── GROQ query — single post by slug ────────────────────────────────────────
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  author -> { name, image },
  body,
  publishedAt,
  _createdAt
}`;

// ─── Portable Text component overrides ───────────────────────────────────────

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.15rem",
          lineHeight: 1.9,
          color: "rgba(26,24,25,0.78)",
          margin: "0 0 1.5em 0",
        }}
      >
        {children}
      </p>
    ),

    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2rem, 4.5vw, 3rem)",
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: FG,
          margin: "2.2em 0 0.7em",
        }}
      >
        {children}
      </h1>
    ),

    // ── H2: primary section break — clear:both ensures it always starts after any float ──
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
          fontWeight: 400,
          lineHeight: 1.12,
          letterSpacing: "-0.018em",
          color: FG,
          margin: "2em 0 0.6em",
          paddingBottom: "0.35em",
          borderBottom: `1px solid rgba(201,169,98,0.3)`,
          // Clears any preceding floated image so new sections always start fresh
          clear: "both",
        }}
      >
        {children}
      </h2>
    ),

    // ── H3: sub-section — clearly smaller than h2, no rule ───────────────────
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.25rem, 2.8vw, 1.85rem)",
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
          color: FG,
          margin: "1.7em 0 0.5em",
        }}
      >
        {children}
      </h3>
    ),

    // ── H4: label-level heading ───────────────────────────────────────────────
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.05rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(26,24,25,0.8)",
          margin: "1.5em 0 0.4em",
        }}
      >
        {children}
      </h4>
    ),

    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote
        style={{
          margin: "2.2em 0",
          paddingLeft: 28,
          borderLeft: `3px solid ${GOLD}`,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.22rem",
          fontStyle: "italic",
          lineHeight: 1.78,
          color: "rgba(26,24,25,0.62)",
        }}
      >
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 700, color: FG }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ fontStyle: "italic", color: "rgba(26,24,25,0.88)" }}>{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.88em",
          background: "rgba(201,169,98,0.1)",
          borderRadius: 4,
          padding: "0.1em 0.45em",
          color: "rgba(26,24,25,0.82)",
        }}
      >
        {children}
      </code>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: GOLD,
          textDecoration: "underline",
          textDecorationColor: "rgba(201,169,98,0.5)",
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </a>
    ),
  },

  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.08rem",
          lineHeight: 1.85,
          color: "rgba(26,24,25,0.78)",
          paddingLeft: 28,
          margin: "0 0 1.6em 0",
          listStyleType: "disc",
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.08rem",
          lineHeight: 1.85,
          color: "rgba(26,24,25,0.78)",
          paddingLeft: 28,
          margin: "0 0 1.6em 0",
          listStyleType: "decimal",
        }}
      >
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ marginBottom: "0.4em", paddingLeft: "0.25em" }}>{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ marginBottom: "0.4em", paddingLeft: "0.25em" }}>{children}</li>
    ),
  },

  types: {
    // ── Alignment-aware image block ───────────────────────────────────────────
    // "full"  → full-width block (clears any previous float first)
    // "left"  → ~40% wide, floated left  — subsequent text flows to the RIGHT
    // "right" → ~40% wide, floated right — subsequent text flows to the LEFT
    //
    // NO clearfix follows a floated image — text is meant to wrap beside it.
    // The next H2 heading and featureColumns have clear:both to end the float zone.
    image: ({
      value,
    }: {
      value?: SanityImageRef & { caption?: string; alignment?: "full" | "left" | "right" };
    }) => {
      if (!value?.asset) return null;

      const alignment = value.alignment ?? "full";
      const imgUrl = urlFor(value).width(alignment === "full" ? 1200 : 720).auto("format").url();

      const isFloat = alignment === "left" || alignment === "right";

      const figureStyle: React.CSSProperties = isFloat
        ? {
            // Float the image — NO clearfix follows, so text wraps naturally
            float: alignment,
            width: "40%",
            margin:
              alignment === "left"
                ? "0.25em 2.2em 1.6em 0"  // right + bottom gap when left-floated
                : "0.25em 0 1.6em 2.2em", // left + bottom gap when right-floated
            borderRadius: 8,
            overflow: "hidden",
          }
        : {
            // Full-width: clear any preceding float first
            clear: "both",
            margin: "2.5em 0",
            borderRadius: 8,
            overflow: "hidden",
          };

      const imgStyle: React.CSSProperties = {
        width: "100%",
        display: "block",
        maxHeight: isFloat ? 360 : 560,
        objectFit: "cover",
      };

      return (
        <figure style={figureStyle}>
          <img src={imgUrl} alt={value.alt ?? ""} style={imgStyle} />
          {value.caption && (
            <figcaption
              style={{
                marginTop: 8,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "0.82rem",
                letterSpacing: "0.06em",
                color: "rgba(26,24,25,0.45)",
                textAlign: "center",
                fontStyle: "italic",
                padding: "0 4px",
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // ── Two-column feature box ────────────────────────────────────────────────
    // A bordered card split into two equal columns by a thin vertical divider.
    // Each column has a bold heading and a bulleted list of items below it.
    featureColumns: ({
      value,
    }: {
      value?: {
        columnOneHeading?: string;
        columnOneItems?: string[];
        columnTwoHeading?: string;
        columnTwoItems?: string[];
      };
    }) => {
      if (!value) return null;
      const colHeadStyle: React.CSSProperties = {
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        fontWeight: 400,
        color: FG,
        marginBottom: "0.75em",
        letterSpacing: "-0.01em",
      };
      const listStyle: React.CSSProperties = {
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "1.05rem",
        lineHeight: 1.75,
        color: "rgba(26,24,25,0.75)",
        paddingLeft: 20,
        margin: 0,
        listStyleType: "disc",
      };
      return (
        <div
          style={{
            display: "flex",
            gap: 0,
            // clear:both so featureColumns is always full-width below any float
            clear: "both",
            margin: "2.8em 0",
            border: `1px solid rgba(201,169,98,0.3)`,
            borderRadius: 10,
            overflow: "hidden",
            background: "rgba(255,255,255,0.32)",
          }}
        >
          {/* Left column */}
          <div style={{ flex: 1, padding: "28px 28px 28px 32px" }}>
            {value.columnOneHeading && (
              <h4 style={colHeadStyle}>{value.columnOneHeading}</h4>
            )}
            {value.columnOneItems && value.columnOneItems.length > 0 && (
              <ul style={listStyle}>
                {value.columnOneItems.map((item, i) => (
                  <li key={i} style={{ marginBottom: "0.35em" }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Vertical divider */}
          <div
            style={{
              width: 1,
              background: "rgba(201,169,98,0.3)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}
          />

          {/* Right column */}
          <div style={{ flex: 1, padding: "28px 32px 28px 28px" }}>
            {value.columnTwoHeading && (
              <h4 style={colHeadStyle}>{value.columnTwoHeading}</h4>
            )}
            {value.columnTwoItems && value.columnTwoItems.length > 0 && (
              <ul style={listStyle}>
                {value.columnTwoItems.map((item, i) => (
                  <li key={i} style={{ marginBottom: "0.35em" }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    },
  },
};

/**
 * BlogPost
 * Reads slug from the URL, fetches the corresponding Sanity post, and renders its
 * full Portable Text body. mainImage is a full-width hero banner above the article
 * header. Author name + circular photo appear next to the published date.
 * Props: None (slug comes from React Router useParams)
 */
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<SanityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    sanityClient
      .fetch<SanityPost>(POST_QUERY, { slug })
      .then((data) => {
        if (!data) {
          setError("Post not found.");
        } else {
          setPost(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch post:", err);
        setError("Unable to load this post. Please try again later.");
        setLoading(false);
      });
  }, [slug]);

  const handleBack = () => {
    sessionStorage.setItem("returnToBlogs", "true");
    navigate("/");
  };

  const sharedBodyStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.05rem",
    lineHeight: 1.8,
    color: "rgba(26,24,25,0.75)",
    maxWidth: 800,
  };

  // Display date: prefer publishedAt over _createdAt
  const displayDate = post?.publishedAt ?? post?._createdAt;

  // Hero image URL (1920×720 crop)
  const heroUrl = post?.mainImage
    ? urlFor(post.mainImage).width(1920).height(720).fit("crop").auto("format").url()
    : null;

  // Author avatar URL (64×64 circle)
  const authorAvatarUrl =
    post?.author?.image
      ? urlFor(post.author.image).width(64).height(64).fit("crop").auto("format").url()
      : null;

  return (
    <main style={{ background: BG, color: FG, minHeight: "100vh" }}>

      {/* ── Hero banner — full-width mainImage above all content ── */}
      {heroUrl && (
        <div
          style={{
            width: "100%",
            height: "clamp(280px, 45vw, 520px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={heroUrl}
            alt={post?.title ?? ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
          {/* BG-tinted scrim at bottom, blending into the page background */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(to top, rgba(211,200,182,0.75), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* ── Content column ── */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: heroUrl ? "56px 24px 96px" : "120px 24px 96px",
        }}
      >

        {/* ── Loading ── */}
        {loading && <p style={sharedBodyStyle}>Loading…</p>}

        {/* ── Error / Not Found ── */}
        {!loading && error && (
          <>
            <p style={{ ...sharedBodyStyle, color: "rgba(180,50,50,0.8)" }}>{error}</p>
            <div style={{ marginTop: 32 }}>
              <button
                onClick={handleBack}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.5rem 1.4rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(26,24,25,0.45)",
                  background: "transparent",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: FG,
                  cursor: "pointer",
                }}
              >
                ← Back to Home
              </button>
            </div>
          </>
        )}

        {/* ── Post content ── */}
        {!loading && post && (
          <>
            {/* ── Article Label Badge ── */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                padding: "0.375rem 1rem",
                borderRadius: "9999px",
                border: "0.5px solid rgba(201,169,98,0.4)",
                background: "rgba(201,169,98,0.07)",
                fontSize: "0.65rem",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              Article
            </span>

            {/* ── Post Title ── */}
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: "0 0 0.45em 0",
              }}
            >
              {post.title}
            </h1>

            {/* ── Excerpt / Subtitle ── */}
            {post.excerpt && (
              <p
                style={{
                  marginTop: 0,
                  marginBottom: "1.1em",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.15rem",
                  lineHeight: 1.6,
                  color: "rgba(26,24,25,0.68)",
                  maxWidth: 720,
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* ── Author + Date row ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 32,
              }}
            >
              {/* Author avatar */}
              {authorAvatarUrl && (
                <img
                  src={authorAvatarUrl}
                  alt={post.author?.name ?? "Author"}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `1.5px solid rgba(201,169,98,0.45)`,
                    flexShrink: 0,
                  }}
                />
              )}

              <div>
                {/* Author name */}
                {post.author?.name && (
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      color: FG,
                    }}
                  >
                    {post.author.name}
                  </span>
                )}

                {/* Published date */}
                {displayDate && (
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                      color: "rgba(26,24,25,0.42)",
                      marginTop: 2,
                    }}
                  >
                    {new Date(displayDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* ── Gold divider rule ── */}
            <div
              style={{
                width: 48,
                height: 2,
                background: GOLD,
                borderRadius: 2,
                marginBottom: 44,
              }}
            />

            {/* ── Portable Text Body ── */}
            {post.body && post.body.length > 0 ? (
              // display:flow-root creates a block formatting context:
              // • floated images stay contained within this div
              // • no clearfix hack needed on the outer wrapper
              <div style={{ maxWidth: 800, display: "flow-root" }}>
                <PortableText value={post.body} components={ptComponents} />
              </div>
            ) : (
              <p style={sharedBodyStyle}>Full article content coming soon.</p>
            )}

            {/* ── Back to Home ── */}
            <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(201,169,98,0.2)" }}>
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center rounded-full border px-5 py-2 text-xs uppercase cursor-pointer"
                style={{
                  background: "transparent",
                  borderColor: "rgba(26,24,25,0.5)",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  letterSpacing: "0.18em",
                  color: FG,
                }}
              >
                ← Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
