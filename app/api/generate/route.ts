import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(){
  const { count: t } = await supabase.from("lesson_nodes").select("*", { count: "exact", head: true });
  const { count: n } = await supabase.from("lesson_parts").select("*", { count: "exact", head: true });
  return NextResponse.json({ topics_135: t, nodes_675: n });
}

export async function POST(req: NextRequest){
  const { data: parts } = await supabase.from("lesson_parts").select("*, lesson_nodes!inner(title, subject)").eq("content_json", "{}").limit(10);
  if(!parts?.length) return NextResponse.json({ message: "All 675 done!", done: true });

  const SYSTEM = `You are Matric360 examiner. Mind the Gap for Node B, Past Papers for A/C/E, Chief Marker's for D. 400+ words, 5 formulas KaTeX $...$ $$...$$, 5 examples/traps, Node E must have | Related Topic | How Used | Example | table with 5 related topics. Output JSON only: {"body_markdown":"...","formulas":[...],"traps":[...]}`;

  for(const part of parts){
    const prompt = `${SYSTEM} Topic:${(part as any).lesson_nodes.title} Subject:${(part as any).lesson_nodes.subject} Node:${(part as any).node_key} - ${part.title}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 8000 } })
    });
    const data = await res.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text.replace(/```json|```/g, "").trim();
    try {
      const json = JSON.parse(text);
      await supabase.from("lesson_parts").update({ content_json: json }).eq("id", part.id);
    } catch(e){ console.log("parse fail", text.slice(0,200)) }
  }
  return NextResponse.json({ generated: parts.length });
}
