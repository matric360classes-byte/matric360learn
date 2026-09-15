import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  // Only regenerate if content is empty/short
  const empty = all?.filter((p:any)=>{
    const txt = p.content?.body_markdown || "";
    return!txt || txt.length < 200;
  }).slice(0,2) || [];

  if(!empty.length) return NextResponse.json({ generated:0, remaining:0, lastError:"ALL REAL CONTENT DONE" });

  let gen=0; let lastError="";
  const model = "v1beta/models/gemini-3.6-flash";

  for(const p of empty){
    try{
      const prompt = `Write SA CAPS Matric lesson for ${p.title} - ${p.node_label}. 600 words, headings, examples. Return plain markdown only, NO JSON.`;
      const r = await fetch(`https://generativelanguage.googleapis.com/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:8000} })
      });
      const j:any = await r.json();
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if(text.length < 100){ lastError = `Short: ${text.slice(0,200)}`; continue; }
      // SAVE DIRECTLY AS MARKDOWN, no JSON parse
      await supabase.from("lesson_nodes").update({ content: { body_markdown: text }, status:"generated" }).eq("id", p.id);
      gen++; lastError = `SAVED ${text.length} chars with ${model}`;
    }catch(e:any){ lastError = e.message; }
  }
  const { data: chk } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const rem = chk?.filter((d:any)=>!(d.content?.body_markdown?.length>200)).length||0;
  return NextResponse.json({ generated:gen, remaining:rem, lastError });
}
