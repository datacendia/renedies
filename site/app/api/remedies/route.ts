import { NextResponse } from "next/server";
import { getAllRemedies } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  const list = getAllRemedies().map(r => ({
    slug: r.slug, name: r.name, region: r.region, latin: r.latin, benefit: r.benefit
  }));
  return NextResponse.json(list);
}
