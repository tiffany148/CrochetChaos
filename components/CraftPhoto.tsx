import Image from "next/image";

const SHOTS = {
  hero: { webp: "/images/hero.webp", jpg: "/images/hero.jpg", width: 1280, height: 720 },
  yarn: { webp: "/images/yarnball-hook.webp", jpg: "/images/yarnball-hook.jpg", width: 800, height: 800 },
  divider: { webp: "/images/divider.webp", jpg: "/images/divider.jpg", width: 1280, height: 720 },
  squares: { webp: "/images/banner-squares.webp", jpg: "/images/banner-squares.jpg", width: 1280, height: 720 },
  basket: { webp: "/images/banner-basket.webp", jpg: "/images/banner-basket.jpg", width: 1280, height: 720 },
  swatches: { webp: "/images/banner-swatches.webp", jpg: "/images/banner-swatches.jpg", width: 1280, height: 720 },
  granny: { webp: "/images/granny-close.webp", jpg: "/images/granny-close.jpg", width: 1024, height: 1024 },
  cascade: { webp: "/images/yarn-cascade.webp", jpg: "/images/yarn-cascade.jpg", width: 1152, height: 864 },
  hooks: { webp: "/images/hooks-still.webp", jpg: "/images/hooks-still.jpg", width: 1152, height: 864 },
  stitch: { webp: "/images/stitch-macro.webp", jpg: "/images/stitch-macro.jpg", width: 1280, height: 720 },
  book: { webp: "/images/book-still.webp", jpg: "/images/book-still.jpg", width: 1280, height: 720 },
} as const;

type Shot = keyof typeof SHOTS;

const CATEGORY_SHOT: Record<string, Shot> = {
  Foundation: "stitch",
  Basic: "yarn",
  Extended: "hooks",
  Placement: "granny",
  Post: "squares",
  Decrease: "cascade",
  Increase: "swatches",
  Group: "squares",
  Texture: "stitch",
  Edging: "hooks",
  Lace: "granny",
  Tunisian: "cascade",
  Specialty: "basket",
  Colorwork: "swatches",
};

type CraftPhotoProps = {
  shot: Shot;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
};

export function CraftPhoto({ shot, alt, className, priority, fill, sizes }: CraftPhotoProps) {
  const file = SHOTS[shot];
  return (
    <picture className={fill ? "craft-frame" : "craft-photo"}>
      <source srcSet={file.webp} type="image/webp" />
      {fill ? (
        <Image src={file.jpg} alt={alt} fill priority={priority} sizes={sizes ?? "100vw"} className={className} style={{ objectFit: "cover" }} />
      ) : (
        <Image src={file.jpg} alt={alt} width={file.width} height={file.height} priority={priority} sizes={sizes} className={className} />
      )}
    </picture>
  );
}

export const yarnAlt = "A teal crochet hook leaning on a pink and purple ball of yarn, with two green stitch markers.";

const ALT: Record<Shot, string> = {
  hero: "Pink, teal, purple, and lime balls of yarn with crochet hooks, stitch markers, and granny squares.",
  yarn: yarnAlt,
  divider: "",
  squares: "A stack of pink, purple, teal, and lime granny squares with gold and blue hooks and colorful stitch markers.",
  basket: "A plum velvet basket filled with pink, teal, purple, and lime yarn, with hooks and stitch markers along the rim.",
  swatches: "Folded crochet swatches in pink, teal, purple, and lime beside balls of yarn, hooks, and stitch markers.",
  granny: "Close-up of a granny square in hot pink, teal, purple, and lime yarn, with a silver hook on the corner.",
  cascade: "A pile of pink, teal, purple, and lime yarn balls with crochet hooks, stitch markers, and granny squares.",
  hooks: "Teal, gold, purple, and silver crochet hooks with pink, lime, and teal stitch markers on plum velvet.",
  stitch: "Close-up of pink, teal, and purple crochet stitches with a teal hook still in the fabric.",
  book: "An open blank journal beside pink, teal, and purple yarn, hooks, stitch markers, and a granny square.",
};

export function shotForCategory(category: string): Shot {
  return CATEGORY_SHOT[category] ?? "squares";
}

export function bannerAlt(shot: Shot): string {
  return ALT[shot];
}

function FrameGlitter({ count = 6 }: { count?: number }) {
  return (
    <span className="frame-glitter" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <i key={index} />)}
    </span>
  );
}

export function PhotoBanner({ shot, priority }: { shot: Shot; priority?: boolean }) {
  return (
    <div className="photo-banner decor-only">
      <CraftPhoto shot={shot} alt={ALT[shot]} fill priority={priority} sizes="(max-width: 1120px) 100vw, 1120px" className="banner-img" />
      <FrameGlitter />
    </div>
  );
}

export function PhotoGallery({ items }: { items: Shot[] }) {
  return (
    <div className="photo-gallery decor-only">
      {items.map((shot) => (
        <figure className="gallery-frame" key={shot}>
          <CraftPhoto shot={shot} alt={ALT[shot]} fill sizes="(max-width: 860px) 50vw, 540px" className="banner-img" />
          <FrameGlitter count={4} />
        </figure>
      ))}
    </div>
  );
}

export function CardPhoto({ shot }: { shot: Shot }) {
  return (
    <div className="card-photo-frame decor-only">
      <CraftPhoto shot={shot} alt="" fill sizes="(max-width: 860px) 100vw, 360px" className="banner-img" />
      <FrameGlitter count={4} />
    </div>
  );
}

export function SectionDivider() {
  return (
    <div className="section-divider decor-only">
      <CraftPhoto shot="divider" alt="" fill sizes="(max-width: 1120px) 100vw, 1120px" className="divider-img" />
    </div>
  );
}
