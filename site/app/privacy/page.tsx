import { LegalLayout } from "@/components/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: `Privacy Policy — ${LEGAL.brand}` };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        {LEGAL.legalEntity} ("<strong>we</strong>," "<strong>us</strong>") operates{" "}
        <strong>{LEGAL.domain}</strong>. We respect your privacy and are committed to protecting
        your personal data. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information, and your rights under the UK GDPR, EU GDPR (Regulation (EU)
        2016/679), and the California Consumer Privacy Act ("CCPA").
      </p>

      <h2>1. Who we are (Controller)</h2>
      <p>
        {LEGAL.legalEntity} is the data controller of personal data collected via the Service.
      </p>
      <p>
        Data protection contact:{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
        <br />
        Mailing address: {LEGAL.mailingAddress}
      </p>

      <h2>2. What we collect</h2>
      <table className="not-prose w-full my-6 text-sm">
        <thead className="bg-brand-50">
          <tr>
            <th className="text-left p-2 border border-brand-100">Category</th>
            <th className="text-left p-2 border border-brand-100">Examples</th>
            <th className="text-left p-2 border border-brand-100">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border border-brand-100">Identity / contact</td>
            <td className="p-2 border border-brand-100">Email address, optional name</td>
            <td className="p-2 border border-brand-100">You (sign-in, purchase)</td>
          </tr>
          <tr>
            <td className="p-2 border border-brand-100">Transaction</td>
            <td className="p-2 border border-brand-100">Order ID, purchased tier, amount, date</td>
            <td className="p-2 border border-brand-100">Shopify (processor)</td>
          </tr>
          <tr>
            <td className="p-2 border border-brand-100">Account activity</td>
            <td className="p-2 border border-brand-100">Favorites, quiz answers, session tokens</td>
            <td className="p-2 border border-brand-100">You / Service</td>
          </tr>
          <tr>
            <td className="p-2 border border-brand-100">Technical</td>
            <td className="p-2 border border-brand-100">IP address, device type, browser, referrer</td>
            <td className="p-2 border border-brand-100">Automatically</td>
          </tr>
          <tr>
            <td className="p-2 border border-brand-100">Analytics</td>
            <td className="p-2 border border-brand-100">Aggregated page views, search terms</td>
            <td className="p-2 border border-brand-100">Automatically (cookie consent required in EU/UK)</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>We do not knowingly collect special-category data</strong> (such as detailed
        health conditions). Please do not submit such information via the Service.
      </p>

      <h2>3. How and why we use your data (GDPR lawful bases)</h2>
      <ul>
        <li><strong>To provide the Service</strong> — account management, access control, saving your favorites. <em>Basis: contract.</em></li>
        <li><strong>To process payments and deliver purchases</strong> — sending magic unlock links after Shopify orders. <em>Basis: contract.</em></li>
        <li><strong>To communicate with you</strong> — responding to support requests; transactional emails. <em>Basis: contract / legitimate interest.</em></li>
        <li><strong>To improve the Service</strong> — analytics on how features are used. <em>Basis: legitimate interest / consent (for non-essential cookies).</em></li>
        <li><strong>To comply with law</strong> — tax records, responding to lawful requests. <em>Basis: legal obligation.</em></li>
        <li><strong>Marketing emails</strong> — only if you opt in; you can withdraw consent any time. <em>Basis: consent.</em></li>
      </ul>

      <h2>4. Cookies and similar technologies</h2>
      <p>We use:</p>
      <ul>
        <li><strong>Essential cookies</strong> (e.g. <code>rem_tier</code>, session tokens) — required for sign-in and paid access. These cannot be disabled.</li>
        <li><strong>Functional cookies</strong> — remember preferences such as theme or last region filter.</li>
        <li><strong>Analytics cookies</strong> — aggregated usage data. In the EU/UK, these are loaded only after you consent via our cookie banner.</li>
      </ul>
      <p>You can change cookie preferences at any time via the "Cookie settings" link in the footer.</p>

      <h2>5. Who we share data with (processors)</h2>
      <p>We use a minimal set of trusted third-party processors, each bound by a Data Processing Agreement:</p>
      <ul>
        <li><strong>Shopify</strong> — payments and order processing. <em>(Ireland / US; SCCs)</em></li>
        <li><strong>Vercel</strong> — site hosting. <em>(US; SCCs)</em></li>
        <li><strong>Supabase</strong> — user accounts and favorites database. <em>(EU or US region; SCCs for US)</em></li>
        <li><strong>Resend</strong> — transactional email delivery. <em>(US; SCCs)</em></li>
      </ul>
      <p>
        We do not sell your personal data. We do not share it with advertisers. We may disclose
        data if required by law, to enforce our Terms, or to protect our rights or those of
        others.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Some of our processors are located outside the UK / EEA (primarily the United States).
        Where we transfer personal data internationally, we rely on the European Commission's
        Standard Contractual Clauses ("SCCs") and equivalent UK IDTA, plus supplementary
        safeguards as required under the Schrems II ruling.
      </p>

      <h2>7. Data retention</h2>
      <ul>
        <li><strong>Account data:</strong> retained until you delete your account.</li>
        <li><strong>Transaction records:</strong> retained for 7 years (tax / audit obligations).</li>
        <li><strong>Analytics data:</strong> retained in aggregated form for up to 26 months.</li>
        <li><strong>Support emails:</strong> retained for up to 2 years after the last contact.</li>
      </ul>

      <h2>8. Your rights (UK / EU GDPR)</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access</strong> a copy of personal data we hold about you</li>
        <li><strong>Rectification</strong> of inaccurate data</li>
        <li><strong>Erasure</strong> ("right to be forgotten"), subject to legal retention</li>
        <li><strong>Restriction</strong> or <strong>objection</strong> to processing</li>
        <li><strong>Data portability</strong> (machine-readable export)</li>
        <li><strong>Withdraw consent</strong> where processing is based on consent</li>
        <li><strong>Lodge a complaint</strong> with your supervisory authority (in the UK, the Information Commissioner's Office — <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>)</li>
      </ul>
      <p>
        To exercise any right, email{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. We will respond within
        30 days.
      </p>

      <h2>9. California residents (CCPA / CPRA)</h2>
      <p>
        If you are a California resident, you additionally have the right to know the categories
        of personal information collected, the right to delete, the right to correct, the right
        to limit use of sensitive personal information, and the right to opt out of "sharing" for
        cross-context behavioral advertising. <strong>We do not sell your personal information
        and we do not share it for cross-context behavioral advertising.</strong>
      </p>
      <p>
        To exercise California rights, email{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> with "California Privacy
        Request" in the subject. We may verify your identity before responding.
      </p>

      <h2>10. Security</h2>
      <p>
        We implement industry-standard technical and organizational measures — encryption in
        transit (TLS), encryption at rest for the database, access controls, and magic-link
        passwordless authentication. No system is perfectly secure; if you suspect unauthorized
        access to your account, contact us immediately.
      </p>

      <h2>11. Children</h2>
      <p>
        The Service is not directed to children under 16 (or the equivalent minimum age in your
        jurisdiction). We do not knowingly collect data from children. If you believe we have
        collected data from a child, contact us and we will delete it.
      </p>

      <h2>12. Changes to this Privacy Policy</h2>
      <p>
        We will update this Policy as needed. The "Last updated" date reflects the latest
        revision. Material changes will be communicated by email or a prominent notice on the
        Service.
      </p>

      <h2>13. Contact us</h2>
      <p>
        {LEGAL.legalEntity}<br />
        {LEGAL.mailingAddress}<br />
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
      </p>
    </LegalLayout>
  );
}
