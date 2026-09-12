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
    const prompt = `You are CAPS expert for ${p.subject} - ${p.topic_name} Grade ${p.grade} ${p.caps_code}. Return ONLY valid JSON: {"node_a":"concept 300 words","node_b":"2 worked examples","node_c":"5 questions","node_d":"common mistakes","node_e":"exam tips","quality_score":85} Topic: ${p.topic_name}`;
    try{
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
