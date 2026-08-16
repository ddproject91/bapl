import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Post } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { compactNumber } from "@/lib/utils";

/** 글 목록 한 줄 (리스트형). 공지는 상단 고정 스타일. */
export async function PostRow({
  post,
  showBoard = false,
  boardLabel,
}: {
  post: Post;
  showBoard?: boolean;
  boardLabel?: string;
}) {
  const t = await getTranslations("community");
  const isQnaAccepted = post.isAcceptedAnswer;

  return (
    <Link
      href={`/community/posts/${post.id}`}
      className={
        "flex flex-col gap-1.5 p-4 transition-colors hover:bg-bg-elevated " +
        (post.isNotice ? "bg-neon/[0.04]" : "")
      }
    >
      <div className="flex items-center gap-2">
        {post.isNotice && (
          <Badge variant="neon">📢 {t("badge.notice")}</Badge>
        )}
        {post.hasVideo && (
          <Badge variant="info">🎥 {t("badge.video")}</Badge>
        )}
        {isQnaAccepted && (
          <Badge variant="neon" glow>
            ✓ {t("badge.accepted")}
          </Badge>
        )}
        {showBoard && boardLabel && (
          <span className="text-[11px] font-medium text-fg-subtle">
            {boardLabel}
          </span>
        )}
        <h3
          className={
            "line-clamp-1 flex-1 text-sm font-bold " +
            (post.isNotice ? "text-fg" : "")
          }
        >
          {post.title}
        </h3>
      </div>

      {post.excerpt && (
        <p className="line-clamp-1 text-xs text-fg-muted">{post.excerpt}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-fg-subtle">
        <span className="inline-flex items-center gap-1 font-medium text-fg-muted">
          {post.author}
          {post.authorVerified && (
            <span className="text-neon" title={t("badge.riderVerified")}>
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
        <span>
          👍 {compactNumber(post.likeCount)}
        </span>
        <span>
          💬 {compactNumber(post.commentCount)}
        </span>
      </div>
    </Link>
  );
}
