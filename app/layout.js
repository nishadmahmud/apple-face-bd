import { Geist, Geist_Mono } from "next/font/google";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import MobileBottomNav from "../components/MobileBottomNav/MobileBottomNav";
import FloatingActions from "../components/FloatingActions/FloatingActions";
import Providers from "../components/Providers";
import { getCategoriesFromServer } from "../lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://applefacebd.com";

const ogImage = "/apple-face-logo-square.png";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Apple Face BD | Premium Tech & Gadgets",
  description: "Apple Face BD is your destination for authentic smartphones, laptops, gaming gear, and tech accessories in Bangladesh.",
  icons: {
    apple: ogImage,
  },
  openGraph: {
    title: "Apple Face BD | Premium Tech & Gadgets",
    description: "Authentic smartphones, laptops, gaming gear, and tech accessories in Bangladesh.",
    url: siteUrl,
    siteName: "Apple Face BD",
    images: [
      {
        url: ogImage,
        width: 512,
        height: 512,
        alt: "Apple Face BD logo",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apple Face BD | Premium Tech & Gadgets",
    description: "Authentic smartphones, laptops, gaming gear, and tech accessories in Bangladesh.",
    images: [ogImage],
  },
};

export default async function RootLayout({ children }) {
  let categories = [];
  try {
    const res = await getCategoriesFromServer();
    if (res?.success && res?.data) {
      categories = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch categories for layout:", error);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800 pb-16 md:pb-0`}
      >
        <Providers>
          <Header categories={categories} />
          <main className="min-h-screen flex flex-col bg-white">
            {children}
          </main>
          <FloatingActions />
          <MobileBottomNav />
          <Footer categories={categories} />
        </Providers>
      </body>
    </html>
  );
}
