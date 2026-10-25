import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Reveal from "@/components/site/Reveal";
import CommandPalette from "@/components/ai/CommandPalette";
import { SITE } from "@/lib/content";
import { ACCENT_BOOT_SCRIPT } from "@/lib/accent";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.seoTitle, template: `%s | ${SITE.name}` },
  description: SITE.seoDescription,
  keywords: SITE.keywords,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE.seoTitle, description: SITE.seoDescription },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/icon.svg" },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Before paint: mark JS available (for scroll reveals) and restore the visitor's colour. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js');${ACCENT_BOOT_SCRIPT}` }} />
      </head>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
          Skip to content
        </a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
        <CommandPalette />
        <Reveal />
      </body>
    </html>
  );
}
