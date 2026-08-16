import { ProfileEditForm } from "@/components/my/ProfileEditForm";

export default async function MyEditPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  return <ProfileEditForm welcome={welcome === "1"} />;
}
