import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVER key bypasses RLS
);

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const { youtube_id, youtube_url, subject, topic, caps_code, caps_topic_id, title, thumbnail_url } = body;

    if(!youtube_id || !caps_code) return NextResponse.json({error:"Missing youtube_id or caps_code"}, {status:400});

    // 1. Insert into videos
    const { error: vError } = await supabase.from("videos").insert([{
      youtube_id, youtube_url, subject, topic, caps_code, caps_topic_id, title, thumbnail_url
    }]);

    if(vError) return NextResponse.json({error: vError.message}, {status:400});

    // 2. Update BOTH tables so learner Nodes show HD immediately
    await supabase.from("caps_knowledge_base").update({ youtube_id } as any).eq("caps_code", caps_code);
    await supabase.from("topics").update({ youtube_id } as any).eq("caps_code", caps_code);

    return NextResponse.json({ok:true});
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status:500});
  }
}
