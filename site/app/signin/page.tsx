"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const t = useTranslations("pages.signin");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, redirect: false });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="rounded-2xl bg-white border border-brand-200 p-8">
        <Mail className="w-8 h-8 text-brand-600" />
        <h1 className="font-serif text-3xl text-brand-800 mt-3">{t("title")}</h1>
        <p className="text-neutral-600 text-sm mt-1">
          {t("body")}
        </p>

        {sent ? (
          <div className="mt-6 rounded-lg bg-brand-50 border border-brand-200 p-4 text-sm text-brand-800">
            {t.rich("sentMessage", { email, strong: (chunks) => <strong>{chunks}</strong> })}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-2.5 rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500"
            />
            <button
              disabled={loading}
              className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? t("sending") : t("cta")}
            </button>
          </form>
        )}

        <p className="text-xs text-neutral-500 mt-4">
          {t("syncNote")}
        </p>
      </div>
    </div>
  );
}
