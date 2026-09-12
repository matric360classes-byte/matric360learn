export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function GET(){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const key = process.env.GEMINI_API_KEY!;
  const { data } = await supabase.from("lesson_previews").select("*").neq("status","ready").limit(2);
  if(!data?.length) return NextResponse.json({msg:"no queued left - all ready!", done:0});
  let done=0;
  for(const t of data){
    const prompt = `Create FULL Grade ${t.grade} ${t.subject} lesson: ${t.topic_name} (${t.caps_code}). Include summary, detailed notes, examples, quiz. Minimum 800 words.`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if(text.length < 200) continue;
    await supabase.from("lesson_previews").update({status:"ready", content:{nodes:text}, cost_usd:0.001}).eq("id", t.id);
    done++;
  }
  return NextResponse.json({done, next: "refresh again"});
}
