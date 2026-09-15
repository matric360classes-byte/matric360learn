import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);

  // SORT BY SHORTEST CONTENT FIRST - so it auto-finds the empty ones
  const sorted = [...(all||[])].sort((a:any,b:any)=>{
    const la = a.content?.body_markdown?.length || 0;
    const lb = b.content?.body_markdown?.length || 0;
    return la - lb;
  });

  const empty = sorted.slice(0,2);
  const remainingBefore = sorted.filter((x:any)=> (x.content?.body_markdown?.length||0) < 1000).length;

  if(remainingBefore === 0) return NextResponse.json({ generated:0, remaining:0, lastError:"ALL 135 ARE FULL NOW!" });

  let gen=0; let lastError="";
  const model = "v1beta/models/gemini-3.6-flash";

  for(const p of empty){
    try{
      const prompt = `Write 700-word SA CAPS Matric lesson for: ${p.title} - ${p.node_label}. Plain markdown only, no JSON.`;
      const r = await fetch(`https://generativelanguage.googleapis.com/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:8000} })
      });
      const j:any = await r.json();
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if(text.length < 300){ lastError = `Too short: ${text.slice(0,100)}`; continue; }
      await supabase.from("lesson_nodes").update({ content: { body_markdown: text }, status:"generated" }).eq("id", p.id);
      gen++; lastError = `SAVED ${text.length} chars - ${p.title}`;
    }catch(e:any){ lastError = e.message; }
  }
  return NextResponse.json({ generated:gen, remaining: remainingBefore - gen, lastError });
}
