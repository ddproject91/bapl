import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/my"],
    },
    sitemap: "https://bapl.co.kr/sitemap.xml",
  };
}
