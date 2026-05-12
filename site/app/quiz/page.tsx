import { getTranslations } from "next-intl/server";
import { SymptomQuiz } from "@/components/SymptomQuiz";

export const metadata = {
  title: "Find your remedy · Remedia",
  description:
    "Answer three quick questions and Remedia suggests herbs across Ayurveda, TCM, Kampo, Andean, and global folk traditions."
};

export default async function QuizPage() {
  const t = await getTranslations("pages.quiz");
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="font-serif text-4xl text-brand-800 text-center">{t("title")}</h1>
      <p className="text-neutral-600 text-center mt-2 mb-8">
        {t("body")}
      </p>
      <SymptomQuiz />
      <p className="text-xs text-neutral-500 mt-6 text-center">
        {t("disclaimer")}
      </p>
    </div>
  );
}
