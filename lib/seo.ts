import { FAQ, PROJECTS, SERVICES, SITE, STACK, type Project } from "./content";

// schema.org JSON-LD, built from the same content the page renders.

const PERSON_ID = `${SITE.url}/#person`;
const SERVICE_ID = `${SITE.url}/#service`;
const WEBSITE_ID = `${SITE.url}/#website`;

const address = {
  "@type": "PostalAddress",
  addressLocality: SITE.city,
  addressRegion: SITE.region,
  addressCountry: SITE.countryCode,
};

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.name,
    givenName: SITE.firstName,
    familyName: SITE.lastName,
    url: SITE.url,
    image: `${SITE.url}${SITE.portrait}`,
    email: `mailto:${SITE.email}`,
    jobTitle: SITE.roleLong,
    description: SITE.seoDescription,
    address,
    homeLocation: { "@type": "Place", name: `${SITE.city} (Chittagong), ${SITE.country}`, address },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Premier University", address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.countryCode } },
    hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: SITE.degree },
    worksFor: { "@type": "Organization", name: SITE.studio.name, ...(SITE.studio.url ? { url: SITE.studio.url } : {}) },
    knowsAbout: [...new Set(["Web Development", "Full-Stack Development", "Technical SEO", ...STACK.flatMap((g) => g.items)])],
    sameAs: Object.values(SITE.socials),
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personSchema(),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        description: SITE.seoDescription,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}/#webpage`,
        url: SITE.url,
        name: SITE.seoTitle,
        description: SITE.seoDescription,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        primaryImageOfPage: `${SITE.url}${SITE.portrait}`,
      },
      {
        "@type": "ProfessionalService",
        "@id": SERVICE_ID,
        name: `${SITE.name}, Full-Stack Web Development`,
        url: SITE.url,
        image: `${SITE.url}${SITE.portrait}`,
        email: SITE.email,
        description: SITE.seoDescription,
        address,
        areaServed: ["Worldwide", "Europe", "North America", "Asia", "Bangladesh"],
        founder: { "@id": PERSON_ID },
        knowsLanguage: ["en", "bn"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web development services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.body, provider: { "@id": PERSON_ID } },
          })),
        },
      },
      {
        "@type": "ItemList",
        name: "Case studies",
        itemListElement: PROJECTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE.url}/work/${p.slug}`,
          name: p.title,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function projectGraph(p: Project) {
  const url = `${SITE.url}/work/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE.url}/#work` },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: p.title,
        headline: p.title,
        description: p.summary,
        genre: p.category,
        keywords: p.tech.join(", "),
        inLanguage: "en",
        ...(p.shots[0] ? { image: `${SITE.url}${p.shots[0].src}` } : {}),
        author: { "@id": PERSON_ID, "@type": "Person", name: SITE.name, url: SITE.url },
        creator: { "@id": PERSON_ID },
      },
    ],
  };
}

export function JsonLdString(data: object) {
  // Escape "<" so content can never close the script tag early.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
