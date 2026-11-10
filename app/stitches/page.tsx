import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionDivider } from "../../components/CraftPhoto";
import { StitchBrowser } from "../../components/StitchBrowser";

export const metadata: Metadata = {
  title: "Stitch dictionary",
  description: "Search 140 crochet stitches by name or abbreviation and filter by difficulty or category.",
};

export default function StitchesPage() {
  return (
    <>
      <SectionDivider />
      <Suspense fallback={<p>Loading the stitch dictionary…</p>}>
        <StitchBrowser />
      </Suspense>
    </>
  );
}
