"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

interface CaptionGeneratorProps {
  title: string;
  description?: string;
  region?: string;
  hashtags?: string[];
}

export default function CaptionGenerator({
  title,
  description,
  region,
  hashtags = ["HerbalRemedies", "NaturalHealth", "TraditionalMedicine", "Ayurveda", "TCM", "Kampo"],
}: CaptionGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const generateCaption = () => {
    const lines: string[] = [];
    
    lines.push(`🌿 ${title}`);
    lines.push("");
    
    if (description) {
      lines.push(description);
      lines.push("");
    }
    
    if (region) {
      lines.push(`✨ ${region} tradition`);
      lines.push("");
    }
    
    lines.push("🔗 Learn more at Remedia.app");
    lines.push("");
    lines.push(hashtags.map((h) => `#${h}`).join(" "));
    
    return lines.join("\n");
  };

  const copyCaption = () => {
    const caption = generateCaption();
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-line">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-ink">Caption Generator</span>
        </div>
        <button
          onClick={copyCaption}
          className="flex items-center gap-2 px-3 py-1.5 bg-ember hover:bg-ember/90 text-white rounded-lg text-xs font-medium transition"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="bg-white rounded-lg p-3 border border-line">
        <pre className="text-xs text-ink whitespace-pre-wrap font-sans">
          {generateCaption()}
        </pre>
      </div>
    </div>
  );
}
