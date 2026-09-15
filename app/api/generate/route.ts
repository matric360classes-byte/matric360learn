import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any)=>!p.content || JSON.stringify(p.content).length<100).slice(0,1) || [];
  if(!empty.length) return NextResponse.json({ generated:0, remaining:0 });

  let gen=0;
  let lastError="";

  // Try these 3 in order - one WILL work
  const modelsToTry = [
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
  ];

  for(const p of empty){
    const prompt = `SA CAPS Matric. ${p.title} Node ${p.node_label}. 500 words, KaTeX. JSON ONLY {"body_markdown":"...content..."}`;

    let success = false;
    for(const modelUrl of modelsToTry){
      try{
        const r = await fetch(`${modelUrl}?key=${process.env.GEMINI_API_KEY}`,{
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{temperature:0.4,maxOutputTokens:6000} })
        });
        const j = await r.json();
        if(!j.candidates){ lastError = `${modelUrl.split('/').pop()} -> ${JSON.stringify(j).slice(0,300)}`; continue; }
        let txt = j.candidates[0].content.parts[0].text.replace(/```json|```/g,"").trim();
        const parsed = JSON.parse(txt);
        await supabase.from("lesson_nodes").update({ content: parsed, status:"generated" }).eq("id", p.id);
        gen++; success=true; lastError=`OK using ${modelUrl.split('/').pop()}`; break;
      }catch(e:any){ lastError = e.message.slice(0,300); }
    }
    if(!success) break;
  }

  const { data: chk } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const rem = chk?.filter((d:any)=>!d.content || JSON.stringify(d.content).length<100).length||0;
  return NextResponse.json({ generated:gen, remaining:rem, lastError });
}
