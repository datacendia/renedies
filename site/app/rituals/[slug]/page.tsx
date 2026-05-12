import { notFound } from "next/navigation";
import { RITUALS, getRitual } from "@/lib/rituals";
import { RitualPlayer } from "@/components/rituals/RitualPlayer";

export function generateStaticParams() {
  return RITUALS.map(r => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const r = getRitual(params.slug);
  if (!r) return { title: "Ritual" };
  return {
    title: `${r.title} — Guided Ritual`,
    description: `Step-by-step ritual preparation: ${r.title}. Timers, ambient audio, and completion tracking.`,
    alternates: { canonical: `/rituals/${params.slug}` },
    openGraph: {
      title: `${r.title} — Guided Ritual`,
      url: `/rituals/${params.slug}`,
      type: "article"
    }
  };
}

export default function RitualPage({ params }: { params: { slug: string } }) {
  const r = getRitual(params.slug);
  if (!r) notFound();
  return <RitualPlayer ritual={r} />;
}
