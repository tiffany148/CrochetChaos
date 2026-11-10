import type { Metadata } from "next";
import { Calculators } from "../../components/Calculators";

export const metadata: Metadata = {
  title: "Calculators",
  description: "Crochet yarn, chain, hook, terminology, blanket, granny square, amigurumi, and garment calculators.",
};

export default function CalculatorsPage() {
  return <Calculators />;
}
