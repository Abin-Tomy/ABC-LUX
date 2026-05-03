import { useEffect, useRef, useState } from "react";
import { gsap } from "@/utils/gsap-setup";
import { MenuOverlay } from "./MenuOverlay";
import logoWhite from "@/assets/ABC-LUX-Logo_White.webp";
import logoBlack from "@/assets/ABC-LUX-Logo_Black.webp";

// Sections that have a dark background — logo should be white here
const DARK_SECTIONS = ["hero-curve", "collections", "contact", "footer"];

// Sections that have a light background — logo should be black here
const LIGHT_SECTIONS = ["top", "our-products", "products", "why-choose-us", "feedback", "blogs"];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [logoDark, setLogoDark] = useState(true); // false = use white logo, true = use black logo
  const ref = useRef<HTMLElement | null>(null);

  const logoDarkRef = useRef(true);

  useEffect(() => {
    const sectionMap: Record<string, boolean> = {};
    DARK_SECTIONS.forEach((id) => { sectionMap[id] = false; });
    LIGHT_SECTIONS.forEach((id) => { sectionMap[id] = true; });

    const checkOrder = [
      "top",
      "collections",
      "our-products",
      "products",
      "why-choose-us",
      "feedback",
      "blogs",
      "contact",
      "footer",
      "hero-curve",
    ];

    // Cache element references once — never query DOM inside the tick loop
    const sectionEls: Array<{ id: string; el: HTMLElement }> = [];
    checkOrder.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionEls.push({ id, el });
    });

    // Throttle: only run the check every 6 frames (~10 times/sec) not 60
    let frameCount = 0;

    const checkLogoColor = () => {
      frameCount++;
      if (frameCount % 6 !== 0) return;

      const triggerY = window.innerHeight * 0.12;
      let activeId: string | null = null;

      for (const { id, el } of sectionEls) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          activeId = id;
        }
      }

      if (activeId !== null) {
        const isDark = sectionMap[activeId];
        if (logoDarkRef.current !== isDark) {
          logoDarkRef.current = isDark;
          setLogoDark(isDark);
        }
      }
    };

    gsap.ticker.add(checkLogoColor);
    checkLogoColor();

    return () => {
      gsap.ticker.remove(checkLogoColor);
    };
  }, []);

  return (
    <>
      <header
        ref={ref}
        className="lux-site-header pointer-events-none fixed inset-x-0 top-0 z-[120] px-6 py-5"
      >
        <div className="lux-nav-inner mx-auto flex w-full max-w-[1600px] items-start justify-between gap-4">
          {/* Logo */}
          <a
            href="#top"
            data-cursor="HOME"
            aria-label="ABC LUX — Home"
            className="pointer-events-auto inline-flex items-center transition-opacity hover:opacity-80"
          >
            <img
              src={logoDark ? logoBlack : logoWhite}
              alt="ABC LUX"
              width={600}
              height={180}
              className="lux-logo-img h-9 w-auto select-none object-contain md:h-12 relative z-10 -mt-2"
              style={{
                transition: "opacity 0.4s ease",
              }}
            />
          </a>

          {/* Center nav — unchanged from original */}
          <nav className="lux-center-nav pointer-events-auto absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-6 md:flex">
            <a
              href="#products"
              data-cursor="VIEW"
              className="lux-eyebrow rounded-[10px] bg-white/10 px-20 py-2.5 text-white/95 text-[13px] font-bold tracking-[0.1em] backdrop-blur-md transition-all hover:bg-white/20"
            >
              PRODUCTS
            </a>
            <span className="h-10 w-[1px] bg-[#1a1a1a]/60" />
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              data-cursor="VIEW"
              className="lux-eyebrow rounded-[10px] bg-white/10 px-20 py-2.5 text-white/95 text-[13px] font-bold tracking-[0.1em] backdrop-blur-md transition-all hover:bg-white/20"
            >
              BRANDS
            </a>
          </nav>

          {/* Right cluster — unchanged from original */}
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              data-cursor="OPEN"
              aria-label="Open menu"
              className="lux-menu-btn lux-eyebrow group flex w-[180px] md:w-[220px] items-center justify-between rounded-[10px] border px-4 md:px-6 py-2.5 backdrop-blur-md transition-colors"
              style={{
                background: "rgba(255,255,255,0.85)",
                color: "var(--obsidian)",
                borderColor: "rgba(20,20,20,0.1)",
              }}
            >
              <span className="flex flex-col gap-[4px] w-[24px] items-end">
                <span className="block h-[1.5px] w-[20px] bg-current transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[28px]" />
                <span className="block h-[1.5px] w-[24px] bg-current transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[10px] group-hover:-translate-x-[8px]" />
                <span className="block h-[1.5px] w-[14px] bg-current self-start ml-[4px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[26px]" />
              </span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
