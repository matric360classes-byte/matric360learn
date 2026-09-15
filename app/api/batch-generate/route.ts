import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request){
  const { searchParams } = new URL(req.url);
  const batchNum = parseInt(searchParams.get("batch") || "0");

  const { data: all } = await supabase.from("lesson_nodes").select("*").order("created_at", { ascending: true }).limit(1000);

  // Pick next 2 based on batch number
  const start = batchNum * 2;
  const empty = all?.slice(start, start+2) || [];

  if(start >= (all?.length||0)) return NextResponse.json({ generated:0, remaining:0, lastError:"ALL 135 DONE!" });

  let gen=0; let lastError="";
  const model = "v1beta/models/gemini-3.6-flash";

  for(const p of empty){
    try{
      const prompt = `Write 700-word SA CAPS Matric lesson for: ${p.title} - ${p.node_label}. Plain markdown only.`;
      const r = await fetch(`https://generativelanguage.googleapis.com/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:8000} })
      });
      const j:any = await r.json();
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if(text.length < 200) continue;
      await supabase.from("lesson_nodes").update({ content: { body_markdown: text }, status:"generated" }).eq("id", p.id);
      gen++; lastError = `SAVED ${text.length} chars - ${p.title}`;
    }catch(e:any){ lastError = e.message; }
  }
  const remaining = (all?.length||135) - (start + gen);
  return NextResponse.json({ generated:gen, remaining, lastError });
}
