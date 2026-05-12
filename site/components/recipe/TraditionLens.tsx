"use client";

import { useState } from "react";
import { Sparkles, Flame, Droplets, Wind, Waves, type LucideIcon } from "lucide-react";
import { energeticPropertiesFor, type EnergeticProperty } from "@/lib/energetic";

type Tradition = "tcm" | "ayurveda" | "kampo" | "off";

interface TraditionLensProps {
  ingredients: Array<{ name: string; parts: number }>;
}

const TRADITION_CONFIG: Record<Tradition, { label: string; icon: LucideIcon | null; color: string }> = {
  tcm: { label: "TCM", icon: Sparkles, color: "text-purple-600 bg-purple-50 border-purple-200" },
  ayurveda: { label: "Ayurveda", icon: Flame, color: "text-orange-600 bg-orange-50 border-orange-200" },
  kampo: { label: "Kampo", icon: Sparkles, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  off: { label: "Off", icon: null, color: "text-slate-600 bg-slate-50 border-slate-200" },
};

const PROPERTY_ICONS: Record<EnergeticProperty, LucideIcon> = {
  warming: Flame,
  cooling: Droplets,
  drying: Wind,
  moistening: Waves,
};

const PROPERTY_COLORS: Record<EnergeticProperty, string> = {
  warming: "bg-orange-100 text-orange-700 border-orange-300",
  cooling: "bg-blue-100 text-blue-700 border-blue-300",
  drying: "bg-yellow-100 text-yellow-700 border-yellow-300",
  moistening: "bg-teal-100 text-teal-700 border-teal-300",
};

export default function TraditionLens({ ingredients }: TraditionLensProps) {
  const [tradition, setTradition] = useState<Tradition>("off");
  const [expandedProperty, setExpandedProperty] = useState<EnergeticProperty | null>(null);

  const config = TRADITION_CONFIG[tradition];

  // Count energetic properties across ingredients
  const propertyCounts = new Map<EnergeticProperty, number>();
  const propertyDetails = new Map<EnergeticProperty, Set<string>>();

  for (const ing of ingredients) {
    const props = energeticPropertiesFor(ing.name);
    for (const prop of props) {
      // Only show if it matches the selected tradition
      if (tradition !== "off" && (prop.tradition === tradition || (tradition === "kampo" && prop.tradition === "tcm"))) {
        propertyCounts.set(prop.property, (propertyCounts.get(prop.property) || 0) + 1);
        if (!propertyDetails.has(prop.property)) {
          propertyDetails.set(prop.property, new Set());
        }
        propertyDetails.get(prop.property)!.add(ing.name);
      }
    }
  }

  // Show warning if 3+ herbs share the same property
  const stackedProperties = Array.from(propertyCounts.entries())
    .filter(([_, count]) => count >= 3)
    .map(([prop, count]) => ({ property: prop, count }));

  if (tradition === "off") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTradition("tcm")}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Tradition Lens</span>
        </button>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setTradition("off")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border ${config.color}`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          <span>{config.label} Lens</span>
        </button>
        <span className="text-xs text-ink-soft">Pedagogy, not pharmacovigilance</span>
      </div>

      {/* Stacked properties warning */}
      {stackedProperties.length > 0 && (
        <div className="rounded-xl p-4 border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Energetic Commentary</span>
          </div>
          {stackedProperties.map(({ property, count }) => {
            const PropIcon = PROPERTY_ICONS[property];
            const propColor = PROPERTY_COLORS[property];
            return (
              <div key={property} className="mb-3 last:mb-0">
                <button
                  onClick={() => setExpandedProperty(expandedProperty === property ? null : property)}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <PropIcon className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-ink">
                    High {property} stack ({count} herbs)
                  </span>
                </button>
                {expandedProperty === property && (
                  <div className="mt-2 pl-6 text-xs text-ink-soft">
                    <p>
                      According to {config.label} logic, combining multiple {property} herbs may be
                      unbalanced. Consider adding a complementary herb.
                    </p>
                    <div className="mt-2">
                      <span className="font-medium text-ink">Herbs in this stack:</span>{" "}
                      {Array.from(propertyDetails.get(property) || []).join(", ")}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Individual herb properties */}
      {ingredients.map((ing) => {
        const props = energeticPropertiesFor(ing.name).filter(
          (p) => p.tradition === tradition || (tradition === "kampo" && p.tradition === "tcm")
        );
        if (props.length === 0) return null;

        return (
          <div key={ing.name} className="flex items-start gap-2 text-xs">
            <span className="text-ink-soft w-20 truncate">{ing.name}</span>
            <div className="flex flex-wrap gap-1">
              {props.map((prop) => {
                const PropIcon = PROPERTY_ICONS[prop.property];
                const propColor = PROPERTY_COLORS[prop.property];
                return (
                  <span
                    key={`${prop.property}-${prop.tradition}`}
                    className={`px-2 py-0.5 rounded-full border ${propColor} flex items-center gap-1`}
                    title={`${prop.tradition}: ${prop.description}`}
                  >
                    <PropIcon className="w-3 h-3" />
                    {prop.property}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
