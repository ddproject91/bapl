import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { createClient } from "@supabase/supabase-js";
import { brandsFallback } from "../src/data/mock/brands";
import { modelsFallback } from "../src/data/mock/models";
import { newsFallback } from "../src/data/mock/news";
import { boardsFallback, postsFallback, commentsFallback } from "../src/data/mock/community";
import { listingsFallback, groupbuyMetaFallback, auctionMetaFallback } from "../src/data/mock/market";
import {
  meetupsFallback,
  coursesFallback,
  eventsFallback,
  placesFallback,
  tourPackagesFallback,
} from "../src/data/mock/riding";
import {
  maintenanceGuidesFallback,
  consumableCyclesFallback,
  repairCostsFallback,
  diagnosisFlowsFallback,
  faqFallback,
  shopPreviewsFallback,
} from "../src/data/mock/garage";
import { bikePhotosFallback } from "../src/data/mock/media";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY가 .env.local에 설정되어 있어야 합니다.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const rows: { key: string; data: unknown }[] = [
  { key: "brands", data: brandsFallback },
  { key: "models", data: modelsFallback },
  { key: "news", data: newsFallback },
  { key: "community.boards", data: boardsFallback },
  { key: "community.posts", data: postsFallback },
  { key: "community.comments", data: commentsFallback },
  { key: "market.listings", data: listingsFallback },
  { key: "market.groupbuyMeta", data: groupbuyMetaFallback },
  { key: "market.auctionMeta", data: auctionMetaFallback },
  { key: "riding.meetups", data: meetupsFallback },
  { key: "riding.courses", data: coursesFallback },
  { key: "riding.events", data: eventsFallback },
  { key: "riding.places", data: placesFallback },
  { key: "riding.tourPackages", data: tourPackagesFallback },
  { key: "garage.maintenanceGuides", data: maintenanceGuidesFallback },
  { key: "garage.consumableCycles", data: consumableCyclesFallback },
  { key: "garage.repairCosts", data: repairCostsFallback },
  { key: "garage.diagnosisFlows", data: diagnosisFlowsFallback },
  { key: "garage.faq", data: faqFallback },
  { key: "garage.shopPreviews", data: shopPreviewsFallback },
  { key: "media.bikePhotos", data: bikePhotosFallback },
];

async function main() {
  for (const row of rows) {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: row.key, data: row.data, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) {
      console.error(`✗ ${row.key}: ${error.message}`);
    } else {
      console.log(`✓ ${row.key}`);
    }
  }
}

main();
