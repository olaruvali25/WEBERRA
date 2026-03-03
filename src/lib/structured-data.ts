import { absoluteUrl } from "@/src/lib/utils";
import type { AppLocale } from "@/src/i18n/routing";

export function buildStructuredData(locale: AppLocale) {
  const isRo = locale === "ro";
  const basePath = isRo ? "/" : "/en";
  const demoPath = isRo ? "/demo-website-presentation" : "/en/demo-website-presentation";

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Weberra",
      url: absoluteUrl(basePath),
      logo: absoluteUrl("/icon.svg"),
      email: "hello@weberra.ro",
      sameAs: [
        "https://www.instagram.com/weberra",
        "https://www.linkedin.com/company/weberra"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Weberra",
      url: absoluteUrl(basePath),
      inLanguage: isRo ? "ro-RO" : "en-US",
      potentialAction: {
        "@type": "CommunicateAction",
        target: absoluteUrl(demoPath)
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: isRo ? "Demo website premium pentru afaceri din Romania" : "Premium website demo for Romanian businesses",
      provider: {
        "@type": "Organization",
        name: "Weberra"
      },
      areaServed: {
        "@type": "Country",
        name: "Romania"
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "RON"
      },
      url: absoluteUrl(demoPath),
      description: isRo
        ? "Demo homepage premium, structura recomandata si directie SEO de baza pentru afaceri din Romania."
        : "Premium homepage demo, recommended structure and basic SEO direction for Romanian businesses."
    }
  ];
}
