import type { Metadata } from "next";
import { PhotoBanner } from "../../components/CraftPhoto";
import Encyclopedia from "../encyclopedia";

export const metadata: Metadata = {
  title: "Lesson notes",
  description: "Short crochet lesson notes saved in this browser.",
};

export default function LessonsPage() {
  return (
    <div>
      <PhotoBanner shot="stitch" priority />
      <p className="eyebrow">Lesson notes</p>
      <h1>Short lessons, saved on this device.</h1>
      <p className="lede">These are the existing lesson notes. The stitch-by-stitch reference is the dictionary, which uses the shared 140-entry source.</p>
      <Encyclopedia />
    </div>
  );
}
