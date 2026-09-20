import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest){
  const body = await req.json();
  const { youtube_id, youtube_url, subject, topic, caps_code, title, thumbnail_url } = body;
  if(!youtube_id ||!caps_code) return NextResponse.json({error:"Missing data"}, {status:400});

  // 1. This is what makes it show under Nodes A-E
  await supabaseAdmin.from("caps_knowledge_base").update({ youtube_id } as any).eq("caps_code", caps_code);
  await supabaseAdmin.from("topics").update({ youtube_id, youtube_url, title, subject, thumbnail_url } as any).eq("caps_code", caps_code);

  // 2. Optional: save to videos if table exists
  try{ await supabaseAdmin.from("videos").insert([{ youtube_id, youtube_url, subject, caps_code, title, thumbnail_url }]); }catch{}

  return NextResponse.json({ok:true});
}
