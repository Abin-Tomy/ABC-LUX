/* =============================================================
   blog.tsx — Dynamic Blog Listing Page
   =============================================================
   Purpose   : Fetches all Sanity post documents and renders them as styled cards.
   Used by   : Router (mapped to /blog)
   Depends on: react-router-dom, @sanity/client, @sanity/image-url, src/lib/sanity.ts
   Notes     : Styled to match the BG/FG/GOLD palette from the static article pages.
               Uses mainImage (Sanity Blog template field) via urlFor for thumbnails.
   ============================================================= */

import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sanityClient, urlFor } from "@/lib/sanity";

// ─── Brand colours (matches article-1/2/3 and Blogs.tsx) ─────────────────────
const BG = "#D3C8B6";
const FG = "#1A1819";
const GOLD = "#C9A962";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SanityImageRef {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: SanityImageRef;
  _createdAt: string;
}

// ─── GROQ query — all post fields needed for the listing card ─────────────────
// Fetches the mainImage reference so urlFor() can build a sized URL client-side.
const POSTS_QUERY = `*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  _createdAt
}`;

/**
 * Blog
 * Fetches and lists all Sanity posts as cards. Loading and error states are handled gracefully.
 * Props: None
 */
export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<SanityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch posts from Sanity on mount
  useEffect(() => {
    sanityClient
      .fetch<SanityPost[]>(POSTS_QUERY)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blog posts:", err);
        setError("Unable to load posts. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    sessionStorage.setItem("returnToBlogs", "true");
    navigate("/");
  };

  return (
    <main style={{ background: BG, color: FG, minHeight: "100vh" }}>
      <style>{`
        .blg-list-card {
          border-radius: 12px;
          overflow: hidden;
          border: 0.5px solid rgba(201,169,98,0.25);
          background: rgba(255,255,255,0.18);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .blg-list-card:hover {
          box-shadow: 0 8px 40px rgba(0,0,0,0.10);
          transform: translateY(-3px);
        }
        .blg-list-card-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }
        .blg-list-card-body {
          padding: 28px 28px 24px;
        }
        .blg-read-btn {
          display: inline-flex;
          align-items: center;
          margin-top: 16px;
          padding: 8px 20px;
          border-radius: 9999px;
          border: 1px solid rgba(26,24,25,0.45);
          background: transparent;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${FG};
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .blg-read-btn:hover {
          border-color: ${GOLD};
          color: ${GOLD};
          transform: translateY(-1px);
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 80px" }}>
        {/* ── Page Header ── */}
        <div style={{ marginBottom: 60 }}>
          {/* Badge */}
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
            Blog &amp; News
          </span>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Latest <em>Insights</em>
          </h1>

          {/* Gold rule */}
          <div style={{ width: 48, height: 2, background: GOLD, borderRadius: 2, marginTop: 24 }} />
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.1rem",
              color: "rgba(26,24,25,0.55)",
            }}
          >
            Loading posts…
          </p>
        )}

        {/* ── Error state ── */}
        {error && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.05rem",
              color: "rgba(180,50,50,0.8)",
            }}
          >
            {error}
          </p>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && posts.length === 0 && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.05rem",
              color: "rgba(26,24,25,0.55)",
            }}
          >
            No posts published yet — check back soon.
          </p>
        )}

        {/* ── Posts grid ── */}
        {!loading && posts.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 32,
            }}
          >
            {posts.map((post) => {
              // Build a 640-wide thumbnail from the Sanity image reference
              const thumbUrl = post.mainImage
                ? urlFor(post.mainImage).width(640).height(440).fit("crop").auto("format").url()
                : null;

              return (
                <article key={post._id} className="blg-list-card">
                  {/* Thumbnail — mainImage via urlFor */}
                  {thumbUrl && (
                    <img
                      src={thumbUrl}
                      alt={post.title}
                      className="blg-list-card-img"
                      loading="lazy"
                    />
                  )}

                  <div className="blg-list-card-body">
                    {/* Article badge */}
                    <span
                      style={{
                        display: "inline-block",
                        marginBottom: "0.75rem",
                        fontSize: "0.62rem",
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 300,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: GOLD,
                      }}
                    >
                      Article
                    </span>

                    {/* Post title */}
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                        fontWeight: 400,
                        lineHeight: 1.15,
                        letterSpacing: "-0.01em",
                        margin: 0,
                        color: FG,
                      }}
                    >
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p
                        style={{
                          marginTop: 12,
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1rem",
                          lineHeight: 1.7,
                          color: "rgba(26,24,25,0.7)",
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    {/* Date */}
                    <p
                      style={{
                        marginTop: 10,
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "0.78rem",
                        letterSpacing: "0.1em",
                        color: "rgba(26,24,25,0.4)",
                      }}
                    >
                      {new Date(post._createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {/* Read More link */}
                    <Link
                      className="blg-read-btn"
                      to={`/blog/${post.slug.current}`}
                      aria-label={`Read ${post.title}`}
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ── Back to Home ── */}
        <div style={{ marginTop: 64 }}>
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
      </div>
    </main>
  );
}
