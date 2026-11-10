import type { Metadata } from "next";
import { GlossaryBrowser } from "../../components/GlossaryBrowser";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Crochet glossary from the shared Crochet Chaos reference.",
};

export default function GlossaryPage() {
  return <GlossaryBrowser />;
}
