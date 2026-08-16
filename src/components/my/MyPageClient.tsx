"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { boardsFallback, postsFallback } from "@/data/mock/community-data";
import type { Listing, Model } from "@/lib/types";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { cn, formatKm, formatManwon, formatNumber } from "@/lib/utils";

type NotificationType = "comment" | "like" | "chat" | "consumable" | "notice";

interface MyPostRow {
  id: string;
  boardSlug: string;
  boardName: string;
  title: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
}

interface MyCommentRow {
  id: string;
  postId: string;
  postTitle: string;
  excerpt: string;
  createdAt: string;
}

interface CheckinLogRow {
  date: string;
  points: number;
}

interface NotificationRow {
  id: string;
  type: NotificationType;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

interface UserBikeRow {
  id: string;
  modelId: string;
  nickname: string;
  odometerKm: number;
  purchasedAt: string | null;
}

interface RankingRow {
  id: string;
  nickname: string;
  points: number;
}

interface MyStats {
  posts: MyPostRow[];
  comments: MyCommentRow[];
  likeReceived: number;
  checkinStreak: number;
  checkinLog: CheckinLogRow[];
  notifications: NotificationRow[];
  bikes: UserBikeRow[];
  bookmarkedListingIds: string[];
  ranking: RankingRow[];
  myRank: number | null;
  loading: boolean;
}

const EMPTY_STATS: MyStats = {
  posts: [],
  comments: [],
  likeReceived: 0,
  checkinStreak: 0,
  checkinLog: [],
  notifications: [],
  bikes: [],
  bookmarkedListingIds: [],
  ranking: [],
  myRank: null,
  loading: true,
};

function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

type TabKey =
  | "profile"
  | "posts"
  | "bookmarks"
  | "notifications"
  | "activity"
  | "bikes"
  | "settings";

const TABS: TabKey[] = [
  "profile",
  "posts",
  "bookmarks",
  "notifications",
  "activity",
  "bikes",
  "settings",
];

const NOTI_ICON: Record<NotificationType, string> = {
  comment: "💬",
  like: "❤️",
  chat: "✉️",
  consumable: "🛢️",
  notice: "📢",
};

function fmtDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, ".");
}

