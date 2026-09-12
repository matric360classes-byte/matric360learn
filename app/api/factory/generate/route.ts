import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ADD THIS — fixes 404 in browser
export async function GET(){
  const { data } = await supabase.from("lesson_previews").select("id, caps_code, topic_name, status, created_at").eq("status","queued").order("created_at", {ascending:false}).limit(10);
  return NextResponse.json({queued: data, count: data?.length||0, message: "POST with {id} to generate this row"});
}

export async function POST(req: NextRequest){
  try{
    const { id } = await req.json();
    if(!id) return NextResponse.json({error:"id required"}, {status:400});

    const { data: preview } = await supabase.from("lesson_previews").select("*").eq("id", id).single();
    if(!preview) return NextResponse.json({error:"not found"}, {status:404});

    await supabase.from("lesson_previews").update({status:"processing"}).eq("id", id);

    const prompt = `You are CAPS expert for ${preview.subject} - ${preview.topic_name} Grade ${preview.grade} ${preview.caps_code}. Generate JSON with 5 nodes: A: Concept explanation (CAPS aligned, 300 words) B: Worked examples (2 examples) C: Practice questions (5 questions) D: Common mistakes E: Exam tips Return ONLY valid JSON: { "node_a": "...", "node_b": "...", "node_c": "...", "node_d": "...", "node_e": "...", "quality_score": 85 } Topic: ${preview.topic_name} ${preview.caps_code}`;

    const gemRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key="+process.env.GEMINI_API_KEY,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
    });
    const gemJson = await gemRes.json();
    const text = gemJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed:any = {};
    try{
      const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}")+1);
      parsed = JSON.parse(jsonStr);
    }catch{
      parsed = {node_a:text, node_b:"", node_c:"", node_d:"", node_e:"", quality_score:75};
    }

    const { data, error } = await supabase.from("lesson_previews").update({
      content: parsed,
      quality_score: parsed.quality_score||80,
      status: parsed.quality_score>=80? "ready_for_publish" : "in_review",
      cost_usd: 0.0475
    }).eq("id", id).select().single();

    if(error) throw error;
    return NextResponse.json({success:true, data});

  }catch(e:any){
    return NextResponse.json({error:e.message}, {status:500});
  }
}
