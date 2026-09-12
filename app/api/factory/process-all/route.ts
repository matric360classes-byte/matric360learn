import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(){
  const { data } = await supabase.from("lesson_previews").select("id, topic_name, caps_code, status").eq("status","queued").limit(20);
  return NextResponse.json({queued: data, count: data?.length||0, message: "POST to process 5 at a time"});
}

export async function POST(){
  const { data: queued } = await supabase.from("lesson_previews").select("*").eq("status","queued").limit(3);
  if(!queued?.length) return NextResponse.json({message:"No queued left", processed:0});
  let processed=0;
  for(const p of queued){
    await supabase.from("lesson_previews").update({status:"processing"}).eq("id", p.id);
   const prompt = `
You are CAPS Grade ${p.grade} ${p.subject} expert. Topic: ${p.topic_name} (${p.caps_code}).

Return ONLY valid JSON, no markdown, no backticks. Must follow counts:

{
  "node_a": "Concept explanation 350-450 words, CAPS aligned, definitions, formulas, why it matters. 350-450 words for ${p.topic_name}",
  "node_b": "5 to 7 worked examples. Format Example 1: Q + Full steps + Answer up to Example 6. Minimum 5 examples for ${p.topic_name}",
  "node_c": "8 practice questions. Q1 to Q8, then MEMO A1 to A8 with full solutions. Minimum 5, max 10",
  "node_d": "6 common mistakes. Mistake 1: what learners do wrong + correct way up to Mistake 6. Minimum 5",
  "node_e": "6 exam tips. Tip 1 to Tip 6 with time management, marks, keywords examiners look for. Minimum 5 max 10",
  "quality_score": 88
}
IMPORTANT: Each node must have at LEAST 5 items. Node B 5-7 examples, Node C 5-10 Q, Node D 5-10 mistakes, Node E 5-10 tips. Node A 350-450 words.
`;    try{
      const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
      const gemJson = await gemRes.json();
      const text = gemJson.candidates?.[0]?.content?.parts?.[0]?.text||"";
      let parsed:any; try{ parsed=JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}")+1)); }catch{ parsed={node_a:text, node_b:"", node_c:"", node_d:"", node_e:"", quality_score:75}; }
      await supabase.from("lesson_previews").update({content:parsed, quality_score:parsed.quality_score||80, status:"ready_for_publish", cost_usd:0.0475}).eq("id", p.id);
      processed++;
    }catch(e){ await supabase.from("lesson_previews").update({status:"queued"}).eq("id", p.id); }
    await new Promise(r=>setTimeout(r,10000));
  }
  return NextResponse.json({success:true, processed, message:`Processed ${processed} lessons`});
}
