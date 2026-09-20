import { CarFront, GraduationCap } from "lucide-react";

import { ChapterGrid } from "@/components/home/ChapterGrid";
import { ExamCard } from "@/components/home/ExamCard";
import { MistakesCard } from "@/components/home/MistakesCard";
import { ProgressCard } from "@/components/home/ProgressCard";
import { QuickPractice } from "@/components/home/QuickPractice";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <CarFront size={20} />
            </div>

            <div>
              <div className="text-sm font-black tracking-tight text-slate-950">
                Clase B
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Chile
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex">
            <GraduationCap size={17} />
            Entrena. Aprende. Aprueba.
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <section className="mb-9">
          <p className="text-sm font-bold text-blue-600">
            Prepárate a tu ritmo
          </p>

          <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Tu examen Clase B,
            <span className="text-slate-400"> sin sorpresas.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Practica con preguntas basadas en el Libro para la
            Conducción en Chile, identifica tus errores y llega mejor
            preparado al examen.
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <ExamCard />

          <div className="grid gap-5">
            <MistakesCard />
            <ProgressCard />
          </div>
        </div>

        <div className="mt-5">
          <QuickPractice />
        </div>

        <div className="mt-12">
          <ChapterGrid />
        </div>

        <footer className="mt-16 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-400">
          Simulador independiente de estudio basado en el Libro para
          la Conducción en Chile. No corresponde al examen oficial ni
          utiliza el banco oficial de preguntas.
        </footer>
      </div>
    </main>
  );
}
