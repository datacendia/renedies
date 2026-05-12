"use client";

import { useState } from "react";
import { FlaskConical, Info, ChevronDown, ExternalLink, AlertTriangle } from "lucide-react";

export type EvidenceGrade = "likely" | "possibly" | "unclear" | "preliminary" | "ineffective" | "traditional";

export type SourceType =
  | "classical_text" // named canonical work (Charaka, Shen Nong, Ishinpō)
  | "regional_pharmacopoeia" // modern state-sanctioned compendium
  | "colonial_chronicle" // pre-20th-century observer-external account
  | "ethnographic_field_study" // peer-reviewed anthropological/ethnobotanical fieldwork
  | "regional_monograph" // scholarly reference compiled from multiple ethnographic sources
  | "living_practitioner_lineage" // claim traceable to documented named teacher/lineage
  | "modern_clinical" // RCT, meta-analysis, observational study
  | "modern_preclinical" // cell/animal work only
  | "commercial_tradition" // claim exists in marketplace but traditional basis is thin

export type Confidence = "well-documented" | "moderate" | "preliminary" | "contested";

export interface Study {
  pmid: string;
  citation: string;
  design: string;
  n: number;
  duration_weeks: number;
  dose_mg_day?: number;
  result: string;
}

export interface ProvenanceCitation {
  type: "ethnobotany" | "regional_monograph" | "classical" | "clinical" | "preclinical";
  author?: string;
  year?: number;
  title?: string;
  doi?: string;
  pmid?: string;
  citation?: string;
}

export interface Provenance {
  source_type: SourceType;
  confidence: Confidence;
  citations: ProvenanceCitation[];
  commercial_drift_note?: string; // When modern marketed claim diverges from traditional claim
}

export interface EvidenceClaim {
  condition: string;
  grade: EvidenceGrade;
  summary: string;
  studies: Study[];
  contradicted_by?: string[]; // PMIDs of studies that contradict this claim
  clinical_protocol?: {
    standard: string; // What the clinical trials used (e.g., "standardized extracts containing 21–30mg of withanolides daily")
    traditional_equivalence?: string; // Traditional preparation equivalent (e.g., "3–6g of high-quality whole root powder prepared as a decoction")
  };
  provenance?: Provenance; // Source type, confidence, and citations for the claim
}

export interface EvidenceData {
  slug: string;
  reviewed: string;
  tradition?: "ayurveda" | "tcm" | "kampo" | "andean" | "western";
  tradition_subregion?: string; // For Andean: junin-highlands, cusco-puno-altiplano, etc.
  claims: EvidenceClaim[];
}

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  classical_text: "Classical text",
  regional_pharmacopoeia: "Pharmacopoeia",
  colonial_chronicle: "Chronicle",
  ethnographic_field_study: "Field study",
  regional_monograph: "Monograph",
  living_practitioner_lineage: "Lineage",
  modern_clinical: "Clinical",
  modern_preclinical: "Preclinical",
  commercial_tradition: "Commercial",
};

function getSourceTypeLabel(type: SourceType): string {
  return SOURCE_TYPE_LABELS[type];
}

const GRADE_META: Record<
  EvidenceGrade,
  { label: string; color: string; dots: string; description: string }
> = {
  likely: {
    label: "LIKELY",
    color: "text-emerald-600",
    dots: "●●●●○",
    description: "≥ 2 well-designed RCTs OR a meta-analysis, consistent direction, clinically meaningful effect",
  },
  possibly: {
    label: "POSSIBLY",
    color: "text-teal-600",
    dots: "●●●○○",
    description: "1 good RCT or multiple smaller / mixed trials leaning positive",
  },
  unclear: {
    label: "UNCLEAR",
    color: "text-amber-600",
    dots: "●●○○○",
    description: "Conflicting trials, or single small trial not replicated",
  },
  preliminary: {
    label: "PRELIMINARY",
    color: "text-orange-600",
    dots: "●○○○○",
    description: "Animal / in-vitro / case-report evidence only",
  },
  ineffective: {
    label: "INEFFECTIVE",
    color: "text-red-600",
    dots: "⚠️○○○○",
    description: "Well-designed studies show no meaningful benefit; contradicts traditional claims",
  },
  traditional: {
    label: "TRADITIONAL",
    color: "text-slate-500",
    dots: "○○○○○",
    description: "No modern clinical studies; classical use documented",
  },
};

