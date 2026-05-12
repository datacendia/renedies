import { LegalLayout } from "@/components/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: `Medical Disclaimer — ${LEGAL.brand}` };

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Medical Disclaimer">
      <div className="not-prose rounded-xl bg-amber-50 border-2 border-amber-300 p-5 mb-8">
        <p className="text-amber-900 font-semibold">
          {LEGAL.brand} is an educational reference. It is not a substitute for professional medical advice,
          diagnosis, or treatment. Always seek the advice of your physician or other qualified health
          provider with any questions you may have regarding a medical condition.
        </p>
      </div>

      <h2>1. No medical advice</h2>
      <p>
        All content on {LEGAL.brand} — including text, images, recipes, dosing suggestions,
        symptom matches, and any other material — is provided solely for informational and
        educational purposes. Nothing on this site constitutes medical advice or a
        doctor-patient relationship.
      </p>
      <p>
        Traditional uses described on this site reflect historical, cultural, and ethnobotanical
        practice. They do not represent claims of efficacy recognized by the U.S. Food and Drug
        Administration, the UK Medicines and Healthcare products Regulatory Agency, the European
        Medicines Agency, or any equivalent regulator. No statement on this site has been evaluated
        by those authorities, and no product referenced is intended to diagnose, treat, cure, or
        prevent any disease.
      </p>

      <h2>2. Never stop or change treatment based on this site</h2>
      <p>
        Do not disregard, avoid, or delay obtaining medical advice from a qualified healthcare
        provider because of something you have read here. Do not stop, reduce, or change the dose
        of any prescription medication without first consulting your prescriber.
      </p>
      <p>
        If you think you are experiencing a medical emergency, call your local emergency number
        (for example, 999 in the UK, 911 in the US, 112 across most of the EU) immediately.
      </p>

      <h2>3. Herb-drug interactions are real and can be dangerous</h2>
      <p>Herbs can interact with prescription and over-the-counter medicines. Examples include:</p>
      <ul>
        <li><strong>St. John's Wort</strong> reduces the effectiveness of hormonal contraceptives, some HIV medications, certain antidepressants, and immunosuppressants.</li>
        <li><strong>Grapefruit, ginkgo, garlic, and ginger</strong> can increase bleeding risk when combined with warfarin or antiplatelet drugs.</li>
        <li><strong>Licorice</strong> can dangerously raise blood pressure and lower potassium.</li>
        <li><strong>Kava</strong> has been linked to rare but serious liver injury.</li>
      </ul>
      <p>
        If you take any prescription medication, have a chronic condition, are pregnant or
        breastfeeding, or are scheduled for surgery, consult a qualified healthcare professional
        (and ideally a clinical pharmacist or registered herbalist) before using any herb or
        supplement.
      </p>

      <h2>4. Special populations</h2>
      <p>
        Content on this site is written for informed adults. It is not intended for:
      </p>
      <ul>
        <li>Children under 18 without pediatric supervision</li>
        <li>Pregnant or breastfeeding people without obstetric/midwifery review</li>
        <li>People with serious chronic conditions (liver disease, kidney disease, autoimmune disease, cancer, cardiovascular disease) without specialist input</li>
        <li>People taking multiple medications, without pharmacist or physician review</li>
      </ul>

      <h2>5. Plant identification and quality</h2>
      <p>
        Plant identification is non-trivial. Many medicinal species have toxic look-alikes.
        Never ingest a wild-harvested plant unless identified by a qualified botanist or
        experienced foraging teacher. Herbal product quality varies widely between suppliers —
        adulteration, heavy-metal contamination, incorrect species, and ineffective extracts are
        common in unregulated markets. Prefer suppliers with third-party testing (USP, NSF,
        GMP-certified, or ConsumerLab).
      </p>

      <h2>6. Confidence tags</h2>
      <p>
        We label entries with a confidence indicator to be transparent about evidence:
      </p>
      <ul>
        <li><strong>Verified</strong> — supported by published clinical trials, systematic reviews, or recognized monographs (e.g. NCCIH, EMA, WHO).</li>
        <li><strong>Traditional use</strong> — well-documented historical/cultural use with limited modern clinical data.</li>
        <li><strong>Preliminary</strong> — early or limited data; use with extra caution and professional guidance.</li>
      </ul>
      <p>Even "verified" entries are educational — they are not prescriptions.</p>

      <h2>7. Reporting adverse events</h2>
      <p>
        If you experience an adverse reaction to any herb or supplement, stop use, consult a
        healthcare provider, and report it:
      </p>
      <ul>
        <li>UK: MHRA Yellow Card — <a href="https://yellowcard.mhra.gov.uk" rel="noopener">yellowcard.mhra.gov.uk</a></li>
        <li>US: FDA MedWatch — <a href="https://www.fda.gov/safety/medwatch" rel="noopener">fda.gov/safety/medwatch</a></li>
        <li>EU: Your national pharmacovigilance authority</li>
      </ul>

      <h2>8. Changes to this disclaimer</h2>
      <p>
        We may update this disclaimer to reflect new evidence, regulatory changes, or user
        feedback. The "Last updated" date above reflects the most recent revision.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about health-related content should go to your healthcare provider, not to us.
        For non-medical site questions, email{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}
