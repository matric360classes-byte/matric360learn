import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  // AUTO-DISCOVER correct model for your AQ. key
  let workingModel = "";
  let listLog = "";
  try{
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const j:any = await r.json();
    listLog = JSON.stringify(j).slice(0,800);
    // Find first model that supports generateContent
    const m = j.models?.find((x:any)=>x.supportedGenerationMethods?.includes("generateContent"));
    if(m) workingModel = m.name; // e.g. "models/gemini-2.5-flash"
  }catch(e:any){ listLog = e.message; }

  if(!workingModel){
    return NextResponse.json({ generated:0, remaining:135, lastError: `NO MODEL FOUND. List says: ${listLog}. Did you click ENABLE on that Google Cloud link I sent?` });
  }

  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any)=>!p.content || JSON.stringify(p.content).length<100).slice(0,1) || [];
  if(!empty.length) return NextResponse.json({ generated:0, remaining:0, lastError: `Found working model: ${workingModel}` });

  let gen=0; let lastError=`Using ${workingModel} | List: ${listLog}`;
  for(const p of empty){
    try{
      const prompt = `SA CAPS Matric. Title:${p.title} Node:${p.node_label}. Write 600 words lesson JSON {"body_markdown":"...markdown..."}`;
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/${workingModel}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:7000, temperature:0.7} })
      });
      const j = await r.json();
      if(!j.candidates) { lastError = `${workingModel} => ${JSON.stringify(j).slice(0,500)}`; continue; }
      let txt = j.candidates[0].content.parts[0].text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      await supabase.from("lesson_nodes").update({ content: parsed, status:"generated" }).eq("id", p.id);
      gen++; lastError = `SUCCESS with ${workingModel}`;
    }catch(e:any){ lastError = e.message + " | " + listLog; }
  }
  const { data: chk } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const rem = chk?.filter((d:any)=>!d.content || JSON.stringify(d.content).length<100).length||0;
  return NextResponse.json({ generated:gen, remaining:rem, lastError });
}
