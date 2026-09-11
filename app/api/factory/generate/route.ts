import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be SERVICE ROLE not anon
);

export async function POST(req: NextRequest){
  const { id } = await req.json(); // id of lesson_previews row
  if(!id) return NextResponse.json({error:"id required"}, {status:400});

  // 1. Get queued row
  const { data: preview } = await supabase.from("lesson_previews").select("*").eq("id", id).single();
  if(!preview) return NextResponse.json({error:"not found"}, {status:404});

  // 2. Mark processing
  await supabase.from("lesson_previews").update({status:"processing"}).eq("id", id);

  // 3. Call Gemini 2.5 Pro via Matric360 Gateway
  const prompt = `
You are CAPS expert for ${preview.subject} - ${preview.topic_name} Grade ${preview.grade} ${preview.caps_code}.
Generate JSON with 5 nodes:
A: Concept explanation (CAPS aligned, 300 words)
B: Worked examples (2 examples)
C: Practice questions (5 questions)
D: Common mistakes
E: Exam tips
Return ONLY valid JSON: { "node_a": "...", "node_b": "...", "node_c": "...", "node_d": "...", "node_e": "...", "quality_score": 85 }
Topic: ${preview.topic_name} ${preview.caps_code}
`;

  const gemRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key="+process.env.GEMINI_API_KEY,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
  });
  const gemJson = await gemRes.json();
  const text = gemJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Try parse JSON from Gemini
  let parsed:any = {};
  try{
    const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}")+1);
    parsed = JSON.parse(jsonStr);
  }catch{ parsed = {node_a:text, node_b:"", node_c:"", node_d:"", node_e:"", quality_score:75}; }

  // 4. Save back
  const { data, error } = await supabase.from("lesson_previews").update({
    content: parsed,
    quality_score: parsed.quality_score||80,
    status: parsed.quality_score>=80? "ready_for_publish" : "in_review",
    cost_usd: 0.0475
  }).eq("id", id).select().single();

  return NextResponse.json({success:true, data, raw:text});
}
