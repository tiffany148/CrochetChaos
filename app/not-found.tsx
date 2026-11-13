import Link from "next/link";
import { PhotoBanner } from "../components/CraftPhoto";

export default function NotFound() {
  return (
    <div className="empty">
      <PhotoBanner shot="granny" />
      <p className="eyebrow">Missing page</p>
      <h1>That page is not in the book.</h1>
      <p><Link href="/stitches">Browse the stitch dictionary</Link></p>
    </div>
  );
}
