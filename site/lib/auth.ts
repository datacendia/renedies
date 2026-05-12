import { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";

/**
 * Passwordless email (magic link) sign-in.
 *
 * Required env:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (adapter + favorites)
 *   EMAIL_SERVER_*                           (SMTP)
 *   NEXTAUTH_SECRET                          (random 32-byte string)
 *   NEXTAUTH_URL                             (prod URL; auto in Vercel)
 *
 * Supabase setup: https://authjs.dev/reference/adapter/supabase
 */
const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const hasEmailServer = !!process.env.EMAIL_SERVER_HOST;

// EmailProvider requires an adapter. Only enable both when env is fully configured.
const emailProviderEnabled = hasSupabase && hasEmailServer;

export const authOptions: NextAuthOptions = {
  providers: emailProviderEnabled
    ? [
        EmailProvider({
          server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD
            }
          },
          from: process.env.EMAIL_FROM ?? "no-reply@remedia.app"
        })
      ]
    : [],
  adapter: hasSupabase
    ? SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!
      })
    : undefined,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?check=email"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as unknown as { id: string }).id = token.sub;
      }
      return session;
    }
  }
};
