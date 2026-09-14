import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(){
  const { data } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const filled = data?.filter((d:any)=>d.content && JSON.stringify(d.content).length>100).length||0;
  return NextResponse.json({ filled, remaining: (data?.length||0)-filled, total: data?.length||0, route: "batch-generate" });
}

export async function POST(req: Request){
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit")||"2");

  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p:any)=>!p.content || JSON.stringify(p.content).length<100).slice(0,limit) || [];
  if(!empty.length) return NextResponse.json({ done:true, generated:0, remaining:0 });

  let gen=0; let lastError="none";
  for(const p of empty){
    const prompt = `SA CAPS Matric360. Node ${p.node_label} Title ${p.title}. 400+ words, 5 KaTeX formulas like $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ and $$E=mc^2$$, 5 worked examples. For Node E table: | Related Topic | How Used | Example | 5 rows. Return JSON ONLY: {"body_markdown":"...","formulas":["$...$"]}`;
    try{
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature:0.4, maxOutputTokens:8000 } })
      });
      const j = await res.json();
      if(!j.candidates){ lastError = JSON.stringify(j).slice(0,300); continue; }
      let txt = j.candidates[0].content.parts[0].text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      await supabase.from("lesson_nodes").update({ content: parsed, status: "generated" }).eq("id", p.id);
      gen++;
    }catch(e:any){ lastError = e.message?.slice(0,300) || "parse error"; }
  }
  const { data: check } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const remaining = check?.filter((d:any)=>!d.content || JSON.stringify(d.content).length<100).length||0;
  return NextResponse.json({ done:remaining===0, generated:gen, remaining, lastError, model:"flash" });
}
