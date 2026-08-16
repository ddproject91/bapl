import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getBoards, getPosts, getPostCount } from "@/data/mock/community";
import { PageHeader, SectionHeader, Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { WriteButton } from "@/components/community/WriteButton";
import { PostRow } from "@/components/community/PostRow";

export const revalidate = 300;

export default async function CommunityPage() {
  const t = await getTranslations("community");
  const c = await getTranslations("common");
  const boards = await getBoards();
  const posts = await getPosts();

  const boardName = (slug: string) =>
    boards.find((b) => b.slug === slug)?.name ?? slug;

  const hotPosts = [...posts]
    .filter((p) => !p.isNotice)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 6);

  const latestPosts = [...posts]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6);

  const postCounts = Object.fromEntries(
    await Promise.all(
      boards.map(async (b) => [b.slug, await getPostCount(b.slug)] as const),
    ),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="animate-fade-up">
        <PageHeader
          title={t("title")}
          description={t("description")}
          action={<WriteButton />}
        />
      </div>

      {/* ── 라이더 인증 배너 ── */}
      <section className="mt-6 animate-fade-up">
        <Card className="relative overflow-hidden p-5 md:p-6">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(120% 120% at 100% 0%, rgba(0,230,118,0.14) 0%, transparent 55%)",
            }}
          />
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Badge variant="neon" glow>
                ✔ {c("badge.riderVerified")}
              </Badge>
              <h2 className="mt-2.5 text-base font-bold md:text-lg">
                {t("riderBanner.title")}
              </h2>
              <p className="mt-1 text-xs text-fg-muted md:text-sm">
                {t("riderBanner.description")}
              </p>
            </div>
            <Link
              href="/community/notice"
              className="shrink-0 self-start rounded-xl border border-border-strong px-4 py-2.5 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon md:self-center"
            >
              {t("riderBanner.cta")} →
            </Link>
          </div>
        </Card>
      </section>

      {/* ── 게시판 그리드 ── */}
      <section className="mt-10 animate-fade-up">
        <SectionHeader title={t("boardsTitle")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => (
            <Link key={b.slug} href={`/community/${b.slug}`}>
              <Card hover className="flex h-full items-start gap-3 p-4">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bg-elevated text-2xl"
                  aria-hidden
                >
                  {b.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-bold">{b.name}</h3>
                    {b.type === "notice" && (
                      <Badge variant="outline">{c("badge.notice")}</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">
                    {b.description}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-fg-subtle">
                    {t("postCount", { count: postCounts[b.slug] })}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 지금 뜨는 글 / 최신 글 ── */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up">
          <SectionHeader title={t("hotTitle")} accent />
          <Card className="divide-y divide-border overflow-hidden">
            {hotPosts.map((p) => (
              <PostRow
                key={p.id}
                post={p}
                showBoard
                boardLabel={boardName(p.boardSlug)}
              />
            ))}
          </Card>
        </div>
        <div className="animate-fade-up">
          <SectionHeader title={t("latestTitle")} />
          <Card className="divide-y divide-border overflow-hidden">
            {latestPosts.map((p) => (
              <PostRow
                key={p.id}
                post={p}
                showBoard
                boardLabel={boardName(p.boardSlug)}
              />
            ))}
          </Card>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
