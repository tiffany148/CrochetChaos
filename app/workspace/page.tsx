import type { Metadata } from "next";
import { Workspace } from "../../components/Workspace";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Save crochet patterns, checklists, and a row counter in this browser.",
};

export default function WorkspacePage() {
  return <Workspace />;
}
