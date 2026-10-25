import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saikatchowdhury.com"),
  title: "Saikat Chowdhury | Full-Stack Developer & AI Solutions Architect",
  description:
    "Full-Stack Web Developer, Web Team Lead and AI Solutions Architect with 6+ years building Next.js platforms, custom WordPress plugins, MCP servers and AI automation. Founder of Wonder Web Studio.",
  openGraph: {
    title: "Saikat Chowdhury",
    description: "Full-Stack Web Developer, Web Team Lead & AI Solutions Architect.",
    images: ["/img/saikat.png"],
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so reveal targets start hidden only when they will animate. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
