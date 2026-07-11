import { useLayoutEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { LazyImage } from "@/components/ui/LazyImage";

// Logos
import homeMateLogo from "@/assets/Brand LOGOs/LOGO EXP/HomeMate/HomeMate Logo 1.png";
import italianStandardsLogo from "@/assets/Brand LOGOs/LOGO EXP/Italian Standards/Italian Standards Logo New-06.png";
import lifeSmartLogo from "@/assets/Brand LOGOs/LOGO EXP/LifeSmart/LifeSmart.png";
import schalterLogo from "@/assets/Brand LOGOs/LOGO EXP/Schalter/Schalter Logo-01.png";

const BRANDS = [
  {
    name: "HomeMate",
    logo: homeMateLogo,
    description: "Smart Home Appliances",
    imageClassName: "scale-[1.2]",
  },
  {
    name: "Italian Standards",
    logo: italianStandardsLogo,
    description: "Premium European Lighting Controls",
    imageClassName: "scale-[2]",
  },
  { name: "LifeSmart", logo: lifeSmartLogo, description: "Intelligent IoT Solutions" },
  {
    name: "Schalter",
    logo: schalterLogo,
    description: "Luxury Architectural Switches",
    imageClassName: "scale-[2.6]",
  },
];

export default function BrandsPage() {
  useLenis();

  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative bg-[#0E0D0E] text-[#F5F0E8] min-h-screen flex flex-col">
      <Nav />

      {/* Spacer for Nav */}
      <div className="h-24 md:h-32"></div>

      <section className="relative pb-16 pt-8 md:pb-24 px-6 md:px-16 lg:px-24 grow flex flex-col items-center justify-center">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.04)_0%,transparent_70%)]" />

        <div className="mx-auto w-full max-w-[1400px] relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A962]/30 bg-[#C9A962]/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
            <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#C9A962]">
              Trusted Brands
            </span>
          </div>
          <h1
            className="text-[clamp(36px,6vw,72px)] font-medium leading-[1.1] tracking-[-0.02em] mb-6"
            style={{ fontFamily: "'Runalto', serif" }}
          >
            Our Network of <span className="italic text-[#C9A962]">Excellence</span>
          </h1>
          <p className="text-[clamp(14px,1.2vw,18px)] leading-relaxed text-[#F5F0E8]/70 max-w-[700px] mx-auto mb-16 md:mb-24">
            We partner with industry-leading brands to bring you the highest quality lighting, smart
            home solutions, and architectural hardware. Explore our trusted network of global
            innovators.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {BRANDS.map((brand, i) => (
              <div
                key={brand.name}
                className="group relative overflow-hidden rounded-[1.5rem] border border-[#F5F0E8]/10 bg-[#F5F0E8]/[0.02] backdrop-blur-sm p-10 md:p-12 transition-all duration-700 hover:border-[#C9A962]/30 hover:bg-[#C9A962]/[0.04] hover:-translate-y-2 flex flex-col items-center"
              >
                {/* Top line accent */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C9A962]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="h-28 flex items-center justify-center mb-8 w-full">
                  <LazyImage
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    loading="lazy"
                    className={`max-h-full max-w-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-500 ${brand.imageClassName || ""}`}
                  />
                </div>

                <h3
                  className="text-lg md:text-xl font-medium text-[#F5F0E8] mb-3 text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {brand.name}
                </h3>
                <p className="text-xs md:text-sm text-[#F5F0E8]/50 text-center leading-relaxed">
                  {brand.description}
                </p>

                {/* Background number */}
                <div
                  className="absolute bottom-4 -right-2 text-[80px] font-bold text-transparent leading-none pointer-events-none select-none opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                  style={{
                    fontFamily: "Inter, system-ui",
                    WebkitTextStroke: "1px #C9A962",
                  }}
                >
                  0{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
