import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crochet Chaos | Stitch Spark",
  description: "A colorful crochet project planner, pattern tracker, and stitch helper.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
