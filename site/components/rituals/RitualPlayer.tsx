"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Volume2, VolumeX, Check, Sunrise, Clock, Flame } from "lucide-react";
import type { Ritual } from "@/lib/rituals";
import { logRitual, currentStreak } from "@/lib/personal";

/** Ambient audio — generated on the fly with WebAudio (no external assets).
 *  A slow, soft, low-pitched binaural-ish pad that can be turned off. */
function useAmbient() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode[]; gain: GainNode } | null>(null);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AC) return;
    const ctx = new AC();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    // Two detuned sine waves create a gentle beat — ~2Hz beat frequency.
    const osc1 = ctx.createOscillator(); osc1.type = "sine"; osc1.frequency.value = 110;
    const osc2 = ctx.createOscillator(); osc2.type = "sine"; osc2.frequency.value = 112;
    const osc3 = ctx.createOscillator(); osc3.type = "sine"; osc3.frequency.value = 164.81; // E3
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 800;
    osc1.connect(lp); osc2.connect(lp); osc3.connect(lp); lp.connect(gain);
    osc1.start(); osc2.start(); osc3.start();
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    nodesRef.current = { osc: [osc1, osc2, osc3], gain };
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current, n = nodesRef.current;
    if (!ctx || !n) return;
    n.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => { n.osc.forEach(o => o.stop()); ctx.close(); ctxRef.current = null; nodesRef.current = null; }, 900);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const toggle = () => {
    if (on) stop(); else start();
    setOn(!on);
  };
  return { on, toggle };
}

export function RitualPlayer({ ritual }: { ritual: Ritual }) {
  const [i, setI] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [streak, setStreak] = useState(0);
  const [logged, setLogged] = useState(false);
  const ambient = useAmbient();

  const step = ritual.steps[i];
  const hasTimer = typeof step.seconds === "number";

  // Reset timer when step changes
  useEffect(() => {
    setSecondsLeft(step.seconds ?? null);
    setRunning(false);
  }, [i, step.seconds]);

  // Tick
  useEffect(() => {
    if (!running || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      // Gentle 'ding' on completion
      try {
        const AC = (window.AudioContext || (window as any).webkitAudioContext);
        const ctx = new AC();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = 880;
        g.gain.value = 0; o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime;
        g.gain.linearRampToValueAtTime(0.22, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
        o.start(t); o.stop(t + 1.3);
        setTimeout(() => ctx.close(), 1400);
      } catch {}
      return;
    }
    const id = setTimeout(() => setSecondsLeft(s => (s ?? 0) - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft]);

  const progress = useMemo(() => (i + 1) / ritual.steps.length, [i, ritual.steps.length]);

  const next = () => {
    setCompleted(prev => new Set(prev).add(i));
    if (i < ritual.steps.length - 1) setI(i + 1);
  };
  const prev = () => { if (i > 0) setI(i - 1); };
  const restartStep = () => { setSecondsLeft(step.seconds ?? null); setRunning(false); };

  return (
    <section className="max-w-3xl mx-auto px-5 py-10 md:py-14">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/rituals" className="text-xs text-ink-soft hover:text-ink inline-flex items-center gap-1">
          ← All rituals
        </Link>
        <div className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold mt-4">{ritual.region}</div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-2">{ritual.title}</h1>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ritual.duration}</span>
          <span className="inline-flex items-center gap-1"><Sunrise className="w-3.5 h-3.5 text-ember" /> {ritual.bestTime}</span>
          <button
            onClick={ambient.toggle}
            aria-pressed={ambient.on}
            aria-label={ambient.on ? "Mute ambient sound" : "Play ambient sound"}
            className="inline-flex items-center gap-1 hover:text-ink transition"
          >
            {ambient.on ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            Ambient
          </button>
        </div>
        <p className="text-ink-soft italic max-w-lg mx-auto mt-4">{ritual.why}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
          <span>Step {i + 1} of {ritual.steps.length}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1 rounded-full bg-line overflow-hidden">
          <motion.div
            className="h-full bg-ember"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.32 }}
          className="card p-8 min-h-[360px] relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none opacity-60 bg-candlelight" />

          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-semibold">
              Step {i + 1}
            </div>
            <h2 className="font-display text-3xl text-ink mt-2 leading-tight">{step.title}</h2>
            <p className="text-ink-soft mt-4 leading-relaxed text-lg">{step.body}</p>

            {hasTimer && (
              <TimerDisplay
                total={step.seconds!}
                left={secondsLeft ?? 0}
                running={running}
                onToggle={() => setRunning(r => !r)}
                onReset={restartStep}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prev}
          disabled={i === 0}
          className="btn btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {i < ritual.steps.length - 1 ? (
          <button onClick={next} className="btn btn-ember">
            Next step <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCompleted(prev => new Set(prev).add(i))}
            className="btn btn-ember"
            disabled={completed.has(i)}
          >
            <Check className="w-4 h-4" /> {completed.has(i) ? "Complete" : "Finish"}
          </button>
        )}
      </div>

      {completed.has(ritual.steps.length - 1) && (
        <RitualCompletion
          ritualSlug={ritual.slug}
          logged={logged}
          streak={streak}
          onLogged={(s) => { setLogged(true); setStreak(s); }}
          onRedo={() => { setI(0); setCompleted(new Set()); setLogged(false); }}
        />
      )}
    </section>
  );
}

