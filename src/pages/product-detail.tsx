/* =============================================================
   product-detail.tsx — Product Detail Page
   =============================================================
   Purpose   : Displays detailed information and images for a specific product based on route parameters.
   Used by   : Router (mapped to /product/:id)
   Depends on: react-router-dom, GSAP animations, product-data catalog
   Notes     : Handles graceful exit animations if JS routing allows.
               Images are lazy-loaded and revealed with clipPath wipe animations.
               Layout mirrors the Explore Collections masonry grid.
               Each of the 8 products has unique content and 8 images
               with a distinct masonry layout.
   ============================================================= */

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback, useState, useLayoutEffect } from "react";
import { gsap, allowAnimationsFor } from "@/utils/gsap-setup";
import { PRODUCT_CATALOG } from "@/data/product-data";
import { LazyImage } from "@/components/ui/LazyImage";

// Static color definitions for consistent theming across dynamic products
const BG = "#D3C8B6";
const FG = "#1A1819";
const GOLD = "#C9A962";

/**
 * ProductDetail
 * Renders the detail view for a specific lighting product, querying the local product catalog by ID.
 * Props: None (uses URL parameters)
 */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [zoomedImg, setZoomedImg] = useState<{ src: string; alt: string } | null>(null);
  const [activeSubCat, setActiveSubCat] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close zoomed image on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedImg(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const product = PRODUCT_CATALOG.find((p) => p.id === parseInt(id ?? ""));
  const pageTitle = product ? product.name : "Product Not Found";
  const pageDesc = product
    ? product.description
    : "We could not find the details for this specific product.";
  const pageTagline = product?.tagline ?? "";
  const pageCategory = product?.category ?? "Product";

  // Callback ref to collect the inner tile wrappers (the ones with aspect-ratio)
  const setTileRef = useCallback((el: HTMLDivElement | null, i: number) => {
    tileRefs.current[i] = el;
  }, []);

  // Effect: Resets scroll and orchestrates initial entrance animations for the product page
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setActiveSubCat(0);
    const ctx = gsap.context(() => {
      // Staggered entrance for text elements
      gsap.from(".prod-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
      });

      // Scroll-driven animation for the premium background line
      gsap.to(".premium-svg-line", {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [id]);

  // Effect: IntersectionObserver-driven clipPath reveal on the INNER tile divs.
  // The figure (grid item) stays fully visible so the observer can detect it;
  // the inner div with the image is what gets the clipPath wipe animation.
  useLayoutEffect(() => {
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
    if (tiles.length === 0) return;

    // Set initial hidden state — clipPath wipe from bottom (same as Collections)
    tiles.forEach((tile) => {
      tile.style.clipPath = "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)";
      tile.style.willChange = "clip-path";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const tile = entry.target as HTMLDivElement;
          const idx = tiles.indexOf(tile);
          const staggerDelay = idx * 120;

          requestAnimationFrame(() => {
            setTimeout(() => {
              tile.style.transition = "clip-path 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
              tile.style.clipPath = "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)";
            }, staggerDelay);
          });

          observer.unobserve(tile);
        });
      },
      {
        rootMargin: "80px 0px -20px 0px",
        threshold: 0.0,
      },
    );

    tiles.forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, [id]);

  const handleBackToProducts = () => {
    const doNavigate = () => {
      sessionStorage.setItem("returnToProducts", "true");
      navigate("/");
    };

    // On mobile/tablet, GSAP is a no-op stub — navigate immediately
    if (!allowAnimationsFor()) {
      doNavigate();
      return;
    }

    // Animate: Exit sequence fading and translating content out before navigation
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: doNavigate,
    });
  };

  // Smooth sub-category switch: fade out → swap → fade in
  const handleSubCatSwitch = (i: number) => {
    if (i === activeSubCat || isTransitioning) return;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);

    setIsTransitioning(true);
    const grid = gridRef.current;
    if (grid) {
      grid.style.transition = "opacity 0.32s ease, transform 0.32s cubic-bezier(0.4,0,0.2,1)";
      grid.style.opacity = "0";
      grid.style.transform = "translateY(12px)";
    }

    transitionTimer.current = setTimeout(() => {
      setActiveSubCat(i);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (grid) {
            grid.style.opacity = "1";
            grid.style.transform = "translateY(0px)";
          }
          setIsTransitioning(false);
        });
      });
    }, 340);
  };

  // Resolve images and data for the current product
  const subCategories = product?.subCategories;
  const activeImages =
    subCategories && subCategories.length > 0
      ? subCategories[activeSubCat].images
      : (product?.images ?? []);
  const images = activeImages;
  const highlights = product?.highlights ?? [];
  const spaces = product?.spaces ?? [];

  return (
    <main
      style={{ background: BG, color: FG, minHeight: "100vh", position: "relative" }}
      ref={containerRef}
    >
      {/* ── Background SVG Line ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", opacity: 0.6 }}
        >
          <path
            className="premium-svg-line"
            d="M 15,0 C 40,15 85,30 50,55 C 15,80 75,90 85,100"
            fill="none"
            stroke={GOLD}
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: "300",
              strokeDashoffset: "300",
            }}
          />
          <path
            d="M 85,0 C 60,20 15,35 45,60 C 75,85 25,95 15,100"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0.6 }}
          />
        </svg>
      </div>
      {/* Shimmer keyframe for skeleton placeholders */}
      <style>{`
        @keyframes drawPremiumLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes popupFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        @keyframes popupScaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .prod-tile-inner:hover img {
          transform: scale(1.05) !important;
        }
        /* Mobile fallback: stack images vertically */
        @media (max-width: 767px) {
          .prod-masonry-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            height: auto !important;
          }
          .prod-masonry-grid .prod-image-frame {
            margin: 0 !important;
            aspect-ratio: 16/9;
          }
        }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .specs-grid {
            grid-template-columns: 1fr;
          }
        }
        .spec-card {
          background: #1A1819;
          border: 1px solid rgba(201,169,98,0.2);
          border-radius: 0.75rem;
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.2rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .spec-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(26,24,25,0.4);
          border-color: rgba(201,169,98,0.6);
        }
        .spec-card-icon {
          color: #C9A962;
          font-size: 1.75rem;
        }
        .spec-card-text {
          color: #D3C8B6;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          line-height: 1.5;
          letter-spacing: 0.02em;
          opacity: 0.9;
        }
      `}</style>

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "120px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ── Category Badge ── */}
        <span
          className="prod-title"
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
          {pageCategory}
        </span>

        {/* ── Product Name Heading ── */}
        <h1
          className="prod-title"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {pageTitle}
        </h1>

        {/* ── Product Tagline ── */}
        {pageTagline && (
          <p
            className="prod-title"
            style={{
              marginTop: 12,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              fontStyle: "italic",
              fontWeight: 300,
              lineHeight: 1.4,
              color: GOLD,
              letterSpacing: "0.02em",
            }}
          >
            {pageTagline}
          </p>
        )}

        {/* ── Product Description ── */}
        <p
          className="prod-title"
          style={{
            marginTop: 24,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "rgba(26,24,25,0.75)",
            maxWidth: 800,
            marginBottom: 48,
          }}
        >
          {pageDesc}
        </p>

        {/* ── Sub-Category Toggle — sliding pill indicator ── */}
        {subCategories && subCategories.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2.5rem",
            }}
          >
            {/* Outer track */}
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(26,24,25,0.07)",
                border: "0.5px solid rgba(201,169,98,0.25)",
                borderRadius: "9999px",
                padding: "5px",
              }}
            >
              {/* Sliding pill — absolutely positioned behind the buttons */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "5px",
                  height: "calc(100% - 10px)",
                  width: `calc(${100 / subCategories.length}% - 5px)`,
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #1A1819 0%, #2d2a2b 100%)",
                  boxShadow: "0 2px 14px rgba(26,24,25,0.22)",
                  transform: `translateX(calc(${activeSubCat * 100}% + ${activeSubCat * 4}px))`,
                  transition: "transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              {/* Buttons — sit above the sliding pill */}
              {subCategories.map((cat, i) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => handleSubCatSwitch(i)}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "0.55rem 1.8rem",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: isTransitioning ? "default" : "pointer",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "0.8rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    background: "transparent",
                    color: activeSubCat === i ? "#D3C8B6" : "rgba(26,24,25,0.5)",
                    transition: "color 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    userSelect: "none",
                    minWidth: "130px",
                    textAlign: "center",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Masonry Image Grid — uniform layout per product ── */}
        <div
          ref={gridRef}
          className="prod-masonry-grid"
          style={{
            display: "grid",
            width: "100%",
            height: "clamp(600px, 70vh, 950px)",
            gap: "clamp(10px, 1.2vw, 16px)",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "2fr 1fr 1.2fr",
            gridAutoFlow: "dense",
            opacity: 1,
            transform: "translateY(0px)",
          }}
        >
          {images.map((img, i) => (
            <figure
              key={i}
              className="prod-image-frame"
              style={{
                position: "relative",
                zIndex: 10,
                margin: 0,
                gridColumn: img.gridColumn,
                gridRow: img.gridRow,
                overflow: "hidden",
                borderRadius: "0.5rem",
              }}
            >
              {/* Inner tile — this gets the clipPath reveal animation */}
              <div
                ref={(el) => setTileRef(el, i)}
                className="prod-tile-inner"
                onClick={() => setZoomedImg({ src: img.src, alt: img.alt })}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "inherit",
                  cursor: "zoom-in",
                }}
              >
                <LazyImage
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Subtle inner border for premium frame effect */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    border: "1px solid rgba(245,240,232,0.08)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
              </div>
            </figure>
          ))}
        </div>

        {/* ── Product Specifications / Highlights ── */}
        <div className="prod-specs-container" style={{ marginTop: "8rem" }}>
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "2.2rem",
              color: FG,
              marginBottom: "3rem",
              fontWeight: 400,
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            Highlights
          </h3>
          <div className="specs-grid" style={{ marginBottom: "5rem" }}>
            {highlights.map((point, idx) => (
              <div key={idx} className="spec-card">
                <span className="spec-card-icon">✦</span>
                <span className="spec-card-text">{point}</span>
              </div>
            ))}
          </div>

          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "2.2rem",
              color: FG,
              marginBottom: "3rem",
              fontWeight: 400,
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            Perfect for any space
          </h3>
          <div className="specs-grid">
            {spaces.map((point, idx) => (
              <div key={idx} className="spec-card">
                <span className="spec-card-icon">✧</span>
                <span className="spec-card-text">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Back Navigation Button ── */}
        <div className="prod-title" style={{ marginTop: 60, textAlign: "center" }}>
          <button
            onClick={handleBackToProducts}
            className="inline-flex items-center justify-center rounded-full border px-8 py-3 text-sm uppercase transition-all duration-300 text-[#1A1819] hover:bg-[#1A1819] hover:text-[#D3C8B6]"
            style={{
              borderColor: "rgba(26,24,25,0.55)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: "0.18em",
            }}
          >
            Back to Products
          </button>
        </div>

        {/* ── Lightbox Overlay ── */}
        {zoomedImg && (
          <div
            className="lightbox-overlay"
            onClick={() => setZoomedImg(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              backgroundColor: "rgba(26, 24, 25, 0.85)",
              WebkitBackdropFilter: "blur(12px)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-out",
              padding: "2rem",
              animation: "popupFadeIn 0.3s ease forwards",
            }}
          >
            <img
              src={zoomedImg.src}
              alt={zoomedImg.alt}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                borderRadius: "8px",
                animation: "popupScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
