/* =============================================================
   about.tsx — Dedicated About Us Page
   =============================================================
   Purpose   : Full standalone About Us page with hero, brand story,
               mission/vision, differentiators, statistics, and contact CTA.
   Used by   : Router (mapped to /about)
   Depends on: react, react-router-dom, gsap, IntersectionObserver
   Notes     : Separate from the homepage About section which remains untouched.
   ============================================================= */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAnimationContext } from "@/utils/gsap-setup";
import { useLenis } from "@/hooks/useLenis";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import heroImg from "@/assets/about-hero.png";
import storyImg from "@/assets/about-story.png";
import showroomImg from "@/assets/Abc-Lights-Qatar.webp";

/* ── Counter Animation Hook ── */
function useCountUp(
  target: number,
  suffix: string,
  duration = 2000,
): [React.RefObject<HTMLDivElement | null>, string] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(`0${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setDisplay(`${current.toLocaleString()}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration]);

  return [ref, display];
}

/* ── Scroll Reveal Hook ── */
function useScrollReveal(): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { gsap } = getAnimationContext("about");
    const ctx = gsap.context(() => {
      const reveals = el.querySelectorAll(".about-reveal");
      if (reveals.length) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 50, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

/* ── Statistics Data ── */
const STATS = [
  { value: 7, suffix: "+", label: "Years of\nExperience", icon: "🏆" },
  { value: 2000, suffix: "+", label: "Products\nAvailable", icon: "💡" },
  { value: 12000, suffix: "+", label: "Projects\nCompleted", icon: "🏗️" },
  { value: 100000, suffix: "+", label: "Happy\nCustomers", icon: "😊" },
];

/* ── Differentiators Data ── */
const DIFFERENTIATORS = [
  {
    id: "01",
    title: "Wide Range",
    description:
      "Explore a wide range of lighting solutions designed for both homes & businesses with style & quality.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Expert Guidance",
    description:
      "Get professional assistance to select the perfect lighting that enhances your space with style & efficiency.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Trusted Brands",
    description:
      "We offer high-quality lighting from trusted brands known for innovation, durability, reliability, & excellent performance.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Warranty Assurance",
    description:
      "Enjoy worry-free lighting with assured quality, dependable support, and durable solutions for every space.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

/**
 * AboutPage
 * Dedicated About Us page with multiple scroll-animated sections.
 */
export default function AboutPage() {
  useLenis();
  const navigate = useNavigate();

  const heroRef = useScrollReveal();
  const storyRef = useScrollReveal();
  const missionRef = useScrollReveal();
  const diffRef = useScrollReveal();
  const contactRef = useScrollReveal();

  // Stat counters
  const [statRef1, stat1] = useCountUp(7, "+");
  const [statRef2, stat2] = useCountUp(2, "K+");
  const [statRef3, stat3] = useCountUp(12, "K+");
  const [statRef4, stat4] = useCountUp(100, "K+");
  const statDisplays = [stat1, stat2, stat3, stat4];
  const statRefs = [statRef1, statRef2, statRef3, statRef4];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative bg-[#0E0D0E] text-[#F5F0E8] overflow-x-hidden">
      <Nav />

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO BANNER
          ════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="about-page-hero"
        className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <img
          src={heroImg}
          alt="ABC Lights luxury showroom interior"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0D0E]/80 via-[#0E0D0E]/40 to-[#0E0D0E]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0D0E]/50 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-[900px]">
          {/* Pill Badge */}
          <div className="about-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">
              About Us
            </span>
          </div>

          <h1
            className="about-reveal text-[clamp(36px,8vw,80px)] font-medium leading-[1.05] tracking-[-0.02em] mb-6"
            style={{ fontFamily: "'Runalto', serif" }}
          >
            Illuminating Spaces,{" "}
            <span className="italic text-[#C9A962]">Inspiring Lives</span>
          </h1>

          <p className="about-reveal text-[clamp(14px,1.2vw,18px)] leading-relaxed text-[#F5F0E8]/70 max-w-[640px] mx-auto mb-10">
            Since 2018, ABC Lights has been Qatar's premier destination for
            innovative, high-quality lighting solutions that transform ordinary
            spaces into extraordinary experiences.
          </p>

          {/* Scroll indicator */}
          <div className="about-reveal flex flex-col items-center gap-3 mt-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5F0E8]/40 font-medium">
              Scroll to explore
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-[#C9A962]/60 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — BRAND STORY
          ════════════════════════════════════════════════════ */}
      <section
        ref={storyRef}
        className="relative py-24 md:py-36 lg:py-44 px-6 md:px-16 lg:px-24"
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03] lux-grain" />

        <div className="mx-auto w-full max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text Column */}
            <div className="order-2 lg:order-1">
              <div className="about-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
                <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">
                  Our Story
                </span>
              </div>

              <h2
                className="about-reveal text-[clamp(28px,5vw,56px)] font-medium leading-[1.1] tracking-[-0.02em] mb-8"
                style={{ fontFamily: "'Runalto', serif" }}
              >
                A Legacy of{" "}
                <span className="italic text-[#C9A962]">Brilliance</span>
              </h2>

              <p className="about-reveal text-[clamp(14px,1.1vw,17px)] leading-[1.85] text-[#F5F0E8]/65 mb-6">
                ABC Lights, a proud division of ABC Group Qatar, has been a
                beacon of excellence in the lighting industry since 2018. Our
                journey began with a simple yet ambitious vision: to bring
                world-class lighting solutions to every corner of Qatar.
              </p>
              <p className="about-reveal text-[clamp(14px,1.1vw,17px)] leading-[1.85] text-[#F5F0E8]/65 mb-6">
                From intimate residential spaces to grand commercial projects,
                we've illuminated thousands of spaces with products that marry
                innovation with elegance. Our curated selection spans
                architectural, decorative, and functional lighting from the
                world's most trusted brands.
              </p>
              <p className="about-reveal text-[clamp(14px,1.1vw,17px)] leading-[1.85] text-[#F5F0E8]/65">
                Today, with over 2,000 products and a team of lighting experts,
                we continue to push boundaries — transforming the way Qatar
                experiences light.
              </p>
            </div>

            {/* Image Column */}
            <div className="order-1 lg:order-2 relative group">
              <div className="about-reveal relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] aspect-[4/5] border border-[#F5F0E8]/10">
                <img
                  src={storyImg}
                  alt="ABC Lights team in design studio"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0E]/60 via-transparent to-transparent" />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#C9A962]/20 rounded-[1.5rem] -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#C9A962]/10 rounded-[1.5rem] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — MISSION & VISION
          ════════════════════════════════════════════════════ */}
      <section
        ref={missionRef}
        className="relative py-24 md:py-36 px-6 md:px-16 lg:px-24 overflow-hidden"
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.04)_0%,transparent_70%)]" />

        <div className="mx-auto w-full max-w-[1400px] relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="about-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">
                Guiding Principles
              </span>
            </div>
            <h2
              className="about-reveal text-[clamp(28px,5vw,52px)] font-medium leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: "'Runalto', serif" }}
            >
              Our Mission &{" "}
              <span className="italic text-[#C9A962]">Vision</span>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="about-reveal group relative overflow-hidden rounded-[2rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.03] backdrop-blur-sm p-10 md:p-12 lg:p-14 transition-all duration-700 hover:border-[#C9A962]/30 hover:bg-[#C9A962]/[0.04]">
              {/* Glass highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5F0E8]/10 to-transparent" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-medium text-[#F5F0E8]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Our Mission
                </h3>
              </div>
              <p className="text-[15px] md:text-base leading-[1.85] text-[#F5F0E8]/55">
                To provide high-quality, innovative, and affordable lighting
                solutions that enhance homes and businesses while ensuring
                customer satisfaction through excellent service and support. We
                strive to make premium lighting accessible to everyone,
                combining cutting-edge technology with timeless design
                principles that stand the test of time.
              </p>
              {/* Decorative number */}
              <div className="absolute bottom-6 right-8 text-[120px] font-bold text-[#F5F0E8]/[0.02] leading-none pointer-events-none select-none" style={{ fontFamily: "Inter, system-ui" }}>
                01
              </div>
            </div>

            {/* Vision Card */}
            <div className="about-reveal group relative overflow-hidden rounded-[2rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.03] backdrop-blur-sm p-10 md:p-12 lg:p-14 transition-all duration-700 hover:border-[#C9A962]/30 hover:bg-[#C9A962]/[0.04]">
              {/* Glass highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5F0E8]/10 to-transparent" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-medium text-[#F5F0E8]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Our Vision
                </h3>
              </div>
              <p className="text-[15px] md:text-base leading-[1.85] text-[#F5F0E8]/55">
                To be Qatar's leading lighting provider, known for innovation,
                reliability, and excellence, offering cutting-edge lighting
                solutions that brighten every space. We envision a future where
                every environment — from intimate homes to iconic landmarks —
                is elevated through thoughtful, sustainable illumination that
                inspires and transforms.
              </p>
              {/* Decorative number */}
              <div className="absolute bottom-6 right-8 text-[120px] font-bold text-[#F5F0E8]/[0.02] leading-none pointer-events-none select-none" style={{ fontFamily: "Inter, system-ui" }}>
                02
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — WHAT SETS US APART
          ════════════════════════════════════════════════════ */}
      <section
        ref={diffRef}
        className="relative py-24 md:py-36 px-6 md:px-16 lg:px-24"
      >
        <div className="mx-auto w-full max-w-[1400px] relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="about-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">
                Our Difference
              </span>
            </div>
            <h2
              className="about-reveal text-[clamp(28px,5vw,52px)] font-medium leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: "'Runalto', serif" }}
            >
              What Sets Us{" "}
              <span className="italic text-[#C9A962]">Apart</span>
            </h2>
          </div>

          {/* Differentiator Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {DIFFERENTIATORS.map((item) => (
              <div
                key={item.id}
                className="about-reveal group relative overflow-hidden rounded-[1.5rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.02] p-8 md:p-10 transition-all duration-700 hover:border-[#C9A962]/30 hover:bg-[#C9A962]/[0.05] hover:-translate-y-2"
              >
                {/* Top line accent */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C9A962]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Number */}
                <span className="block text-[11px] uppercase tracking-[0.22em] text-[#C9A962]/50 mb-6 font-medium">
                  — {item.id}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] mb-6 group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                  {item.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-xl md:text-2xl font-medium text-[#F5F0E8] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] md:text-sm leading-[1.75] text-[#F5F0E8]/50">
                  {item.description}
                </p>

                {/* Background number */}
                <div className="absolute bottom-4 right-6 text-[80px] font-bold text-[#F5F0E8]/[0.02] leading-none pointer-events-none select-none" style={{ fontFamily: "Inter, system-ui" }}>
                  {item.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — STATISTICS
          ════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={showroomImg}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[#0E0D0E]/85" />
        </div>
        {/* Gold gradient accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,169,98,0.08)_0%,transparent_60%)]" />

        <div className="mx-auto w-full max-w-[1400px] relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">
                By The Numbers
              </span>
            </div>
            <h2
              className="text-[clamp(28px,5vw,52px)] font-medium leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: "'Runalto', serif" }}
            >
              Numbers That{" "}
              <span className="italic text-[#C9A962]">Speak</span>
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                ref={statRefs[i]}
                className="group relative text-center p-8 md:p-10 rounded-[1.5rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-[#C9A962]/30"
              >
                {/* Counter */}
                <div
                  className="text-[clamp(36px,6vw,64px)] font-bold tracking-tight text-[#C9A962] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {statDisplays[i]}
                </div>

                {/* Label */}
                <div className="text-[11px] md:text-xs uppercase tracking-[0.18em] font-medium text-[#F5F0E8]/50 whitespace-pre-line leading-relaxed">
                  {stat.label}
                </div>

                {/* Divider */}
                <div className="w-8 h-px bg-[#C9A962]/30 mx-auto mt-4 group-hover:w-16 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 6 — CONTACT REDIRECT CTA
          ════════════════════════════════════════════════════ */}
      <section
        ref={contactRef}
        className="relative py-24 md:py-36 px-6 md:px-16 lg:px-24"
      >
        {/* Star divider */}
        <div className="absolute top-0 left-1/2 z-10 w-20 h-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#C9A962" }}>
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-40">
            <path d="M50,0c0,27.6,22.4,50,50,50-27.6,0-50,22.4-50,50,0-27.6-22.4-50-50-50,27.6,0,50-22.4,50-50Z" />
          </svg>
        </div>

        <div className="mx-auto w-full max-w-[1400px] relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="about-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">
                Get In Touch
              </span>
            </div>
            <h2
              className="about-reveal text-[clamp(28px,5vw,52px)] font-medium leading-[1.1] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "'Runalto', serif" }}
            >
              Let's Create Something{" "}
              <span className="italic text-[#C9A962]">Beautiful</span>
            </h2>
            <p className="about-reveal text-[clamp(14px,1.1vw,17px)] leading-relaxed text-[#F5F0E8]/55 max-w-[600px] mx-auto">
              Ready to transform your space? Our team of lighting experts is
              here to help you find the perfect solution.
            </p>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {/* Address */}
            <div className="about-reveal group relative overflow-hidden rounded-[1.5rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.02] p-8 text-center transition-all duration-500 hover:border-[#C9A962]/30">
              <div className="w-12 h-12 rounded-xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] mx-auto mb-5 group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h4 className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#C9A962]/70 mb-3">
                Visit Us
              </h4>
              <p className="font-serif text-base text-[#F5F0E8]/80 leading-relaxed">
                Shop No. 5, Zone 43,
                <br />
                Street, 340 Salwa Road,
                <br />
                Doha, Qatar
              </p>
            </div>

            {/* Phone */}
            <div className="about-reveal group relative overflow-hidden rounded-[1.5rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.02] p-8 text-center transition-all duration-500 hover:border-[#C9A962]/30">
              <div className="w-12 h-12 rounded-xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] mx-auto mb-5 group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <h4 className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#C9A962]/70 mb-3">
                Call Us
              </h4>
              <a href="tel:+97450137888" className="font-serif text-base text-[#F5F0E8]/80 hover:text-[#C9A962] transition-colors block mb-1">
                +974 5013 7888
              </a>
              <a href="tel:+97444683471" className="font-serif text-base text-[#F5F0E8]/80 hover:text-[#C9A962] transition-colors block">
                +974 4468 3471
              </a>
            </div>

            {/* Email */}
            <div className="about-reveal group relative overflow-hidden rounded-[1.5rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.02] p-8 text-center transition-all duration-500 hover:border-[#C9A962]/30">
              <div className="w-12 h-12 rounded-xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] mx-auto mb-5 group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <h4 className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#C9A962]/70 mb-3">
                Email Us
              </h4>
              <a href="mailto:info@abclights.qa" className="font-serif text-base text-[#F5F0E8]/80 hover:text-[#C9A962] transition-colors block">
                info@abclights.qa
              </a>
            </div>

            {/* Hours */}
            <div className="about-reveal group relative overflow-hidden rounded-[1.5rem] border border-[#F5F0E8]/8 bg-[#F5F0E8]/[0.02] p-8 text-center transition-all duration-500 hover:border-[#C9A962]/30">
              <div className="w-12 h-12 rounded-xl bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] mx-auto mb-5 group-hover:bg-[#C9A962] group-hover:text-[#0E0D0E] transition-colors duration-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-4.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <h4 className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#C9A962]/70 mb-3">
                Business Hours
              </h4>
              <p className="font-serif text-base text-[#F5F0E8]/80 leading-relaxed">
                8:00 AM – 10:00 PM
                <br />
                <span className="text-sm text-[#F5F0E8]/50">7 Days a Week</span>
              </p>
            </div>
          </div>

          {/* Social Links + CTA */}
          <div className="about-reveal flex flex-col items-center gap-8">
            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/abclightsqa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0E8]/8 text-[#F5F0E8] transition-all duration-500 hover:bg-[#C9A962] hover:text-[#0E0D0E] hover:scale-110"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a
                href="https://www.instagram.com/abclightsqa/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0E8]/8 text-[#F5F0E8] transition-all duration-500 hover:bg-[#C9A962] hover:text-[#0E0D0E] hover:scale-110"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.01 4.01 0 110-8.019 4.01 4.01 0 010 8.019zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a
                href="https://www.snapchat.com/@abclightsqa?share_id=4J8U7YbuJ9w&locale=en-IN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0E8]/8 text-[#F5F0E8] transition-all duration-500 hover:bg-[#C9A962] hover:text-[#0E0D0E] hover:scale-110"
              >
                <span className="sr-only">Snapchat</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" /></svg>
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0E8]/8 text-[#F5F0E8] transition-all duration-500 hover:bg-[#C9A962] hover:text-[#0E0D0E] hover:scale-110"
              >
                <span className="sr-only">TikTok</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.3a3.1 3.1 0 00-1.25 1.54 3.13 3.13 0 00.32 2.66c.55.85 1.5 1.39 2.5 1.41.97.05 1.97-.33 2.63-1.03.62-.64.95-1.52.93-2.42V.02z" /></svg>
              </a>
            </div>

            {/* CTA Button */}
            <Link
              to="/#contact"
              className="group inline-flex items-center gap-4 rounded-full border border-[#C9A962]/40 bg-[#C9A962]/10 px-10 py-5 text-[#C9A962] transition-all duration-500 hover:bg-[#C9A962] hover:text-[#0E0D0E] hover:scale-105 hover:shadow-[0_0_40px_rgba(201,169,98,0.3)]"
            >
              <span className="text-[12px] uppercase tracking-[0.22em] font-semibold">
                Get In Touch
              </span>
              <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <p className="text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8]/30 mt-2">
              We respond within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════ */}
      <Footer />
    </main>
  );
}
