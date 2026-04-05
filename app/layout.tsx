import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerGame — Explore Careers Through Play",
  description: "An interactive career exploration platform for kids aged 6-15. Play games, learn about real careers, and discover what you love!",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
