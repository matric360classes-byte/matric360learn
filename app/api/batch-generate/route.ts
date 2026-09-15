import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function cleanJson(txt: string){
  // Remove ```json blocks
  let t = txt.replace(/```json|```/g,"").trim();
  // Try direct parse
  try{ return JSON.parse(t); }catch{}
  // Try extract body_markdown value with regex
  try{
    const m = t.match(/"body_markdown"\s*:\s*"(.*)"\s*}\s*$/s);
    if(m){
      let content = m[1].replace(/\\n/g,"\n").replace(/\\"/g,'"');
      return { body_markdown: content };
    }
  }catch{}
  // Fallback: use whole output as markdown (save it anyway)
  return { body_markdown: t };
}

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any)=>!p.content || JSON.stringify(p.content).length<100).slice(0,3) || [];
  if(!empty.length) return NextResponse.json({ generated:0, remaining:0, lastError:"ALL DONE!" });

  let gen=0; let lastError="";
  const model = "v1beta/models/gemini-3.6-flash";

  for(const p of empty){
    try{
      const prompt = `You are Matric360 SA CAPS teacher. Topic: ${p.title} - ${p.node_label}. Write detailed 700 word lesson with headings, examples, exam tips. Return ONLY valid JSON, escape newlines as \\n, no raw line breaks inside string: {"body_markdown":"# ${p.title}\\n\\nYour lesson here..."}`;
      const r = await fetch(`https://generativelanguage.googleapis.com/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:8000, temperature:0.7} })
      });
      const j:any = await r.json();
      if(!j.candidates){ lastError=`${model} => ${JSON.stringify(j).slice(0,500)}`; continue; }
      let txt = j.candidates[0].content.parts[0].text;
      const parsed = cleanJson(txt);
      if(!parsed.body_markdown || parsed.body_markdown.length<50){ lastError=`Empty parse: ${txt.slice(0,300)}`; continue; }
      await supabase.from("lesson_nodes").update({ content: parsed, status:"generated" }).eq("id", p.id);
      gen++; lastError=`SUCCESS with ${model}`;
    }catch(e:any){ lastError = `Parse err: ${e.message}`; }
  }
  const { data: chk } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const rem = chk?.filter((d:any)=>!d.content || JSON.stringify(d.content).length<100).length||0;
  return NextResponse.json({ generated:gen, remaining:rem, lastError });
}
