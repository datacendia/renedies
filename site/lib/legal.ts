/**
 * Legal-page configuration. Edit these values once; all pages update.
 *
 * IMPORTANT: These are templates, not legal advice. Before public launch,
 * have a lawyer in your jurisdiction review them for:
 *   - Local consumer protection laws
 *   - GDPR / CCPA specifics
 *   - FDA / MHRA / TGA health-claim rules
 *   - State-level (e.g. California Prop 65) requirements
 */

export const LEGAL = {
  brand: "Remedia",
  legalEntity: "Remedia Ltd.",             // Replace with registered business name
  domain: "remedia.example.com",            // Replace on go-live
  contactEmail: "hello@remedia.example.com",
  privacyEmail: "privacy@remedia.example.com",
  mailingAddress: "[Your business mailing address]",
  jurisdiction: "England and Wales",        // e.g. "Delaware, USA" or "Ontario, Canada"
  effectiveDate: "April 23, 2026",
  lastUpdated: "April 23, 2026"
} as const;
