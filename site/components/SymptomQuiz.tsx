"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";

interface QuizOption { key: string; tags: string[] }
interface QuizStep { id: string; qKey: string; options: QuizOption[] }

// Symptom tags are kept in English (canonical keys for lookup in /symptoms).
const QUESTIONS: QuizStep[] = [
  {
    id: "primary",
    qKey: "primaryQ",
    options: [
      { key: "primarySleep",     tags: ["Sleep & Anxiety"] },
      { key: "primaryCough",     tags: ["Cough & Respiratory"] },
      { key: "primaryDigestion", tags: ["Digestion"] },
      { key: "primaryJoint",     tags: ["Joints & Pain"] },
      { key: "primaryEnergy",    tags: ["Immunity & Fatigue"] },
      { key: "primaryWomens",    tags: ["Women's Health"] },
      { key: "primarySkin",      tags: ["Skin"] },
      { key: "primaryBlood",     tags: ["Blood Sugar"] }
    ]
  },
  {
    id: "chronic",
    qKey: "chronicQ",
    options: [
      { key: "chronicAcute",    tags: [] },
      { key: "chronicSubacute", tags: [] },
      { key: "chronicChronic",  tags: ["Immunity & Fatigue"] }
    ]
  },
  {
    id: "preference",
    qKey: "preferenceQ",
    options: [
      { key: "prefAyurveda", tags: [] },
      { key: "prefTcm",      tags: [] },
      { key: "prefKampo",    tags: [] },
      { key: "prefAndean",   tags: [] },
      { key: "prefAll",      tags: [] }
    ]
  }
];

export function SymptomQuiz() {
  const t = useTranslations("components.quiz");
  const [step, setStep] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  if (done) {
    const primary = tags[0] ?? "Immunity & Fatigue";
    return (
      <div className="rounded-xl bg-white border border-brand-200 p-6 text-center">
        <Stethoscope className="w-8 h-8 mx-auto text-brand-600" />
        <h3 className="font-serif text-2xl text-brand-800 mt-2">{t("basedOnAnswers")}</h3>
        <p className="text-neutral-700 mt-2">{t("recommendStart")}</p>
        <Link
          href={`/symptoms?s=${encodeURIComponent(primary)}`}
          className="inline-flex items-center gap-2 mt-4 bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
        >
          {t("seeRemedies", { primary })} <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={() => { setStep(0); setTags([]); setDone(false); }}
          className="block mx-auto mt-3 text-xs text-neutral-500 hover:text-neutral-700 underline"
        >
          {t("retake")}
        </button>
      </div>
    );
  }

  const current = QUESTIONS[step];
  return (
    <div className="rounded-xl bg-white border border-brand-200 p-6">
      <div className="text-xs text-brand-600 font-medium">{t("stepOf", { current: step + 1, total: QUESTIONS.length })}</div>
      <h3 className="font-serif text-2xl text-brand-800 mt-1">{t(current.qKey)}</h3>
      <div className="grid sm:grid-cols-2 gap-2 mt-4">
        {current.options.map(o => (
          <button
            key={o.key}
            onClick={() => {
              const nextTags = [...tags, ...o.tags];
              if (step + 1 < QUESTIONS.length) {
                setTags(nextTags);
                setStep(step + 1);
              } else {
                setTags(nextTags);
                setDone(true);
              }
            }}
            className="text-left px-4 py-3 rounded-lg border border-brand-200 hover:bg-brand-50 hover:border-brand-400 transition text-sm"
          >
            {t(o.key)}
          </button>
        ))}
      </div>
    </div>
  );
}