/* ─────── Completion card with streak mechanic ─────── */
function RitualCompletion({
  ritualSlug, logged, streak, onLogged, onRedo
}: {
  ritualSlug: string;
  logged: boolean;
  streak: number;
  onLogged: (streak: number) => void;
  onRedo: () => void;
}) {
  const doLog = () => {
    logRitual(ritualSlug);
    onLogged(currentStreak());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="mt-8 card p-6 text-center border-ember/40 bg-ember/5 relative overflow-hidden"
    >
      {logged && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.6 }}
          className="absolute inset-0 bg-ember/20 rounded-full pointer-events-none"
        />
      )}
      <div className="font-display text-2xl text-ink">Ritual complete.</div>
      <p className="text-ink-soft text-sm mt-1">
        Sit for one more minute before returning to screens.
      </p>

      {logged ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.2 }}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ember/15 border border-ember/40 text-ember font-display text-lg"
        >
          <Flame className="w-5 h-5" />
          {streak} day{streak === 1 ? "" : "s"} streak
        </motion.div>
      ) : (
        <button onClick={doLog} className="btn btn-ember mt-5">
          <Flame className="w-4 h-4" /> Log this practice
        </button>
      )}

      <div className="mt-5 flex gap-3 justify-center flex-wrap">
        <Link href="/me" className="btn btn-ghost">Your practice log</Link>
        <Link href="/rituals" className="btn btn-ghost">More rituals</Link>
        <button onClick={onRedo} className="btn btn-ghost">
          <RotateCcw className="w-4 h-4" /> Do it again
        </button>
      </div>
    </motion.div>
  );
}

/* ─────── Timer display ─────── */
function TimerDisplay({
  total, left, running, onToggle, onReset
}: { total: number; left: number; running: boolean; onToggle: () => void; onReset: () => void }) {
  const mm = Math.floor(left / 60).toString().padStart(2, "0");
  const ss = (left % 60).toString().padStart(2, "0");
  const r  = 56;
  const c  = 2 * Math.PI * r;
  const ratio = Math.max(0, Math.min(1, left / total));
  return (
    <div className="mt-8 flex items-center gap-5">
      <svg viewBox="0 0 140 140" className="w-32 h-32">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgb(var(--line))" strokeWidth="6" />
        <motion.circle
          cx="70" cy="70" r={r} fill="none"
          stroke="rgb(var(--ember))" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - ratio) }}
          transition={{ duration: 1, ease: "linear" }}
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="76" textAnchor="middle" className="font-display"
              fontSize="26" fill="rgb(var(--ink))">
          {mm}:{ss}
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        <button onClick={onToggle} className="btn btn-ember">
          {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start timer</>}
        </button>
        <button onClick={onReset} className="btn btn-ghost !text-xs">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}
