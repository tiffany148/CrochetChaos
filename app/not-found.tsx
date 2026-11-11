import Link from "next/link";
import { CraftPhoto, yarnAlt } from "../components/CraftPhoto";

export default function NotFound() {
  return (
    <div className="empty">
      <CraftPhoto shot="yarn" alt={yarnAlt} className="portrait-feature" sizes="280px" />
      <p className="eyebrow">Missing page</p>
      <h1>That page is not in the book.</h1>
      <p><Link href="/stitches">Browse the stitch dictionary</Link></p>
    </div>
  );
}
