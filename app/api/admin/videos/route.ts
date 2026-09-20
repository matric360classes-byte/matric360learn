import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(){
  const { data } = await admin.from("videos").select("*").order("order_index",{ascending:true}).order("created_at",{ascending:false}).limit(200);
  return NextResponse.json(data||[]);
}

export async function POST(req: NextRequest){
  const b = await req.json();
  const { youtube_id, youtube_url, caps_topic_id, caps_code, subject, title, description, thumbnail_url, order, status, is_premium } = b;
  if(!youtube_id ||!caps_topic_id) return NextResponse.json({error:"Missing"}, {status:400});

  const row = { youtube_id, youtube_url, caps_topic_id, caps_code, subject, title, description, thumbnail_url, order_index: order||0, status: status||"Ready", is_premium: is_premium??true };
  const { error } = await admin.from("videos").upsert([row], {onConflict:'caps_topic_id'});
  if(error) return NextResponse.json({error:error.message},{status:400});

  await admin.from("caps_knowledge_base").update({ youtube_id, youtube_url, thumbnail_url, is_premium: row.is_premium } as any).eq("id", caps_topic_id);
  return NextResponse.json({ok:true});
}

export async function PATCH(req: NextRequest){
  const b = await req.json();
  const { id, caps_topic_id, is_premium, order_index } = b;
  if(id) await admin.from("videos").update({ is_premium, order_index } as any).eq("id", id);
  if(caps_topic_id) await admin.from("caps_knowledge_base").update({ is_premium } as any).eq("id", caps_topic_id);
  return NextResponse.json({ok:true});
}

export async function DELETE(req: NextRequest){
  const id = new URL(req.url).searchParams.get("id");
  if(!id) return NextResponse.json({error:"No id"}, {status:400});
  await admin.from("videos").delete().eq("id", id);
  return NextResponse.json({ok:true});
}
