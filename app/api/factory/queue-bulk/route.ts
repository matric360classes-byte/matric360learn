import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(req: Request){
  const { topics } = await req.json();
  let queued = 0;
  for(const t of topics){
    const { error } = await supabase.from("lesson_previews")
      .update({ status: "queued" })
      .eq("caps_code", t.caps_code);
    if(!error) queued++;
  }
  return NextResponse.json({ queued });
}
