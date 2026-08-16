import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getPosts,
  getPost,
  getBoard,
  getCommentsByPost,
} from "@/data/mock/community";
import { PageHeader, Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { PostActions } from "@/components/community/PostActions";
import { CommentForm } from "@/components/community/CommentForm";
import { compactNumber } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const board = await getBoard(post.boardSlug);
  const t = await getTranslations("community");
  const c = await getTranslations("common");
  const postComments = await getCommentsByPost(post.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* 상단 이동 */}
      <div className="animate-fade-up">
        <Link
          href={`/community/${post.boardSlug}`}
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-fg-muted transition-colors hover:text-neon"
        >
          ← {board ? `${board.icon} ${board.name}` : t("backToHub")}
        </Link>
      </div>

      {/* ── 제목/메타 ── */}
      <article className="animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          {post.isNotice && <Badge variant="neon">📢 {t("badge.notice")}</Badge>}
          {post.hasVideo && <Badge variant="info">🎥 {t("badge.video")}</Badge>}
          {post.isAcceptedAnswer && (
            <Badge variant="neon" glow>
              ✓ {t("badge.accepted")}
            </Badge>
          )}
        </div>
        <h1 className="mt-2 text-xl font-black tracking-tight md:text-2xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border pb-4 text-xs text-fg-subtle">
          <span className="inline-flex items-center gap-1 font-medium text-fg">
            {post.author}
            {post.authorVerified && (
              <span
                className="inline-flex items-center gap-0.5 text-neon"
                title={t("badge.riderVerified")}
              >
                ✔
              </span>
            )}
          </span>
          <span aria-hidden>·</span>
          <span>{post.createdAt}</span>
          <span aria-hidden>·</span>
          <span>
            {t("label.views")} {compactNumber(post.viewCount)}
          </span>
        </div>

        {/* 사고/블랙박스 개인정보 주의 */}
        {board?.type === "accident" && (
          <div className="mt-5 rounded-2xl border border-warning/40 bg-warning/10 p-4">
            <p className="flex items-start gap-2 text-xs text-warning">
              <span aria-hidden>⚠️</span>
              <span>{t("post.accidentNotice")}</span>
            </p>
          </div>
        )}

        {/* 영상 플레이스홀더 */}
        {post.hasVideo && (
          <div className="mt-5 flex aspect-video items-center justify-center rounded-2xl border border-border bg-bg-elevated">
            <div className="text-center">
              <span className="text-3xl opacity-60" aria-hidden>
                🎥
              </span>
              <p className="mt-2 text-xs text-fg-subtle">
                {t("post.videoNotice")}
              </p>
            </div>
          </div>
        )}

        {/* 본문 */}
        <div className="mt-5 whitespace-pre-line text-sm leading-relaxed text-fg md:text-[15px]">
          {post.content}
        </div>
      </article>

      {/* ── 액션 바 ── */}
      <div className="mt-6 animate-fade-up">
        <PostActions
          postId={post.id}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
        />
      </div>

      {/* ── 댓글 ── */}
      <section className="mt-8 animate-fade-up">
        <h2 className="mb-3 text-sm font-bold">
          {t("post.commentsTitle")}{" "}
          <span className="font-mono text-neon">{postComments.length}</span>
        </h2>

        {postComments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border py-8 text-center text-xs text-fg-subtle">
            {t("post.commentEmpty")}
          </p>
        ) : (
          <div className="space-y-3">
            {postComments.map((cm) => (
              <Card
                key={cm.id}
                className={
                  "p-4 " +
                  (cm.isAccepted ? "border-neon/40 bg-neon/[0.05]" : "")
                }
              >
                {cm.isAccepted && (
                  <div className="mb-2">
                    <Badge variant="neon" glow>
                      ✓ {t("post.acceptedComment")}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-fg">
                    {cm.author}
                    {cm.authorVerified && (
                      <span
                        className="text-neon"
                        title={t("badge.riderVerified")}
                      >
                        ✔
                      </span>
                    )}
                  </span>
                  <span className="text-fg-subtle">{cm.createdAt}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg">
                  {cm.content}
                </p>
                <div className="mt-2 text-[11px] text-fg-subtle">
                  👍 {compactNumber(cm.likeCount)}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 댓글 입력 */}
        <CommentForm postId={post.id} />
      </section>

      <p className="mt-8 text-center text-[11px] text-fg-subtle">
        {c("footer.notice")}
      </p>

      <div className="h-8" />
    </div>
  );
}
