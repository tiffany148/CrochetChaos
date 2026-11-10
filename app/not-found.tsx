import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <p className="eyebrow">Missing page</p>
      <h1>That page is not in the book.</h1>
      <p><Link href="/stitches">Browse the stitch dictionary</Link></p>
    </div>
  );
}
