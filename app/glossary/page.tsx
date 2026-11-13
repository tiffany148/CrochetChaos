import type { Metadata } from "next";
import { PhotoBanner } from "../../components/CraftPhoto";
import { GlossaryBrowser } from "../../components/GlossaryBrowser";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Crochet glossary from the shared Crochet Chaos reference.",
};

export default function GlossaryPage() {
  return (
    <>
      <PhotoBanner shot="hooks" priority />
      <GlossaryBrowser />
    </>
  );
}
