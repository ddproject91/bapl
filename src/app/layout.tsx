import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LoginModal } from "@/components/auth/LoginModal";
import { SiteBackground } from "@/components/layout/SiteBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { PopupBannerModal } from "@/components/layout/PopupBannerModal";
import { FloatingChat } from "@/components/chat/FloatingChat";
import { getPopupBanner } from "@/data/mock/site";

const pretendard = localFont({
  src: [
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return {
    metadataBase: new URL("https://bapl.co.kr"),
    title: {
      default: `${t("brand.name")} — ${t("brand.tagline")}`,
      template: `%s | ${t("brand.name")}`,
    },
    description: t("brand.description"),
    applicationName: "BAPL",
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, title: "BAPL", statusBarStyle: "black-translucent" },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();
  const popupBanner = await getPopupBanner();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-fg">
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SiteBackground />
            <Header />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileTabBar />
            <FloatingChat />
            <LoginModal />
            {popupBanner.enabled && popupBanner.imageUrl && (
              <PopupBannerModal imageUrl={popupBanner.imageUrl} linkUrl={popupBanner.linkUrl} />
            )}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
