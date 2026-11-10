import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = {
  title: {
    default: "Crochet Chaos",
    template: "%s · Crochet Chaos",
  },
  description: "A colorful companion to The Ultimate Crochet Bible by Tiffany Brooke: 140 stitches, glossary, calculators, and a browser project workspace.",
};

const themeBoot = `try{var raw=localStorage.getItem("crochet-chaos-v2");var data=raw?JSON.parse(raw):null;var theme=data&&(data.theme==="dark"||data.theme==="light")?data.theme:null;if(!theme){var raw1=localStorage.getItem("crochet-chaos-v1");var data1=raw1?JSON.parse(raw1):null;theme=data1&&data1.theme==="dark"?"dark":"light";}document.documentElement.dataset.theme=theme;}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
