import type { Metadata } from "next";
import { PhotoBanner } from "../../../components/CraftPhoto";
import { TimeEstimate } from "../../../components/TimeEstimate";

export const metadata: Metadata = {
  title: "Project time",
  description: "Estimate crochet time from stitch count, your stitches per minute, and stitch height.",
};

export default function TimePage() {
  return (
    <>
      <PhotoBanner shot="yarn" priority />
      <TimeEstimate />
    </>
  );
}
