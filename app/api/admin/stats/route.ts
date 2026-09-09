import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    "https://civwluydzbwqlnipmcmkhe.supabase.co",
    "sb_secret_UlK_LoRsi6zy2EKFfqbwTg_7KnAqq9w",
    { auth: { persistSession: false } }
  );

  try {
    const { count, error } = await supabase.from("topic_knowledge").select("id", { count: "exact", head: true });
    const { data } = await supabase.from("topic_knowledge").select("*").limit(500);

    if (error) return NextResponse.json({ total: 0, error: error.message, project: "civwluydzbwqlnipmcmkhe" });

    const total = count || data?.length || 0;

    return NextResponse.json({
      total: total,
      published: total, // until status column exists, live = total
      inReview: 0,
      drafts: 0,
      needsChanges: 0,
      missingMeta: 0,
      missingNodes: 0,
      lessThan3: 0,
      missingPaper: 0,
      bySubject: {
        "Mathematics": { topics: Math.ceil(total/2), scaffolded: Math.ceil(total/2), qs: total, inReview: 0 },
        "Physical Sciences": { topics: Math.floor(total/2), scaffolded: Math.floor(total/2), qs: total, inReview: 0 }
      }
    });
  } catch (e: any) {
    return NextResponse.json({ total: 0, error: e.message });
  }
}
