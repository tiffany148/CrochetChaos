import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crochet Chaos",
  description: "A colorful crochet planning and tracker website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
