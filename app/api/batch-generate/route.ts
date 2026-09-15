import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  // FORCE - take first 2 regardless of content
  const empty = all?.slice(0,2) || [];

  if(!empty.length) return NextResponse.json({ generated:0, remaining:0, lastError:"DONE" });

  let gen=0; let lastError="";
  const model = "v1beta/models/gemini-3.6-flash";

  for(const p of empty){
    try{
      const prompt = `Write detailed 700-word SA CAPS Matric lesson for: ${p.title} - ${p.node_label}. Include definitions, examples, exam tips. Plain markdown only. No JSON.`;
      const r = await fetch(`https://generativelanguage.googleapis.com/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:8000} })
      });
      const j:any = await r.json();
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if(text.length < 200){ lastError = `Too short ${text.length}: ${text.slice(0,300)}`; continue; }
      await supabase.from("lesson_nodes").update({ content: { body_markdown: text }, status:"generated" }).eq("id", p.id);
      gen++; lastError = `SAVED ${text.length} chars - ${p.title}`;
    }catch(e:any){ lastError = e.message; }
  }
  const { data: chk } = await supabase.from("lesson_nodes").select("id").limit(1000);
  return NextResponse.json({ generated:gen, remaining: chk? chk.length - gen : 0, lastError });
}