interface EvidencePanelProps {
  data: EvidenceData | null;
}

export default function EvidencePanel({ data }: EvidencePanelProps) {
  const [showSchema, setShowSchema] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="mt-6 rounded-xl border border-line p-4 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-slate-600">
            EFFECTIVENESS
          </h3>
        </div>
        <div className="text-sm text-slate-600">
          <p className="mb-2">No evidence data available for this remedy.</p>
          <p className="text-xs text-slate-500 italic">
            We actively search PubMed & Cochrane; this will update as studies appear.
          </p>
        </div>
      </div>
    );
  }

  const allTraditional = data.claims.every((c) => c.grade === "traditional");

  return (
    <div className="mt-6 rounded-xl border border-line bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-ink">
            EFFECTIVENESS
          </h3>
        </div>
        <button
          onClick={() => setShowSchema(!showSchema)}
          className="text-xs text-ink-soft hover:text-ink flex items-center gap-1"
        >
          How we grade
          <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: showSchema ? "rotate(180deg)" : "" }} />
        </button>
      </div>

      {/* Grading schema explainer */}
      {showSchema && (
        <div className="px-4 py-3 bg-slate-50 border-b border-line">
          <p className="text-xs text-slate-600 mb-3">Evidence grading schema:</p>
          <div className="space-y-2">
            {Object.entries(GRADE_META).map(([key, meta]) => (
              <div key={key} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-slate-500">{meta.dots}</span>
                <div>
                  <span className={`font-semibold ${meta.color}`}>{meta.label}</span>
                  <span className="text-slate-500"> — </span>
                  <span className="text-slate-600">{meta.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claims */}
      <div className="divide-y divide-line">
        {allTraditional ? (
          <div className="px-4 py-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-slate-600 mb-2">
              <span className="font-mono text-2xl text-slate-400">○○○○○</span>
              <span className="font-semibold text-slate-600">TRADITIONAL USE ONLY</span>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              No modern clinical studies indexed. Ethnobotanical documentation only — see sources below.
            </p>
            <p className="text-xs text-slate-500 italic">
              We actively search PubMed & Cochrane; this will update as studies appear. Found one we missed? Let us know.
            </p>
          </div>
        ) : (
          data.claims.map((claim) => {
            const meta = GRADE_META[claim.grade];
            const isExpanded = expandedClaim === claim.condition;

            return (
              <div key={claim.condition} className="px-4 py-4">
                <div className="flex items-start gap-3">
                  {/* Dots */}
                  <div className="font-mono text-lg leading-none pt-0.5" style={{ color: meta.color }}>
                    {meta.dots}
                  </div>

                  {/* Claim content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-ink">{claim.condition}</span>
                      <span className={`text-xs font-semibold tracking-[0.1em] ${meta.color}`}>
                        {meta.label}
                      </span>
                      {claim.provenance && (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          {claim.provenance.source_type === "commercial_tradition" && <AlertTriangle className="w-3 h-3" />}
                          {getSourceTypeLabel(claim.provenance.source_type)}
                        </span>
                      )}
                      {claim.contradicted_by && claim.contradicted_by.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          Contradicted
                        </span>
                      )}
                      <button
                        onClick={() => setExpandedClaim(isExpanded ? null : claim.condition)}
                        className="text-ink-soft hover:text-ink ml-auto"
                        aria-label="Show details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 mb-2">{claim.summary}</p>

                    {/* Provenance details */}
                    {claim.provenance && isExpanded && (
                      <div className="mb-2 text-xs bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 shrink-0 text-purple-600" />
                          <div>
                            <span className="font-medium text-purple-700">Source: </span>
                            <span className="text-slate-700">{getSourceTypeLabel(claim.provenance.source_type)}</span>
                            <span className="mx-1 text-slate-400">·</span>
                            <span className="text-slate-600 capitalize">{claim.provenance.confidence} confidence</span>
                            {claim.provenance.commercial_drift_note && (
                              <>
                                <span className="mx-1 text-amber-600">·</span>
                                <span className="text-amber-600 font-medium">⚠ Commercial drift</span>
                              </>
                            )}
                            {claim.provenance.citations.length > 0 && (
                              <div className="mt-1.5">
                                <span className="font-medium text-slate-700">Citations:</span>
                                <div className="mt-1 space-y-0.5">
                                  {claim.provenance.citations.map((cit, i) => (
                                    <div key={i} className="text-slate-600">
                                      {cit.author && <span className="font-medium">{cit.author}</span>}
                                      {cit.year && <span> ({cit.year})</span>}
                                      {cit.title && <span>: {cit.title}</span>}
                                      {cit.doi && (
                                        <a
                                          href={`https://doi.org/${cit.doi}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-accent hover:text-accent/70 ml-1"
                                        >
                                          DOI
                                        </a>
                                      )}
                                      {cit.pmid && (
                                        <a
                                          href={`https://pubmed.ncbi.nlm.nih.gov/${cit.pmid}/`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-accent hover:text-accent/70 ml-1"
                                        >
                                          PMID {cit.pmid}
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {claim.provenance.commercial_drift_note && (
                              <div className="mt-1.5 text-amber-700 italic">
                                {claim.provenance.commercial_drift_note}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Clinical protocol bridge */}
                    {claim.clinical_protocol && isExpanded && (
                      <div className="mb-2 text-xs bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <div className="flex items-start gap-2">
                          <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                          <div>
                            <span className="font-medium text-emerald-700">Clinical Standard:</span>
                            <span className="ml-1 text-slate-700">{claim.clinical_protocol.standard}</span>
                            {claim.clinical_protocol.traditional_equivalence && (
                              <>
                                <div className="mt-1.5">
                                  <span className="font-medium text-emerald-700">Traditional Equivalence:</span>
                                  <span className="ml-1 text-slate-700">{claim.clinical_protocol.traditional_equivalence}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contradiction notice */}
                    {claim.contradicted_by && claim.contradicted_by.length > 0 && (
                      <div className="mb-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium">Contradicted by modern evidence:</span>
                            <span className="ml-1">
                              {claim.contradicted_by.length} study{claim.contradicted_by.length !== 1 ? "s" : ""} showing no benefit
                            </span>
                            {isExpanded && (
                              <div className="mt-1.5 flex flex-wrap gap-2">
                                {claim.contradicted_by.map((pmid) => (
                                  <a
                                    key={pmid}
                                    href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:text-accent/70 flex items-center gap-1"
                                  >
                                    PMID {pmid}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expanded study details */}
                    {isExpanded && claim.studies.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {claim.studies.map((study, idx) => (
                          <div
                            key={study.pmid}
                            className="text-xs bg-slate-50 rounded-lg p-3 border border-slate-200"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-medium text-ink">{study.citation}</span>
                              <a
                                href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:text-accent/70 flex items-center gap-1 shrink-0"
                                aria-label="View on PubMed"
                              >
                                <span className="text-xs">PMID {study.pmid}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <div className="text-slate-600 space-y-0.5">
                              <div>
                                <span className="text-slate-500">Design:</span> {study.design}
                              </div>
                              <div>
                                <span className="text-slate-500">n:</span> {study.n}
                                {study.duration_weeks && (
                                  <>
                                    <span className="ml-2 text-slate-500">Duration:</span> {study.duration_weeks} weeks
                                  </>
                                )}
                              </div>
                              {study.dose_mg_day && (
                                <div>
                                  <span className="text-slate-500">Dose:</span> {study.dose_mg_day} mg/day
                                </div>
                              )}
                              <div>
                                <span className="text-slate-500">Result:</span> {study.result}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Collapsed citation count */}
                    {!isExpanded && claim.studies.length > 0 && (
                      <button
                        onClick={() => setExpandedClaim(claim.condition)}
                        className="text-xs text-accent hover:text-accent/70 mt-2"
                      >
                        → {claim.studies.length} study{claim.studies.length !== 1 ? "s" : ""} available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-line text-[10px] text-slate-500 flex items-center justify-between">
        <span>Last reviewed {new Date(data.reviewed).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        <span className="text-slate-400">Grading schema →</span>
      </div>
    </div>
  );
}
