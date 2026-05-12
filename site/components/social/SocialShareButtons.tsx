"use client";

import { Share2, Link as LinkIcon } from "lucide-react";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

export default function SocialShareButtons({
  url,
  title,
  description,
  hashtags = ["HerbalRemedies", "NaturalHealth", "TraditionalMedicine"],
}: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedDesc = encodeURIComponent(description || "");

  const shareToPinterest = () => {
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDesc}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={shareNative}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      <button
        onClick={shareToPinterest}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition"
        title="Share to Pinterest"
      >
        <span className="font-bold text-sm">Pinterest</span>
      </button>

      <button
        onClick={copyLink}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
        title="Copy link"
      >
        <LinkIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Copy</span>
      </button>
    </div>
  );
}
