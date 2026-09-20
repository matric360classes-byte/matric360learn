import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(){
  const { data } = await admin.from("videos").select("*").order("order_index",{ascending:true}).order("created_at",{ascending:false}).limit(200);
  return NextResponse.json(data||[]);
}

export async function POST(req: NextRequest){
  const b = await req.json();
  const { youtube_id, youtube_url, caps_topic_id, caps_code, subject, title, thumbnail_url, order, status, is_premium } = b;
  if(!youtube_id ||!caps_topic_id) return NextResponse.json({error:"Missing youtube_id or caps_topic_id"}, {status:400});

  const thumb = thumbnail_url || `https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`;

  // Check if video already exists for this topic - no unique constraint needed
  const { data: existing } = await admin.from("videos").select("id").eq("caps_topic_id", caps_topic_id).maybeSingle();

  if (existing) {
    await admin.from("videos").update({
      youtube_id,
      youtube_url,
      caps_code,
      subject,
      title,
      thumbnail_url: thumb,
      order_index: order||0,
      status: status||"Ready",
      is_premium: is_premium??true
    }).eq("id", existing.id);
  } else {
    await admin.from("videos").insert([{
      youtube_id,
      youtube_url,
      caps_topic_id,
      caps_code,
      subject,
      title,
      thumbnail_url: thumb,
      order_index: order||0,
      status: status||"Ready",
      is_premium: is_premium??true
    }]);
  }

  // This makes it pop in Student Nodes
  await admin.from("caps_knowledge_base").update({
    youtube_id,
    thumbnail_url: thumb,
    is_premium: is_premium??true
  } as any).eq("id", caps_topic_id);

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
