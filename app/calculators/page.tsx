import type { Metadata } from "next";
import { PhotoBanner } from "../../components/CraftPhoto";
import { Calculators } from "../../components/Calculators";

export const metadata: Metadata = {
  title: "Calculators",
  description: "Crochet yarn, chain, hook, terminology, blanket, granny square, amigurumi, and garment calculators.",
};

export default function CalculatorsPage() {
  return (
    <>
      <PhotoBanner shot="swatches" priority />
      <Calculators />
    </>
  );
}
