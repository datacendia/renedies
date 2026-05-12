import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RITUALS } from "@/lib/rituals";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/MotionPrimitives";
import { Clock, Sunrise } from "lucide-react";

export const metadata = {
  title: "Guided Rituals",
  description: "Step-by-step herbal preparation walkthroughs with timers and ambient audio. Knowledge becomes practice.",
  alternates: { canonical: "/rituals" },
  openGraph: { title: "Guided Rituals", url: "/rituals", type: "website" }
};

export default async function RitualsIndex() {
  const t = await getTranslations("pages.rituals");
  const tc = await getTranslations("common");
  return (
    <section className="max-w-5xl mx-auto px-5 py-10 md:py-14">
      <header className="text-center mb-10">
        <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{t("eyebrow")}</div>
        <h1 className="font-display text-4xl md:text-6xl text-ink mt-2">{t("title")}</h1>
        <div className="divider-ornament w-44 mx-auto mt-4" />
        <FadeUp className="max-w-2xl mx-auto text-ink-soft mt-5 leading-relaxed">
          {t("body")}
        </FadeUp>
      </header>

      <Stagger className="grid md:grid-cols-2 gap-4">
        {RITUALS.map(r => (
          <StaggerItem key={r.slug}>
            <Link href={`/rituals/${r.slug}`} className="card block p-6 h-full group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">{r.region}</div>
                  <h2 className="font-display text-2xl text-ink mt-1 group-hover:text-accent transition">{r.title}</h2>
                </div>
                <span className="text-xs inline-flex items-center gap-1 text-ink-soft">
                  <Clock className="w-3.5 h-3.5" /> {r.duration}
                </span>
              </div>
              <p className="text-sm text-ink-soft mt-3 leading-relaxed">{r.why}</p>
              <div className="text-xs text-ink-soft mt-3 inline-flex items-center gap-1.5">
                <Sunrise className="w-3.5 h-3.5 text-ember" /> {r.bestTime}
              </div>
              <div className="text-xs text-accent mt-4 opacity-0 group-hover:opacity-100 transition">
                {tc("begin")} →
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
