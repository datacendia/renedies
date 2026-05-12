import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const sb = supabaseServer();
  if (!session?.user || !sb) return NextResponse.json({ favorites: [] });
  const userId = (session.user as unknown as { id: string }).id;
  const { data } = await sb.from("favorites").select("slug").eq("user_id", userId);
  return NextResponse.json({ favorites: (data ?? []).map(r => r.slug) });
}

// Slugs are kebab-case ASCII (region-prefixed). Constrain user input to that
// shape so the favorites table can't be filled with arbitrary strings.
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,127}$/;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sb = supabaseServer();
  if (!session?.user || !sb) return NextResponse.json({ ok: false, note: "Not logged in — local-only favorites used" });
  const userId = (session.user as unknown as { id: string }).id;

  let body: { slug?: unknown; action?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const slug = typeof body.slug === "string" ? body.slug : "";
  const action = body.action === "remove" ? "remove" : "add";
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (action === "remove") {
    await sb.from("favorites").delete().match({ user_id: userId, slug });
  } else {
    await sb.from("favorites").upsert({ user_id: userId, slug });
  }
  return NextResponse.json({ ok: true });
}
