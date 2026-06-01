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

export const metadata = {
  title: "Apple Face BD BD | Premium Tech & Gadgets",
  description: "Apple Face BD BD is your ultimate destination for authentic smartphones, laptops, custom PCs, gaming gear, and tech accessories in Bangladesh.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Apple Face BD BD | Premium Tech & Gadgets",
    description: "Your ultimate destination for smartphones, laptops, custom PCs, gaming gear, and tech accessories in Bangladesh.",
    url: "https://celltechbd.com", 
    siteName: "Apple Face BD BD",
    images: [
      {
        url: "/CELL LOGO-01~2.jpg.jpeg",
        width: 1200,
        height: 630,
        alt: "Apple Face BD BD Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apple Face BD BD | Premium Tech & Gadgets",
    description: "Your ultimate destination for smartphones, laptops, custom PCs, gaming gear, and tech accessories.",
    images: ["/CELL LOGO-01~2.jpg.jpeg"],
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
