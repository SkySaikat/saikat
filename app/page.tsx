import Hero from "@/components/home/Hero";
import Services, { Marquee } from "@/components/home/Services";
import Work from "@/components/home/Work";
import { About, Stack, Testimonials } from "@/components/home/About";
import Faq from "@/components/home/Faq";
import Contact from "@/components/home/Contact";
import { homeGraph, JsonLdString } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JsonLdString(homeGraph()) }} />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <About />
        <Stack />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
