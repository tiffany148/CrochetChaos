import type { Metadata } from "next";
import { DogSweater } from "../../../components/DogSweater";

export const metadata: Metadata = {
  title: "Dog sweater worksheet",
  description: "Turn a dog's neck, chest, back, and leg spacing into crochet stitch and row counts.",
};

export default function DogSweaterPage() {
  return <DogSweater />;
}
