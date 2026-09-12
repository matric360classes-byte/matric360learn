import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  const { data: queued } = await supabase.from("lesson_previews").select("*").eq("status","queued").limit(5); // process 5 per click to avoid timeout
  if(!queued?.length) return NextResponse.json({processed:0, remaining:0});

  let processed=0; let lastError="";
  for(const p of queued){
    await supabase.from("lesson_previews").update({status:"processing"}).eq("id", p.id);
    const prompt = `CAPS Grade ${p.grade} ${p.subject} Topic ${p.topic_name} Code ${p.caps_code}. Return ONLY JSON. {"node_a":"350-450 words explanation for ${p.topic_name}","node_b":"Example 1 Q steps Answer, Example 2, Example 3, Example 4, Example 5, Example 6 - minimum 5 max 10","node_c":"Q1 with memo, Q2 with memo, Q3, Q4, Q5, Q6, Q7, Q8 - minimum 5 max 10","node_d":"Mistake 1 wrong vs correct, Mistake 2, Mistake 3, Mistake 4, Mistake 5, Mistake 6 - minimum 5","node_e":"Tip 1 exam strategy, Tip 2, Tip 3, Tip 4, Tip 5, Tip 6 - minimum 5 max 10","quality_score":88}`;
    try{
      const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
      const gemJson = await gemRes.json();
      if(gemJson.error) throw new Error(JSON.stringify(gemJson.error));
      const text = gemJson.candidates?.[0]?.content?.parts?.[0]?.text||"";
      const s=text.indexOf("{"); const e=text.lastIndexOf("}");
      const parsed = JSON.parse(text.substring(s,e+1));
      await supabase.from("lesson_previews").update({content:parsed, quality_score:88, status:"ready_for_publish"}).eq("id", p.id);
      processed++;
    }catch(e:any){ lastError=e.message; await supabase.from("lesson_previews").update({status:"failed"}).eq("id", p.id); }
    await new Promise(r=>setTimeout(r,4000));
  }
  const { count } = await supabase.from("lesson_previews").select("*",{count:"exact", head:true}).eq("status","queued");
  return NextResponse.json({processed, remaining: count||0, lastError});
}
