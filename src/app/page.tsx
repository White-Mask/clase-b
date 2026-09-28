import { AppShell } from "@/components/layout/AppShell";

import { ChapterGrid } from "@/components/home/ChapterGrid";
import { ExamCard } from "@/components/home/ExamCard";
import { FlashcardsCard } from "@/components/home/FlashcardsCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHero } from "@/components/home/HomeHero";
import { MistakesCard } from "@/components/home/MistakesCard";
import { QuickPractice } from "@/components/home/QuickPractice";
import { WeeklyActivity } from "@/components/home/WeeklyActivity";

export default function Home() {
  return (
    <AppShell>
      <HomeHeader />

      <HomeHero />

      <ExamCard />

      <div className="mt-5">
        <FlashcardsCard />
      </div>

      <div className="mt-8 sm:mt-10">
        <QuickPractice />
      </div>

      <div className="mt-7">
        <WeeklyActivity />
      </div>

      <div className="mt-7">
        <MistakesCard />
      </div>

      <div className="mt-8 sm:mt-10">
        <ChapterGrid />
      </div>

      <footer className="mt-12 border-t-2 border-slate-100 pt-6 text-center text-[11px] font-medium leading-5 text-slate-400">
        Simulador independiente de estudio
        basado en el Libro para la Conducción
        en Chile.
        <br />
        No corresponde al examen oficial ni
        utiliza el banco oficial de preguntas.
      </footer>
    </AppShell>
  );
}
