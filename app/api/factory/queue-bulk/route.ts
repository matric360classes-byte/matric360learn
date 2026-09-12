import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request){
  const { topics } = await req.json();
  let q=0;
  for(const t of topics){
    await supabase.from("lesson_previews").upsert({
      caps_code: t.caps_code,
      grade: t.grade,
      subject: t.subject || "Mathematics",
      topic_name: t.topic_name,
      status: "queued"
    },{onConflict:"caps_code"});
    q++;
  }
  return NextResponse.json({queued:q});
}
