import { MyPageClient } from "@/components/my/MyPageClient";
import { getModels } from "@/data/mock/models";
import { getListings } from "@/data/mock/market";

export const revalidate = 300;

export default async function MyPage() {
  const [models, listings] = await Promise.all([getModels(), getListings()]);
  return <MyPageClient models={models} listings={listings} />;
}
