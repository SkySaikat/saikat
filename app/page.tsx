import Experience from "@/components/experience/Experience";
import CommandPalette from "@/components/ai/CommandPalette";
import Hero from "@/components/hero/Hero";
import Nav from "@/components/sections/Nav";
import Proof from "@/components/sections/Proof";
import About from "@/components/sections/About";
import Arsenal from "@/components/sections/Arsenal";
import Work from "@/components/sections/Work";
import AiTwin from "@/components/sections/AiTwin";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Experience />
      <Nav />
      <main>
        <Hero />
        <Proof />
        <About />
        <Arsenal />
        <Work />
        <AiTwin />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
