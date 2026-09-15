import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any)=>!p.content || JSON.stringify(p.content).length<100).slice(0,1) || [];
  if(!empty.length) return NextResponse.json({ generated:0, remaining:0 });

  let gen=0; let lastError="";
  // Google said to use this for new users in your screenshot
  const model = "v1beta/models/gemini-3.6-flash";

  for(const p of empty){
    try{
      const prompt = `SA CAPS Matric lesson. Title:${p.title} Label:${p.node_label}. Write 600 word lesson in JSON format: {"body_markdown":"..."} Use headings, examples, exam tips.`;
      const r = await fetch(`https://generativelanguage.googleapis.com/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:7000, temperature:0.7} })
      });
      const j:any = await r.json();
      if(!j.candidates){ lastError = `${model} => ${JSON.stringify(j).slice(0,600)}`; continue; }
      let txt = j.candidates[0].content.parts[0].text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      await supabase.from("lesson_nodes").update({ content: parsed, status:"generated" }).eq("id", p.id);
      gen++; lastError = `SUCCESS with ${model}`;
      break; // 1 per batch
    }catch(e:any){ lastError = e.message; }
  }

  const { data: chk } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const rem = chk?.filter((d:any)=>!d.content || JSON.stringify(d.content).length<100).length||0;
  return NextResponse.json({ generated:gen, remaining:rem, lastError });
}
