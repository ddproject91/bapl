import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getBoards,
  getBoard,
  getPostsByBoard,
} from "@/data/mock/community";
import { PageHeader, Card, EmptyState } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { WriteButton } from "@/components/community/WriteButton";
import { PostRow } from "@/components/community/PostRow";

export const revalidate = 300;

export async function generateStaticParams() {
  const boards = await getBoards();
  return boards.map((b) => ({ slug: b.slug }));
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = await getBoard(slug);
  if (!board) notFound();

  const t = await getTranslations("community");
  const c = await getTranslations("common");
  const boards = await getBoards();

  const boardPosts = await getPostsByBoard(slug);
  // 공지 상단 고정 → 최신순
  const ordered = [...boardPosts].sort((a, b) => {
    if (!!a.isNotice !== !!b.isNotice) return a.isNotice ? -1 : 1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="animate-fade-up">
        <Link
          href="/community"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-fg-muted transition-colors hover:text-neon"
        >
          ← {t("backToHub")}
        </Link>
        <PageHeader
          title={`${board.icon} ${board.name}`}
          description={board.description}
          action={<WriteButton boardSlug={slug} />}
        />
      </div>

      {board.type === "accident" && (
        <div className="mt-5 animate-fade-up rounded-2xl border border-warning/40 bg-warning/10 p-4">
          <p className="flex items-start gap-2 text-xs text-warning">
            <span aria-hidden>⚠️</span>
            <span>{t("post.accidentNotice")}</span>
          </p>
        </div>
      )}

      <section className="mt-6 animate-fade-up">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-fg-muted">
            {t("listTitle")}
          </h2>
          <Badge variant="muted">
            {t("postCount", { count: boardPosts.length })}
          </Badge>
        </div>

        {ordered.length === 0 ? (
          <EmptyState
            title={t("empty")}
            hint={t("emptyHint")}
            icon={board.icon}
          />
        ) : (
          <Card className="divide-y divide-border overflow-hidden">
            {ordered.map((p) => (
              <PostRow key={p.id} post={p} />
            ))}
          </Card>
        )}
      </section>

      {/* 다른 게시판 이동 */}
      <section className="mt-10 animate-fade-up">
        <h2 className="mb-3 text-sm font-bold text-fg-muted">
          {c("nav.community")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {boards
            .filter((b) => b.slug !== slug)
            .map((b) => (
              <Link
                key={b.slug}
                href={`/community/${b.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                <span aria-hidden>{b.icon}</span>
                {b.name}
              </Link>
            ))}
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
