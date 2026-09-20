import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest){
  const b = await req.json();
  const { youtube_id, youtube_url, caps_code, subject, title, thumbnail_url } = b;
  if(!youtube_id || !caps_code) return NextResponse.json({error:"Missing data"}, {status:400});

  await admin.from("videos").insert([{ youtube_id, youtube_url, caps_code, subject, title, thumbnail_url }]);
  await admin.from("caps_knowledge_base").update({ youtube_id, youtube_url, thumbnail_url } as any).eq("caps_code", caps_code);

  return NextResponse.json({ok:true});
}
