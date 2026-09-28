import { chapters } from "@/data/chapters";
import FlashCardSession from "./FlashCardSession";

export function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.id }));
}

export default function Page({ params }: { params: Promise<{ chapter: string }> }) {
  return <FlashCardSession params={params} />;
}
