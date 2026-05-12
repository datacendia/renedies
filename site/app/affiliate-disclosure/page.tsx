import { LegalLayout } from "@/components/LegalLayout";
import { LEGAL } from "@/lib/legal";
import Link from "next/link";

export const metadata = { title: `Affiliate Disclosure — ${LEGAL.brand}` };

export default function AffiliateDisclosurePage() {
  return (
    <LegalLayout title="Affiliate Disclosure">
      <div className="not-prose rounded-xl bg-brand-50 border-2 border-brand-200 p-5 mb-8">
        <p className="text-brand-900">
          <strong>Plain-English summary:</strong> Some of the "Where to buy" links on {LEGAL.brand}
          {" "}are affiliate links. If you click one and make a purchase, we may earn a small
          commission at no extra cost to you. This helps keep {LEGAL.brand} free to browse. We
          never let affiliate relationships influence which remedies we include or how we describe
          them.
        </p>
      </div>

      <h2>1. What an affiliate link is</h2>
      <p>
        An affiliate link is a URL that contains a unique tracking identifier. When you click it
        and then make a purchase on the destination site, the retailer pays us a percentage of
        that sale as a referral commission. The price you pay is the same whether you use our
        link or go directly — our commission comes out of the retailer's margin, not yours.
      </p>

      <h2>2. Required disclosures</h2>
      <p>
        We comply with the U.S. Federal Trade Commission's 16 CFR Part 255 ("Guides Concerning
        the Use of Endorsements and Testimonials in Advertising"), the UK CAP Code and ASA rules
        on affiliate marketing, and comparable rules in other jurisdictions. Every page that
        contains affiliate links carries a clear disclosure in the "Where to buy" section stating
        that we may earn a commission. Links to affiliate destinations are tagged{" "}
        <code>rel="sponsored"</code> in the page source, as required by Google and search engines.
      </p>

      <h2>3. Programs we participate in</h2>
      <p>We participate, or may participate, in the following affiliate programs:</p>
      <ul>
        <li>
          <strong>Amazon Associates.</strong> {LEGAL.brand} is a participant in the Amazon
          Services LLC Associates Program, an affiliate advertising program designed to provide
          a means for sites to earn advertising fees by advertising and linking to Amazon.com,
          Amazon.co.uk, Amazon.de, Amazon.in, and other Amazon properties. As an Amazon
          Associate, we earn from qualifying purchases.
        </li>
        <li><strong>iHerb Rewards Program</strong> (for global supplement and herb sourcing)</li>
        <li><strong>Mountain Rose Herbs Affiliate Program</strong> (for bulk botanical sourcing in the US)</li>
        <li><strong>Banyan Botanicals Affiliate Program</strong> (for organic Ayurvedic herbs)</li>
        <li><strong>Kottakkal Arya Vaidya Sala Affiliate Program</strong> (for classical Ayurvedic preparations)</li>
        <li><strong>Other regional affiliate programs</strong> where they exist for the retailers we reference</li>
      </ul>
      <p>
        We periodically add or remove programs. This list is indicative, not exhaustive. The
        underlying disclosure — that some links may earn a commission — applies regardless of the
        specific program.
      </p>

      <h2>4. Editorial independence</h2>
      <p>
        Affiliate relationships <strong>do not</strong> influence:
      </p>
      <ul>
        <li>Which remedies we include in the encyclopedia</li>
        <li>How we describe their benefits, risks, or mechanism of action</li>
        <li>The confidence tag we assign (verified / traditional / preliminary)</li>
        <li>Which suppliers appear in "Where to buy" (we surface the most reputable suppliers per region, regardless of affiliate status)</li>
        <li>Any safety warning or interaction we flag</li>
      </ul>
      <p>
        A supplier's inclusion in our "Where to buy" is not an endorsement of any specific product
        they sell. We encourage you to verify third-party testing (for heavy metals, pesticides,
        and species authentication) before buying any herbal product, regardless of source.
      </p>

      <h2>5. How we use commissions</h2>
      <p>
        Affiliate commissions help cover the costs of running {LEGAL.brand}: hosting, database
        fees, research curation, legal review, and contributor honoraria. Any surplus is
        reinvested into improving the encyclopedia.
      </p>

      <h2>6. Non-affiliate links</h2>
      <p>
        Not every outbound link is affiliate. Links to government health authorities (FDA, NCCIH,
        MHRA), research databases (PubMed, Kew POWO), Wikipedia, and academic publications are
        never monetized. We include them because they improve your ability to verify our content.
      </p>

      <h2>7. How to avoid affiliate links</h2>
      <p>
        If you prefer not to use our affiliate links, you can always visit the retailer directly
        by typing their URL into your browser, or search for the product name on your preferred
        search engine. Your ability to use {LEGAL.brand} in no way depends on clicking affiliate
        links — all educational content is fully accessible without them.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about this disclosure or any specific link:{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </p>

      <p className="text-sm text-neutral-500 mt-8">
        See also our <Link href="/terms">Terms of Service</Link>, {" "}
        <Link href="/privacy">Privacy Policy</Link>, and {" "}
        <Link href="/disclaimer">Medical Disclaimer</Link>.
      </p>
    </LegalLayout>
  );
}
