import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  // List models for AQ key
  let available = "";
  try{
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const j = await r.json();
    available = JSON.stringify(j).slice(0,600);
  }catch(e:any){ available = e.message; }

  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any)=>!p.content || JSON.stringify(p.content).length<100).slice(0,1) || [];
  if(!empty.length) return NextResponse.json({ generated:0, remaining:0, available });

  let gen=0; let lastError=available;
  const models = [
    "v1beta/models/gemini-2.5-flash",
    "v1beta/models/gemini-2.0-flash",
    "v1beta/models/gemini-1.5-flash"
  ];

  for(const p of empty){
    const prompt = `SA CAPS Matric ${p.title} ${p.node_label}. 500 words JSON {"body_markdown":"..."}`;
    for(const m of models){
      try{
        const r = await fetch(`https://generativelanguage.googleapis.com/${m}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
          method:"POST", headers:{"Content-Type":"application/json", "x-goog-api-key": process.env.GEMINI_API_KEY!},
          body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:6000} })
        });
        const j = await r.json();
        if(!j.candidates){ lastError=`${m} => ${JSON.stringify(j).slice(0,400)}`; continue; }
        let txt = j.candidates[0].content.parts[0].text.replace(/```json|```/g,"").trim();
        const parsed = JSON.parse(txt);
        await supabase.from("lesson_nodes").update({ content: parsed, status:"generated" }).eq("id", p.id);
        gen++; lastError=`SUCCESS ${m}`; break;
      }catch(e:any){ lastError=e.message; }
    }
  }
  const { data: chk } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const rem = chk?.filter((d:any)=>!d.content || JSON.stringify(d.content).length<100).length||0;
  return NextResponse.json({ generated:gen, remaining:rem, lastError });
}
