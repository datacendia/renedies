import { LegalLayout } from "@/components/LegalLayout";
import { LEGAL } from "@/lib/legal";
import Link from "next/link";

export const metadata = { title: `Terms of Service — ${LEGAL.brand}` };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        These Terms of Service ("<strong>Terms</strong>") govern your access to and use of
        {" "}<strong>{LEGAL.domain}</strong> and any related services (together, the "
        <strong>Service</strong>"), operated by {LEGAL.legalEntity} ("<strong>we</strong>,"
        "<strong>us</strong>," or "<strong>our</strong>"). By accessing or using the Service, you
        agree to be bound by these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old and able to form a binding contract to use the Service.
        By using the Service you represent that you meet these requirements.
      </p>

      <h2>2. Nature of the Service — educational only</h2>
      <p>
        The Service provides reference information about traditional and herbal remedies for
        educational purposes. See our{" "}
        <Link href="/disclaimer">Medical Disclaimer</Link>, which is incorporated into these
        Terms by reference. <strong>We do not provide medical advice.</strong> You use the Service
        at your own risk.
      </p>

      <h2>3. Accounts</h2>
      <p>
        Some features require an account. You agree to provide accurate information, keep your
        sign-in email secure, and promptly notify us of any unauthorized use. You are responsible
        for activity that occurs under your account. We may suspend or terminate accounts that
        violate these Terms.
      </p>

      <h2>4. Paid features</h2>
      <p>
        Certain features require payment (one-time purchases or subscriptions). By purchasing,
        you authorize {LEGAL.legalEntity} (and our payment processor, Shopify) to charge the
        payment method you provide. Subscriptions renew automatically at the then-current rate
        until cancelled in your account.
      </p>
      <h3>Refunds</h3>
      <p>
        Digital goods (PDFs, encyclopedia access) are generally non-refundable once delivered. If
        you experience a technical issue, contact us within 14 days of purchase and we will
        attempt to resolve it or provide a refund at our discretion. Subscribers may cancel at
        any time; cancellation stops future renewals but does not refund the current period
        unless required by law (for example, EU/UK consumer rights).
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        The Service, including all text, images, formatting, illustrations, compilations, code,
        and design, is owned by {LEGAL.legalEntity} or its licensors and is protected by
        copyright, trademark, and other laws. We grant you a limited, revocable, non-exclusive,
        non-transferable license to access the Service for your personal, non-commercial use.
      </p>
      <p>You may not:</p>
      <ul>
        <li>Copy, scrape, or bulk-download content beyond personal reading</li>
        <li>Republish, redistribute, or create derivative works without written permission</li>
        <li>Use the Service to train machine learning models</li>
        <li>Reverse-engineer, disassemble, or attempt to extract source code</li>
        <li>Resell access or share paid-tier credentials with others</li>
      </ul>
      <p>
        Third-party content (including plant descriptions sourced from open databases such as
        Kew's Plants of the World Online under CC BY) is used under its respective license;
        attributions are provided on individual entries where required.
      </p>

      <h2>6. User content and submissions</h2>
      <p>
        If you submit feedback, suggestions, or recipes to us, you grant {LEGAL.legalEntity} a
        worldwide, royalty-free, perpetual, irrevocable, sublicensable license to use, reproduce,
        modify, adapt, publish, and distribute that content in connection with the Service.
      </p>

      <h2>7. Prohibited conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose or in violation of any applicable law</li>
        <li>Submit false or misleading health claims impersonating {LEGAL.brand}</li>
        <li>Attempt to interfere with the Service, access unauthorized accounts, or bypass security</li>
        <li>Use automated tools (bots, scrapers) without our written consent</li>
        <li>Introduce viruses, malware, or harmful code</li>
      </ul>

      <h2>8. Third-party links and affiliate relationships</h2>
      <p>
        The Service contains links to third-party websites, including affiliate links to
        suppliers. Those sites are operated independently; we are not responsible for their
        content, products, or practices. See our{" "}
        <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for details.
      </p>

      <h2>9. Disclaimers — Service "as is"</h2>
      <p className="uppercase text-sm">
        To the fullest extent permitted by law, the Service is provided "as is" and "as
        available," without warranties of any kind, express or implied, including warranties of
        merchantability, fitness for a particular purpose, non-infringement, or accuracy. We do
        not warrant that the Service will be uninterrupted, timely, secure, or error-free, or
        that any content is complete, current, or reliable.
      </p>

      <h2>10. Limitation of liability</h2>
      <p className="uppercase text-sm">
        To the fullest extent permitted by law, in no event will {LEGAL.legalEntity}, its
        officers, directors, employees, agents, licensors, or suppliers be liable for any
        indirect, incidental, special, consequential, exemplary, or punitive damages, or any loss
        of profits, revenue, data, goodwill, or other intangible losses, arising out of or in
        connection with your use of, or inability to use, the Service — whether based on
        warranty, contract, tort (including negligence), statute, or any other legal theory, and
        whether or not we have been advised of the possibility of such damage.
      </p>
      <p className="uppercase text-sm">
        In jurisdictions that do not allow exclusion of certain warranties or limitation of
        liability for incidental or consequential damages, our liability will be limited to the
        maximum extent permitted by law. Our total aggregate liability to you for any and all
        claims arising out of or relating to these Terms or the Service will not exceed the
        greater of (a) the total amount you paid us in the twelve (12) months preceding the event
        giving rise to the claim, or (b) one hundred pounds (£100) / one hundred US dollars
        ($100).
      </p>
      <p>
        Nothing in these Terms limits liability that cannot be limited under applicable law,
        including liability for death or personal injury caused by our negligence, fraud, or
        fraudulent misrepresentation, or statutory rights of consumers that cannot be waived.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {LEGAL.legalEntity} and its affiliates from any
        claims, damages, liabilities, costs, and expenses (including reasonable legal fees)
        arising out of or relating to: (a) your use of the Service; (b) your violation of these
        Terms; (c) your violation of any rights of a third party; or (d) any content you submit.
      </p>

      <h2>12. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time, with or without
        notice, for any reason, including violation of these Terms. Sections that by their
        nature should survive termination (including sections 5, 9, 10, 11, 13, and 14) will
        survive.
      </p>

      <h2>13. Governing law and dispute resolution</h2>
      <p>
        These Terms are governed by the laws of {LEGAL.jurisdiction}, without regard to
        conflict-of-law principles. Any dispute arising out of or relating to these Terms or the
        Service will be brought exclusively in the courts of {LEGAL.jurisdiction}, and you
        consent to their personal jurisdiction. Nothing in this section limits your statutory
        consumer rights to bring proceedings in the courts of your country of residence.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may modify these Terms from time to time. The "Last updated" date above reflects the
        most recent version. Material changes will be communicated via email to registered
        users or a notice on the Service. Your continued use after changes become effective
        constitutes acceptance of the updated Terms.
      </p>

      <h2>15. Miscellaneous</h2>
      <p>
        These Terms, together with our <Link href="/privacy">Privacy Policy</Link>,{" "}
        <Link href="/disclaimer">Medical Disclaimer</Link>, and{" "}
        <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>, constitute the entire
        agreement between you and us regarding the Service. If any provision is held
        unenforceable, the remaining provisions will remain in full force. Our failure to enforce
        a provision is not a waiver of our right to do so later. You may not assign these Terms;
        we may assign them to any successor or affiliate.
      </p>

      <h2>16. Contact</h2>
      <p>
        {LEGAL.legalEntity}<br />
        {LEGAL.mailingAddress}<br />
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
      </p>
    </LegalLayout>
  );
}
