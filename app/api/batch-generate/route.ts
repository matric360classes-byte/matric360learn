import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any)=>!p.content || JSON.stringify(p.content).length<100).slice(0,2) || [];
  if(!empty.length) return NextResponse.json({ done:true, generated:0, remaining:0 });
  let gen=0; let lastError="none";
  for(const p of empty){
    const prompt = `SA CAPS Matric. Topic ${p.title} Node ${p.node_label}. 500 words, 5 KaTeX $x$ $$y$$, 5 examples, Node E table. JSON ONLY {"body_markdown":"...long..."}`;
    try{
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{temperature:0.4,maxOutputTokens:8000} })
      });
      const j = await r.json();
      if(!j.candidates){ lastError=JSON.stringify(j).slice(0,200); continue; }
      const txt = j.candidates[0].content.parts[0].text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      await supabase.from("lesson_nodes").update({ content: parsed, status:"generated" }).eq("id", p.id);
      gen++;
    }catch(e:any){ lastError=e.message; }
  }
  const { data: chk } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const rem = chk?.filter((d:any)=>!d.content || JSON.stringify(d.content).length<100).length||0;
  return NextResponse.json({ generated:gen, remaining:rem, lastError });
}
