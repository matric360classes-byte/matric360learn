import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(){
  const { data } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const filled = data?.filter((d:any) => d.content && JSON.stringify(d.content).length > 100).length || 0;
  const total = data?.length || 0;
  return NextResponse.json({ filled, remaining: total-filled, total, table: "lesson_nodes" });
}

export async function POST(){
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any) =>!p.content || JSON.stringify(p.content).length < 100).slice(0,5) || [];
  if(!empty.length) return NextResponse.json({ done: true, generated: 0, remaining: 0 });

  const SYSTEM = `Matric360 examiner. Mind the Gap for B, Past Papers for A/C/E, Chief Marker for D. 400+ words, 5 KaTeX $x=\\frac{-b}{2a}$ $$E=mc^2$$, 5 examples. Node E table | Related Topic | How Used | Example | with 5 rows. JSON ONLY: {"body_markdown":"...400+ words...","formulas":["$...$"]}`;

  let gen=0;
  for(const p of empty){
    const prompt = `${SYSTEM} Node:${p.node_label} Title:${p.title} TopicID:${p.topic_id}`;
    try{
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 8000 } })
      });
      const d = await res.json();
      let txt = d.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json|```/g,"").trim() || "";
      const json = JSON.parse(txt);
      await supabase.from("lesson_nodes").update({ content: json, status: "generated" }).eq("id", p.id);
      gen++;
    }catch(e){}
  }
  const { data: check } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const remaining = check?.filter((d:any)=>!d.content || JSON.stringify(d.content).length < 100).length || 0;
  return NextResponse.json({ done: remaining===0, generated: gen, remaining });
}
