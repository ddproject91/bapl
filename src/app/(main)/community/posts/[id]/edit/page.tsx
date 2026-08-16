import { getBoards } from "@/data/mock/community";
import { EditPostForm } from "@/components/community/EditPostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const boards = await getBoards();
  const selectable = boards.filter((b) => b.type !== "notice");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <EditPostForm postId={id} boards={selectable} />
    </div>
  );
}
