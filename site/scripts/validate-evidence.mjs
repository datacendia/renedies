/**
 * Validation script for evidence JSON files.
 * Enforces stricter requirements for Andean entries to prevent "the internet says so" curation.
 */

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const EVIDENCE_DIR = join(__dirname, "../data/evidence");

const ANDEAN_REQUIRED_SOURCE_TYPES = new Set([
  "ethnographic_field_study",
  "regional_monograph",
  "living_practitioner_lineage",
]);

function validateEvidenceFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    const errors = [];
    const warnings = [];

    // Basic structure validation
    if (!data.slug) errors.push("Missing slug");
    if (!data.reviewed) errors.push("Missing reviewed date");
    if (!data.claims || !Array.isArray(data.claims)) errors.push("Missing or invalid claims array");

    // Tradition-specific validation
    if (data.tradition === "andean") {
      // Andean entries require at least one ethnographic/lineage source for traditional claims
      const traditionalClaims = data.claims.filter((c) => c.grade === "traditional");
      if (traditionalClaims.length > 0) {
        const hasRequiredSource = traditionalClaims.some((claim) => {
          if (!claim.provenance) return false;
          return ANDEAN_REQUIRED_SOURCE_TYPES.has(claim.provenance.source_type);
        });

        if (!hasRequiredSource) {
          errors.push(
            "Andean entries with traditional claims must have at least one citation with source_type in {ethnographic_field_study, regional_monograph, living_practitioner_lineage}"
          );
        }
      }

      // Check that traditional claims have proper citations with author and year
      traditionalClaims.forEach((claim, idx) => {
        if (!claim.provenance) {
          errors.push(`Traditional claim #${idx + 1} (${claim.condition}) missing provenance`);
          return;
        }

        if (claim.provenance.source_type === "commercial_tradition") {
          warnings.push(
            `Traditional claim #${idx + 1} (${claim.condition}) uses commercial_tradition source - may indicate marketing rather than traditional use`
          );
        }

        const hasValidCitation = claim.provenance.citations.some((cit) => {
          return ANDEAN_REQUIRED_SOURCE_TYPES.has(claim.provenance.source_type) && cit.author && cit.year;
        });

        if (!hasValidCitation) {
          errors.push(
            `Traditional claim #${idx + 1} (${claim.condition}) must have at least one citation with author and year`
          );
        }
      });
    }

    // General provenance validation (all traditions)
    data.claims.forEach((claim, idx) => {
      if (claim.provenance) {
        if (!claim.provenance.source_type) {
          errors.push(`Claim #${idx + 1} (${claim.condition}) missing source_type`);
        }
        if (!claim.provenance.confidence) {
          errors.push(`Claim #${idx + 1} (${claim.condition}) missing confidence`);
        }
        if (!claim.provenance.citations || claim.provenance.citations.length === 0) {
          warnings.push(`Claim #${idx + 1} (${claim.condition}) has no citations`);
        }
      }
    });

    return { valid: errors.length === 0, errors, warnings, file: filePath };
  } catch (err) {
    return { valid: false, errors: [err.message], warnings: [], file: filePath };
  }
}

function main() {
  const files = readdirSync(EVIDENCE_DIR).filter((f) => f.endsWith(".json"));
  let allValid = true;

  console.log(`Validating ${files.length} evidence files...\n`);

  for (const file of files) {
    const result = validateEvidenceFile(join(EVIDENCE_DIR, file));
    
    if (!result.valid) {
      allValid = false;
      console.error(`❌ ${file}`);
      result.errors.forEach((err) => console.error(`   ERROR: ${err}`));
    } else {
      console.log(`✅ ${file}`);
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach((warn) => console.warn(`   WARN: ${warn}`));
    }
  }

  console.log();
  if (allValid) {
    console.log("✅ All evidence files passed validation");
    process.exit(0);
  } else {
    console.error("❌ Some evidence files failed validation");
    process.exit(1);
  }
}

main();
