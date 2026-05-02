import { createFileRoute } from "@tanstack/react-router";
import { useLenis } from "@/hooks/useLenis";
import { Nav } from "@/components/lux/Nav";
import { Hero } from "@/components/lux/Hero";
import { Places } from "@/components/lux/collections";
import { WhyChooseUs } from "@/components/lux/WhyChooseUs";
import { Testimonials } from "@/components/lux/products";
import Products from "@/components/lux/light-dark";
import { Feedback } from "@/components/lux/testimonials";
import { Blogs } from "@/components/lux/Blogs";
import { Admission } from "@/components/lux/contact";
import { Footer } from "@/components/lux/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABC-LUX" },
      {
        name: "description",
        content:
          "ABC LUX — luxury architectural & decorative lighting. Crystal chandeliers, sculptural pendants, linear systems and bespoke commissions for a private circle of architects and patrons.",
      },
      { property: "og:title", content: "ABC-LUX" },
      {
        property: "og:description",
        content:
          "Luxury architectural lighting, composed as architecture. By appointment only.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <main className="relative bg-[var(--obsidian)] text-foreground">
      <Nav />
      <Hero />
      <Places />
      <Testimonials />
      <Products />
      <WhyChooseUs />
      <Feedback />
      <Blogs />
      <Admission />
      <Footer />
    </main>
  );
}
