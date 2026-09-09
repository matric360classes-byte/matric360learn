import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcmkhe.supabase.co",
  "sb_secret_UlK_LoRsi6zy2EKFfqbwTg_7KnAqq9w"
);

export async function GET() {
  const { count } = await supabase.from("topic_knowledge").select("*", { count: "exact", head: true });
  return NextResponse.json({ status: "ready", topics: count });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const { data, error } = await supabase.from("lesson_previews").insert({
    topic_id: body.topic_id,
    content: body.content || "Generated lesson"
  }).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
