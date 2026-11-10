import type { Metadata } from "next";
import { Suspense } from "react";
import { StitchBrowser } from "../../components/StitchBrowser";

export const metadata: Metadata = {
  title: "Stitch dictionary",
  description: "Search 140 crochet stitches by name or abbreviation and filter by difficulty or category.",
};

export default function StitchesPage() {
  return (
    <Suspense fallback={<p>Loading the stitch dictionary…</p>}>
      <StitchBrowser />
    </Suspense>
  );
}
