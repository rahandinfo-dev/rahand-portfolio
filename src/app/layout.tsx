import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ڕەهەند جاف — گەشەپێدەری ئەپ و وێب",
    template: "%s | ڕەهەند جاف",
  },
  description:
    "پۆرتفۆلیۆی ڕەهەند جاف؛ گەشەپێدانی وێب و ئەپ، UI/UX و چارەسەری دیجیتاڵ.",
  keywords: ["ڕەهەند جاف", "Kurdish developer", "Web developer", "UI UX"],
  authors: [{ name: "Rahand M. Jaff" }],
  creator: "Rahand M. Jaff",
  openGraph: {
    type: "website",
    locale: "ckb_IQ",
    title: "ڕەهەند جاف — گەشەپێدەری ئەپ و وێب",
    description: "بیرۆکە دەگۆڕم بۆ بەرهەمی دیجیتاڵ.",
    siteName: "Rahand Portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173d31",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ckb" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
