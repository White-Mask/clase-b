import { chapters } from "@/data/chapters";
import ChapterIntro from "./ChapterIntro";

export function generateStaticParams() {
  return chapters.map((c) => ({ id: c.id }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ChapterIntro params={params} />;
}
