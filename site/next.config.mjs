import createNextIntlPlugin from "next-intl/plugin";

// Wires next-intl's server-side request config (see site/i18n/request.ts).
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverComponentsExternalPackages: ["gray-matter"] }
};
export default withNextIntl(nextConfig);
