import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMI_API_KEY || process.env.GEMINI_KEY!;

  const { data: queued } = await supabase.from("lesson_previews").select("*").eq("status","queued").limit(5);
  if(!queued || queued.length===0) return NextResponse.json({done:0, msg:"no queued"});

  let processed = 0;
  for(const topic of queued){
    try{
      // FREE Gemini call
      const prompt = `Create a Grade ${topic.grade} ${topic.subject} lesson for ${topic.topic_name} (${topic.caps_code}). Return JSON with: title, summary, 3 key points, 5 quiz questions.`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
      });
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "Generated";

      // Save to lessons table (what student app reads)
      await supabase.from("lessons").upsert({
        caps_code: topic.caps_code,
        subject: topic.subject,
        grade: topic.grade,
        topic_name: topic.topic_name,
        content: text,
        status: "ready",
        nodes: { lesson: text } // This makes it appear in student app
      }, {onConflict:"caps_code"});

      await supabase.from("lesson_previews").update({status:"ready"}).eq("caps_code", topic.caps_code);
      processed++;
    }catch(e:any){
      await supabase.from("lesson_previews").update({status:"failed", error: String(e.message).slice(0,200)}).eq("caps_code", topic.caps_code);
    }
  }
  return NextResponse.json({done: processed});
}