export function MyPageClient({
  models,
  listings,
}: {
  models: Model[];
  listings: Listing[];
}) {
  const { user, openLogin, logout } = useAuth();
  const t = useTranslations("my");
  const c = useTranslations("common");
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [tab, setTab] = useState<TabKey>("profile");
  const [toggles, setToggles] = useState({
    push: true,
    comment: true,
    like: true,
    consumable: true,
    marketing: false,
  });
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [stats, setStats] = useState<MyStats>(EMPTY_STATS);

  const unread = useMemo(
    () => stats.notifications.filter((n) => !n.read).length,
    [stats.notifications],
  );
  const experienceYears =
    user && user.ridingSince > 0 ? new Date().getFullYear() - user.ridingSince : null;

  useEffect(() => {
    if (!user) {
      setStats(EMPTY_STATS);
      return;
    }
    let active = true;

    async function load() {
      const [
        postsRes,
        commentsRes,
        checkinsRes,
        notificationsRes,
        bikesRes,
        bookmarksRes,
        rankingRes,
        outrankedRes,
      ] = await Promise.all([
        supabase
          .from("posts")
          .select("id, board_slug, title, created_at")
          .eq("author_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("comments")
          .select("id, post_id, content, created_at")
          .eq("author_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase.from("checkins").select("checkin_date, points_earned").eq("user_id", user!.id),
        supabase
          .from("notifications")
          .select("id, type, message, link, read, created_at")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("user_bikes")
          .select("id, model_id, nickname, odometer_km, purchased_at")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase.from("likes").select("target_id").eq("user_id", user!.id).eq("target_type", "listing"),
        supabase.from("profiles").select("id, nickname, points").order("points", { ascending: false }).limit(5),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gt("points", user!.points),
      ]);

      const postRows = postsRes.data ?? [];
      const commentRows = commentsRes.data ?? [];
      const checkinRows = checkinsRes.data ?? [];

      const postIds = postRows.map((p) => p.id);
      const [commentCountRes, likeCountRes] = await Promise.all([
        postIds.length > 0
          ? supabase.from("comments").select("post_id").in("post_id", postIds)
          : Promise.resolve({ data: [] as { post_id: string }[] }),
        postIds.length > 0
          ? supabase
              .from("likes")
              .select("target_id")
              .eq("target_type", "post")
              .in("target_id", postIds)
          : Promise.resolve({ data: [] as { target_id: string }[] }),
      ]);

      const commentCountByPost = new Map<string, number>();
      (commentCountRes.data ?? []).forEach((c) =>
        commentCountByPost.set(c.post_id, (commentCountByPost.get(c.post_id) ?? 0) + 1),
      );
      const likeCountByPost = new Map<string, number>();
      (likeCountRes.data ?? []).forEach((l) =>
        likeCountByPost.set(l.target_id, (likeCountByPost.get(l.target_id) ?? 0) + 1),
      );

      const boardNameBySlug = new Map(boardsFallback.map((b) => [b.slug, `${b.icon} ${b.name}`]));
      const posts: MyPostRow[] = postRows.map((p) => ({
        id: p.id,
        boardSlug: p.board_slug,
        boardName: boardNameBySlug.get(p.board_slug) ?? p.board_slug,
        title: p.title,
        createdAt: p.created_at,
        commentCount: commentCountByPost.get(p.id) ?? 0,
        likeCount: likeCountByPost.get(p.id) ?? 0,
      }));

      const commentPostIds = Array.from(new Set(commentRows.map((cm) => cm.post_id)));
      const mockTitleById = new Map(
        postsFallback.filter((p) => commentPostIds.includes(p.id)).map((p) => [p.id, p.title]),
      );
      const missingIds = commentPostIds.filter((id) => !mockTitleById.has(id));
      let realTitleById = new Map<string, string>();
      if (missingIds.length > 0) {
        const { data } = await supabase.from("posts").select("id, title").in("id", missingIds);
        realTitleById = new Map((data ?? []).map((p) => [p.id, p.title]));
      }
      const comments: MyCommentRow[] = commentRows.map((cm) => ({
        id: cm.id,
        postId: cm.post_id,
        postTitle: mockTitleById.get(cm.post_id) ?? realTitleById.get(cm.post_id) ?? cm.post_id,
        excerpt: cm.content,
        createdAt: cm.created_at,
      }));

      let likeReceived = 0;
      if (postIds.length > 0) {
        const { count } = await supabase
          .from("likes")
          .select("target_id", { count: "exact", head: true })
          .eq("target_type", "post")
          .in("target_id", postIds);
        likeReceived = count ?? 0;
      }

      const checkinDates = checkinRows.map((r) => r.checkin_date);
      const checkinLog: CheckinLogRow[] = [...checkinRows]
        .sort((a, b) => (a.checkin_date < b.checkin_date ? 1 : -1))
        .slice(0, 10)
        .map((r) => ({ date: r.checkin_date, points: r.points_earned }));

      const notifications: NotificationRow[] = (notificationsRes.data ?? []).map((n) => ({
        id: n.id,
        type: n.type as NotificationType,
        message: n.message,
        link: n.link,
        read: n.read,
        createdAt: n.created_at,
      }));

      const bikes: UserBikeRow[] = (bikesRes.data ?? []).map((b) => ({
        id: b.id,
        modelId: b.model_id,
        nickname: b.nickname,
        odometerKm: b.odometer_km,
        purchasedAt: b.purchased_at,
      }));

      const bookmarkedListingIds = (bookmarksRes.data ?? []).map((b) => b.target_id as string);

      const ranking: RankingRow[] = (rankingRes.data ?? []).map((r) => ({
        id: r.id,
        nickname: r.nickname,
        points: r.points,
      }));
      const myRank = (outrankedRes.count ?? 0) + 1;

      if (!active) return;
      setStats({
        posts,
        comments,
        likeReceived,
        checkinStreak: computeStreak(checkinDates),
        checkinLog,
        notifications,
        bikes,
        bookmarkedListingIds,
        ranking,
        myRank,
        loading: false,
      });
    }

    load();
    return () => {
      active = false;
    };
  }, [user, supabase]);

  async function markNotificationRead(id: string) {
    setStats((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  }

  async function markAllNotificationsRead() {
    if (!user) return;
    setStats((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  }

  async function addBike(input: {
    modelId: string;
    nickname: string;
    odometerKm: number;
    purchasedAt: string;
  }): Promise<boolean> {
    if (!user) return false;
    const { data, error } = await supabase
      .from("user_bikes")
      .insert({
        user_id: user.id,
        model_id: input.modelId,
        nickname: input.nickname,
        odometer_km: input.odometerKm,
        purchased_at: input.purchasedAt || null,
      })
      .select("id, model_id, nickname, odometer_km, purchased_at")
      .single();
    if (error || !data) return false;
    setStats((prev) => ({
      ...prev,
      bikes: [
        {
          id: data.id,
          modelId: data.model_id,
          nickname: data.nickname,
          odometerKm: data.odometer_km,
          purchasedAt: data.purchased_at,
        },
        ...prev.bikes,
      ],
    }));
    return true;
  }

  async function removeBike(id: string) {
    setStats((prev) => ({ ...prev, bikes: prev.bikes.filter((b) => b.id !== id) }));
    await supabase.from("user_bikes").delete().eq("id", id);
  }

  async function removeBookmark(listingId: string) {
    if (!user) return;
    setStats((prev) => ({
      ...prev,
      bookmarkedListingIds: prev.bookmarkedListingIds.filter((id) => id !== listingId),
    }));
    await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("target_type", "listing")
      .eq("target_id", listingId);
  }

  // ── 비로그인 ──
  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border-strong bg-bg-card px-6 py-16 text-center">
          <span className="mb-4 text-4xl">🔑</span>
          <h1 className="text-xl font-black">{t("loginRequired.title")}</h1>
          <p className="mt-2 text-sm text-fg-muted">{t("loginRequired.desc")}</p>
          <button
            type="button"
            onClick={openLogin}
            className="mt-6 rounded-xl bg-neon px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            {t("loginRequired.button")}
          </button>
        </div>
      </div>
    );
  }

  const initial = user.nickname.slice(0, 1).toUpperCase();
  const bookmarkedListings = stats.bookmarkedListingIds
    .map((id) => listings.find((l) => l.id === id))
    .filter((l): l is Listing => !!l);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* ── 프로필 카드 ── */}
      <Card className="relative overflow-hidden p-5 md:p-6">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 100% at 100% -20%, rgba(0,230,118,0.14) 0%, transparent 50%)",
          }}
        />
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neon/15 text-2xl font-black text-neon md:h-20 md:w-20">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black tracking-tight md:text-2xl">
                {user.nickname}
              </h1>
              {user.isRiderVerified && (
                <Badge variant="neon" glow>
                  ✓ {c("badge.riderVerified")}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-fg-muted">
              {t("profile.region")} · {user.region}
              {experienceYears !== null &&
                ` · ${t("profile.experienceYears", { years: experienceYears })}`}
            </p>
            {(user.gender || user.birthYear > 0) && (
              <p className="mt-0.5 text-xs text-fg-subtle">
                {[
                  user.gender ? t(`edit.gender${user.gender === "male" ? "Male" : user.gender === "female" ? "Female" : "Other"}`) : null,
                  user.birthYear > 0
                    ? t("profile.ageValue", {
                        age: new Date().getFullYear() - user.birthYear,
                      })
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            {user.bikeModel && (
              <p className="mt-0.5 text-xs text-fg-subtle">🏍️ {user.bikeModel}</p>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <MiniStat
            value={formatNumber(user.points)}
            label={t("profile.points")}
          />
          <MiniStat
            value={t("profile.rankValue", { rank: stats.myRank ?? "-" })}
            label={t("profile.rank")}
          />
          <MiniStat value={String(stats.bikes.length)} label={t("tabs.bikes")} />
        </div>
      </Card>

      {/* ── 탭 ── */}
      <div className="mt-6 -mx-4 overflow-x-auto px-4">
        <div className="flex gap-2">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "relative shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors",
                tab === key
                  ? "border-neon bg-neon/15 text-neon"
                  : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {t(`tabs.${key}`)}
              {key === "notifications" && unread > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-neon px-1 text-[10px] font-black text-black">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {tab === "profile" && (
          <ProfileTab
            t={t}
            c={c}
            postCount={stats.posts.length}
            commentCount={stats.comments.length}
            likeReceived={stats.likeReceived}
            checkinStreak={stats.checkinStreak}
            onEditProfile={() => router.push("/my/edit")}
          />
        )}
        {tab === "posts" && <PostsTab t={t} posts={stats.posts} comments={stats.comments} />}
        {tab === "bookmarks" && (
          <BookmarksTab t={t} listings={bookmarkedListings} onRemove={removeBookmark} />
        )}
        {tab === "notifications" && (
          <NotificationsTab
            t={t}
            notis={stats.notifications}
            unread={unread}
            onRead={markNotificationRead}
            onReadAll={markAllNotificationsRead}
          />
        )}
        {tab === "activity" && (
          <ActivityTab
            t={t}
            points={user.points}
            checkinLog={stats.checkinLog}
            ranking={stats.ranking}
            myRank={stats.myRank}
            myId={user.id}
          />
        )}
        {tab === "bikes" && (
          <BikesTab
            t={t}
            c={c}
            models={models}
            bikes={stats.bikes}
            onAdd={addBike}
            onRemove={removeBike}
          />
        )}
        {tab === "settings" && (
          <SettingsTab
            t={t}
            toggles={toggles}
            setToggle={(k, v) => setToggles((prev) => ({ ...prev, [k]: v }))}
            lang={lang}
            setLang={setLang}
            onLogout={logout}
            onEditProfile={() => router.push("/my/edit")}
          />
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}

// ─── 공통 소품 ─────────────────────────────────────────────
function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-3 text-center">
      <p className="truncate font-mono text-lg font-black text-neon">{value}</p>
      <p className="mt-0.5 text-[11px] text-fg-subtle">{label}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-base font-bold">{children}</h2>;
}

type T = ReturnType<typeof useTranslations>;

// ─── 프로필 탭 ─────────────────────────────────────────────
function ProfileTab({
  t,
  c,
  postCount,
  commentCount,
  likeReceived,
  checkinStreak,
  onEditProfile,
}: {
  t: T;
  c: T;
  postCount: number;
  commentCount: number;
  likeReceived: number;
  checkinStreak: number;
  onEditProfile: () => void;
}) {
  const items = [
    { label: t("profileTab.postCount"), value: postCount },
    { label: t("profileTab.commentCount"), value: commentCount },
    { label: t("profileTab.likeReceived"), value: likeReceived },
  ];
  return (
    <div>
      <SectionTitle>{t("profileTab.summary")}</SectionTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <Card key={it.label} className="p-4 text-center">
            <p className="font-mono text-2xl font-black text-neon">
              {formatNumber(it.value)}
            </p>
            <p className="mt-1 text-[11px] text-fg-subtle">{it.label}</p>
          </Card>
        ))}
        <Card className="p-4 text-center">
          <p className="font-mono text-2xl font-black text-neon">
            {t("profileTab.days", { days: checkinStreak })}
          </p>
          <p className="mt-1 text-[11px] text-fg-subtle">
            {t("profileTab.checkinStreak")}
          </p>
        </Card>
      </div>
      <button
        type="button"
        onClick={onEditProfile}
        className="mt-5 rounded-xl border border-border-strong px-4 py-2.5 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
      >
        {t("profile.editProfile")}
      </button>
      <p className="mt-3 text-[11px] text-fg-subtle">{c("footer.notice")}</p>
    </div>
  );
}

// ─── 게시글·댓글 탭 ────────────────────────────────────────
function PostsTab({
  t,
  posts,
  comments,
}: {
  t: T;
  posts: { id: string; boardName: string; title: string; createdAt: string; commentCount: number; likeCount: number }[];
  comments: { id: string; postId: string; postTitle: string; excerpt: string; createdAt: string }[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>{t("posts.myPosts")}</SectionTitle>
        {posts.length === 0 ? (
          <EmptyState title={t("posts.empty")} icon="✍️" />
        ) : (
          <Card className="divide-y divide-border">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/community/posts/${p.id}`}
                className="block p-4 transition-colors hover:bg-bg-elevated"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{p.boardName}</Badge>
                  <span className="text-[11px] text-fg-subtle">
                    {fmtDate(p.createdAt)}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-1 text-sm font-medium">
                  {p.title}
                </p>
                <p className="mt-1 text-[11px] text-fg-subtle">
                  💬 {p.commentCount} · ❤️ {p.likeCount}
                </p>
              </Link>
            ))}
          </Card>
        )}
      </div>

      <div>
        <SectionTitle>{t("posts.myComments")}</SectionTitle>
        {comments.length === 0 ? (
          <EmptyState title={t("posts.emptyComments")} icon="💬" />
        ) : (
          <Card className="divide-y divide-border">
            {comments.map((cm) => (
              <Link
                key={cm.id}
                href={`/community/posts/${cm.postId}`}
                className="block p-4 transition-colors hover:bg-bg-elevated"
              >
                <p className="line-clamp-2 text-sm">{cm.excerpt}</p>
                <p className="mt-1.5 text-[11px] text-fg-subtle">
                  {t("posts.commentedOn", { title: cm.postTitle })} ·{" "}
                  {fmtDate(cm.createdAt)}
                </p>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── 찜한 매물 탭 ──────────────────────────────────────────
function BookmarksTab({
  t,
  listings,
  onRemove,
}: {
  t: T;
  listings: Listing[];
  onRemove: (listingId: string) => void;
}) {
  if (listings.length === 0) {
    return (
      <EmptyState
        title={t("bookmarks.empty")}
        hint={t("bookmarks.emptyHint")}
        icon="🔖"
      />
    );
  }
  return (
    <div>
      <SectionTitle>{t("bookmarks.title")}</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {listings.map((b) => (
          <Card key={b.id} hover className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {b.isVerified && <Badge variant="neon">✓ BAPL</Badge>}
                <Badge
                  variant={
                    b.status === "active"
                      ? "outline"
                      : b.status === "reserved"
                        ? "warning"
                        : "muted"
                  }
                >
                  {t(`bookmarks.status.${b.status}`)}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => onRemove(b.id)}
                className="text-[11px] font-medium text-fg-subtle transition-colors hover:text-danger"
              >
                {t("bookmarks.remove")}
              </button>
            </div>
            <Link href={`/market/bikes/${b.id}`} className="block">
              <p className="mt-2 line-clamp-1 text-sm font-medium">{b.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-fg-subtle">{b.region}</span>
                <span className="font-mono text-sm font-bold text-neon">
                  {formatManwon(b.priceManwon)}
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── 알림 탭 ───────────────────────────────────────────────
function NotificationsTab({
  t,
  notis,
  unread,
  onRead,
  onReadAll,
}: {
  t: T;
  notis: NotificationRow[];
  unread: number;
  onRead: (id: string) => void;
  onReadAll: () => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionTitle>
          {t("notifications.title")}
          {unread > 0 && (
            <span className="ml-2 text-xs font-medium text-fg-subtle">
              {t("notifications.unreadCount", { count: unread })}
            </span>
          )}
        </SectionTitle>
        <button
          type="button"
          onClick={onReadAll}
          disabled={unread === 0}
          className="text-xs font-medium text-fg-muted transition-colors hover:text-neon disabled:opacity-40"
        >
          {t("notifications.markAllRead")}
        </button>
      </div>
      {notis.length === 0 ? (
        <EmptyState title={t("notifications.empty")} icon="🔔" />
      ) : (
        <Card className="divide-y divide-border">
          {notis.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onRead(n.id)}
              className={cn(
                "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-bg-elevated",
                !n.read && "bg-neon/[0.04]",
              )}
            >
              <span className="text-lg">{NOTI_ICON[n.type]}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {t(`notifications.type.${n.type}`)}
                  </Badge>
                  {!n.read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                  )}
                </div>
                <p className="mt-1.5 text-sm">{n.message}</p>
                <p className="mt-1 text-[11px] text-fg-subtle">
                  {fmtDate(n.createdAt)}
                </p>
              </div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── 활동 내역 탭 ──────────────────────────────────────────
function ActivityTab({
  t,
  points,
  checkinLog,
  ranking,
  myRank,
  myId,
}: {
  t: T;
  points: number;
  checkinLog: { date: string; points: number }[];
  ranking: RankingRow[];
  myRank: number | null;
  myId: string;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <p className="font-mono text-2xl font-black text-neon">
            {formatNumber(points)}
          </p>
          <p className="mt-1 text-[11px] text-fg-subtle">
            {t("activity.myPoints")}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-mono text-2xl font-black text-neon">
            {myRank != null ? `${myRank}위` : "-"}
          </p>
          <p className="mt-1 text-[11px] text-fg-subtle">
            {t("activity.myRank")}
          </p>
        </Card>
      </div>

      <div>
        <SectionTitle>{t("activity.weeklyRanking")}</SectionTitle>
        {ranking.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border py-8 text-center text-xs text-fg-subtle">
            {t("activity.rankingEmpty")}
          </p>
        ) : (
          <Card className="divide-y divide-border">
            {ranking.map((r, i) => {
              const rank = i + 1;
              const isMe = r.id === myId;
              return (
                <div
                  key={r.id}
                  className={cn(
                    "flex items-center gap-3 p-3.5",
                    isMe && "bg-neon/[0.06]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-black",
                      rank <= 3
                        ? "bg-neon/20 text-neon"
                        : "bg-bg-elevated text-fg-muted",
                    )}
                  >
                    {rank}
                  </span>
                  <span className="flex-1 text-sm font-medium">
                    {r.nickname}
                    {isMe && (
                      <span className="ml-1.5 text-[11px] text-neon">
                        ({t("activity.me")})
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs font-bold text-fg-muted">
                    {formatNumber(r.points)}P
                  </span>
                </div>
              );
            })}
          </Card>
        )}
      </div>

      <div>
        <SectionTitle>{t("activity.pointLog")}</SectionTitle>
        {checkinLog.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border py-8 text-center text-xs text-fg-subtle">
            {t("activity.pointLogEmpty")}
          </p>
        ) : (
          <Card className="divide-y divide-border">
            {checkinLog.map((log) => (
              <div key={log.date} className="flex items-center gap-3 p-3.5">
                <span className="flex-1 text-sm">
                  {t("activity.action.checkin")}
                </span>
                <span className="text-[11px] text-fg-subtle">
                  {fmtDate(log.date)}
                </span>
                <span className="font-mono text-xs font-bold text-neon">
                  +{log.points}P
                </span>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── 내 바이크 탭 ──────────────────────────────────────────
function BikesTab({
  t,
  c,
  models,
  bikes,
  onAdd,
  onRemove,
}: {
  t: T;
  c: T;
  models: Model[];
  bikes: UserBikeRow[];
  onAdd: (input: {
    modelId: string;
    nickname: string;
    odometerKm: number;
    purchasedAt: string;
  }) => Promise<boolean>;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [modelId, setModelId] = useState("");
  const [nickname, setNickname] = useState("");
  const [odometerKm, setOdometerKm] = useState("");
  const [purchasedAt, setPurchasedAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setModelId("");
    setNickname("");
    setOdometerKm("");
    setPurchasedAt("");
    setError(null);
  }

  async function submit() {
    if (!modelId || !nickname.trim()) {
      setError(t("bikes.modal.validationError"));
      return;
    }
    setSaving(true);
    setError(null);
    const ok = await onAdd({
      modelId,
      nickname: nickname.trim(),
      odometerKm: Number(odometerKm) || 0,
      purchasedAt,
    });
    setSaving(false);
    if (!ok) {
      setError(t("bikes.modal.error"));
      return;
    }
    resetForm();
    setOpen(false);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionTitle>{t("bikes.title")}</SectionTitle>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
        >
          + {t("bikes.addBike")}
        </button>
      </div>
      <p className="-mt-1 mb-4 text-[11px] text-fg-subtle">
        {t("bikes.addBikeHint")}
      </p>

      {bikes.length === 0 ? (
        <EmptyState title={t("bikes.empty")} icon="🏍️" />
      ) : (
        <div className="space-y-4">
          {bikes.map((bike) => {
            const model = models.find((m) => m.id === bike.modelId);
            return (
              <Card key={bike.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-black">{bike.nickname}</p>
                    <p className="mt-0.5 text-xs text-fg-muted">
                      {model?.nameKo ?? bike.modelId}
                      {model &&
                        ` · ${t("bikes.specSummary", {
                          engine: model.spec.engineType.split(" ")[0],
                          cc: model.spec.engineCc,
                        })}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {model && (
                      <Badge variant="outline">
                        {c(`cat.${model.category}`)}
                      </Badge>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(bike.id)}
                      className="text-[11px] font-medium text-fg-subtle transition-colors hover:text-danger"
                    >
                      {t("bikes.deleteBike")}
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-bg-elevated p-3">
                    <p className="text-[11px] text-fg-subtle">
                      {t("bikes.odometer")}
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-neon">
                      {formatKm(bike.odometerKm)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-bg-elevated p-3">
                    <p className="text-[11px] text-fg-subtle">
                      {t("bikes.purchasedAt")}
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-bold">
                      {bike.purchasedAt ? fmtDate(bike.purchasedAt) : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-dashed border-border-strong bg-bg-elevated p-3">
                  <p className="text-xs font-bold text-neon">
                    🛢️ {t("bikes.consumableAlert")}
                  </p>
                  <p className="mt-0.5 text-[11px] text-fg-muted">
                    {t("bikes.consumableDesc")}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href="/garage/logs"
                    className="flex-1 rounded-lg border border-border-strong px-3 py-2 text-center text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
                  >
                    🔧 {t("bikes.maintenanceLog")}
                  </Link>
                  {model && (
                    <Link
                      href={`/models/${model.id}`}
                      className="flex-1 rounded-lg border border-border-strong px-3 py-2 text-center text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
                    >
                      {t("bikes.viewModel")}
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border-strong bg-bg-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold">{t("bikes.modal.title")}</h3>
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-fg-muted">
                  {t("bikes.modal.model")}
                </span>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
                >
                  <option value="">{t("bikes.modal.modelPlaceholder")}</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nameKo}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-fg-muted">
                  {t("bikes.modal.nickname")}
                </span>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t("bikes.modal.nicknamePlaceholder")}
                  className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-fg-muted">
                  {t("bikes.modal.odometer")}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(e.target.value)}
                  className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-fg-muted">
                  {t("bikes.modal.purchasedAt")}
                </span>
                <input
                  type="date"
                  value={purchasedAt}
                  onChange={(e) => setPurchasedAt(e.target.value)}
                  className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
                />
              </label>
            </div>
            {error && <p className="mt-2 text-xs font-medium text-danger">{error}</p>}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className="flex-1 rounded-xl bg-neon py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
              >
                {saving ? t("bikes.modal.submitting") : t("bikes.modal.submit")}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                className="rounded-xl border border-border-strong px-5 py-2.5 text-sm font-bold text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
              >
                {t("bikes.modal.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 설정·보안 탭 ──────────────────────────────────────────
type ToggleKey = "push" | "comment" | "like" | "consumable" | "marketing";

function SettingsTab({
  t,
  toggles,
  setToggle,
  lang,
  setLang,
  onLogout,
  onEditProfile,
}: {
  t: T;
  toggles: Record<ToggleKey, boolean>;
  setToggle: (k: ToggleKey, v: boolean) => void;
  lang: "ko" | "en";
  setLang: (l: "ko" | "en") => void;
  onLogout: () => void;
  onEditProfile: () => void;
}) {
  const notiRows: { key: ToggleKey; label: string }[] = [
    { key: "push", label: t("settings.notiPush") },
    { key: "comment", label: t("settings.notiComment") },
    { key: "like", label: t("settings.notiLike") },
    { key: "consumable", label: t("settings.notiConsumable") },
    { key: "marketing", label: t("settings.notiMarketing") },
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>{t("settings.notiSettings")}</SectionTitle>
        <Card className="divide-y divide-border">
          {notiRows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between p-4"
            >
              <span className="text-sm">{row.label}</span>
              <Toggle
                on={toggles[row.key]}
                onClick={() => setToggle(row.key, !toggles[row.key])}
              />
            </div>
          ))}
        </Card>
      </div>

      <div>
        <SectionTitle>{t("settings.language")}</SectionTitle>
        <div className="flex gap-2">
          {(["ko", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={cn(
                "rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors",
                lang === l
                  ? "border-neon bg-neon/15 text-neon"
                  : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {l === "ko" ? t("settings.korean") : t("settings.english")}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-fg-subtle">
          {t("settings.langNote")}
        </p>
      </div>

      <div>
        <SectionTitle>{t("settings.account")}</SectionTitle>
        <Card className="divide-y divide-border">
          {[
            { label: t("settings.editProfile"), onClick: onEditProfile },
            { label: t("settings.changePassword"), onClick: undefined },
            { label: t("settings.deleteAccount"), onClick: undefined },
          ].map((row) => (
            <button
              key={row.label}
              type="button"
              onClick={row.onClick}
              disabled={!row.onClick}
              className="flex w-full items-center justify-between p-4 text-left text-sm transition-colors hover:bg-bg-elevated disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <span>{row.label}</span>
              <span className="text-fg-subtle">›</span>
            </button>
          ))}
        </Card>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-xl border border-danger/40 py-3 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
        >
          {t("settings.logout")}
        </button>
        <p className="mt-3 text-[11px] text-fg-subtle">
          {t("settings.demoNote")}
        </p>
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-neon" : "bg-bg-elevated border border-border-strong",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-black transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0",
        )}
      />
    </button>
  );
}
