import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function GET(){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const geminiKey = process.env.GEMINI_API_KEY!;
  const { data: queued } = await supabase.from("lesson_previews").select("*").eq("status","queued").limit(5);
  if(!queued?.length) return NextResponse.json({msg:"no queued left", done:0});
  let done=0;
  for(const t of queued){
    const prompt = `Create full CAPS lesson for Grade ${t.grade} ${t.subject}: ${t.topic_name} (${t.caps_code}) with summary, key points, quiz.`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "Lesson";
    await supabase.from("lesson_previews").update({status:"ready", content:{nodes:text}, cost_usd:0}).eq("id", t.id);
    await supabase.from("lessons").upsert({caps_code:t.caps_code, subject:t.subject, grade:t.grade, topic_name:t.topic_name, content:text, status:"ready"},{onConflict:"caps_code"});
    done++;
  }
  return NextResponse.json({done, remaining: 16-done});
}
