import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { getSession } from "@/lib/session";
import SiteHeader from "./SiteHeader";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://addis-eats-capstone-navy.vercel.app"),
  title: {
    template: "%s | Addis Eats",
    default: "Addis Eats | Food delivery in Addis Ababa",
  },
  description: "Discover satisfying dishes and order food delivery across Addis Ababa with Addis Eats.",
  openGraph: { type: "website", locale: "en_ET", siteName: "Addis Eats" },
};
const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <SiteHeader session={session} />
          <main className="flex-grow">{children}</main>
          <footer className="site-footer">© 2026 Addis Eats · Made with Ethiopian flavour</footer>
        </Providers>

        {analyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
