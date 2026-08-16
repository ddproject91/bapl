import type { MetadataRoute } from "next";
import { getBrands } from "@/data/mock/brands";
import { getModels } from "@/data/mock/models";
import { getNewsList } from "@/data/mock/news";
import { getBoards, getPosts } from "@/data/mock/community";
import { getListingsByCategory } from "@/data/mock/market";

const SITE_URL = "https://bapl.co.kr";

const STATIC_ROUTES = [
  "",
  "/brands",
  "/models",
  "/community",
  "/riding",
  "/riding/best",
  "/riding/courses",
  "/riding/events",
  "/riding/meetups",
  "/riding/places",
  "/riding/records",
  "/riding/tours",
  "/market",
  "/market/apparel",
  "/market/auction",
  "/market/bikes",
  "/market/dealers",
  "/market/gear",
  "/market/groupbuy",
  "/market/parts",
  "/garage",
  "/garage/costs",
  "/garage/cycles",
  "/garage/diagnosis",
  "/garage/faq",
  "/garage/logs",
  "/garage/manuals",
  "/garage/shops",
  "/news",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, models, news, boards, posts, bikeListings] = await Promise.all([
    getBrands(),
    getModels(),
    getNewsList(),
    getBoards(),
    getPosts(),
    getListingsByCategory("bike"),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const brandEntries: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/brands/${brand.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const modelEntries: MetadataRoute.Sitemap = models.map((model) => ({
    url: `${SITE_URL}/models/${model.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const newsEntries: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${SITE_URL}/news/${item.id}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const boardEntries: MetadataRoute.Sitemap = boards.map((board) => ({
    url: `${SITE_URL}/community/${board.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/community/posts/${post.id}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const bikeListingEntries: MetadataRoute.Sitemap = bikeListings.map((listing) => ({
    url: `${SITE_URL}/market/bikes/${listing.id}`,
    lastModified: new Date(listing.createdAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...brandEntries,
    ...modelEntries,
    ...newsEntries,
    ...boardEntries,
    ...postEntries,
    ...bikeListingEntries,
  ];
}
