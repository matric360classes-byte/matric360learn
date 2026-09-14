import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(){
  const { data } = await supabase.from("lesson_parts").select("content_json").limit(1000);
  const filled = data?.filter(d => JSON.stringify(d.content_json||{}).length > 100).length || 0;
  return NextResponse.json({ filled, remaining: 675 - filled, total: 675 });
}

export async function POST(req: NextRequest){
  // FIX: Get all and filter for empty in JS (Supabase OR query fails on {} )
  const { data: all } = await supabase.from("lesson_parts").select("*, lesson_nodes!inner(title, subject)").limit(1000);
  const empty = all?.filter((p:any) =>!p.content_json || JSON.stringify(p.content_json).length < 100).slice(0,5) || [];

  if(!empty.length){
    return NextResponse.json({ done: true, generated: 0, remaining: 0, message: "ALL 675 DONE!" });
  }

  const SYSTEM = `Matric360 examiner. Mind the Gap for B, Past Papers for A/C/E, Chief Marker for D. 400+ words, 5 KaTeX $x=\\frac{-b}{2a}$ $$E=mc^2$$, 5 examples. Node E table | Related Topic | How Used | Example | with 5 rows. JSON ONLY: {"body_markdown":"...400+ words...","formulas":["$...$"],"traps":["..."]}`;

  let gen = 0;
  for(const p of empty){
    const t = (p as any).lesson_nodes.title;
    const s = (p as any).lesson_nodes.subject;
    const k = (p as any).node_key;
    const prompt = `${SYSTEM} Topic:${t} Subject:${s} Node:${k}-${p.title}`;

    try{
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 8000 } })
      });
      const data = await res.json();
      let txt = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json|```/g,"").trim() || "";
      if(!txt || txt.length < 100) continue;
      const json = JSON.parse(txt);
      await supabase.from("lesson_parts").update({ content_json: json }).eq("id", p.id);
      gen++;
    }catch(e){ console.log("fail", e) }
  }

  const { data: check } = await supabase.from("lesson_parts").select("content_json").limit(1000);
  const remaining = check?.filter((d:any)=>!d.content_json || JSON.stringify(d.content_json).length < 100).length || 0;

  return NextResponse.json({ done: remaining===0, generated: gen, remaining: remaining });
}
