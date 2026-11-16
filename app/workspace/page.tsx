import type { Metadata } from "next";
import { PhotoBanner } from "../../components/CraftPhoto";
import { Workspace } from "../../components/Workspace";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Save crochet patterns, checklists, and a row counter in this browser.",
};

export default function WorkspacePage() {
  return (
    <>
      <PhotoBanner shot="basket" priority />
      <Workspace />
    </>
  );
}
