import Image from "next/image";

const SHOTS = {
  hero: { webp: "/images/hero.webp", jpg: "/images/hero.jpg", width: 1280, height: 720 },
  yarn: { webp: "/images/yarnball-hook.webp", jpg: "/images/yarnball-hook.jpg", width: 800, height: 800 },
  divider: { webp: "/images/divider.webp", jpg: "/images/divider.jpg", width: 1280, height: 720 },
} as const;

type Shot = keyof typeof SHOTS;

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

export function SectionDivider() {
  return (
    <div className="section-divider">
      <CraftPhoto shot="divider" alt="" fill sizes="(max-width: 1120px) 100vw, 1120px" className="divider-img" />
    </div>
  );
}
