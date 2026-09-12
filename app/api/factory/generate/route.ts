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

    const prompt = `
You are CAPS Grade ${preview.grade} ${preview.subject} expert. Topic: ${preview.topic_name} (${preview.caps_code}).

Return ONLY valid JSON, no markdown, no backticks. Must follow counts:

{
  "node_a": "Concept explanation 350-450 words, CAPS aligned, definitions, formulas, why it matters. 350-450 words for ${preview.topic_name}",
  "node_b": "5 to 7 worked examples. Format Example 1: Q + Full steps + Answer up to Example 6. Minimum 5 examples for ${preview.topic_name}",
  "node_c": "8 practice questions. Q1 to Q8, then MEMO A1 to A8 with full solutions. Minimum 5, max 10",
  "node_d": "6 common mistakes. Mistake 1: what learners do wrong + correct way up to Mistake 6. Minimum 5",
  "node_e": "6 exam tips. Tip 1 to Tip 6 with time management, marks, keywords examiners look for. Minimum 5 max 10",
  "quality_score": 88
}
IMPORTANT: Each node must have at LEAST 5 items. Node B 5-7 examples, Node C 5-10 Q, Node D 5-10 mistakes, Node E 5-10 tips. Node A 350-450 words.
`;

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
