import { getBoards } from "@/data/mock/community";
import { WriteForm } from "@/components/community/WriteForm";

export default async function CommunityWritePage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const { board } = await searchParams;
  const boards = await getBoards();
  const selectable = boards.filter((b) => b.type !== "notice");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <WriteForm boards={selectable} defaultSlug={board} />
    </div>
  );
}
