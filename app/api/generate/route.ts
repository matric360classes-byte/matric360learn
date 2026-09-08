// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest){
  try{
    const { caps_code } = await req.json();
    if(!caps_code) return NextResponse.json({error:"caps_code required"}, {status:400});

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // 1. Get CAPS knowledge
    const { data: kb } = await supabase.from('topic_knowledge').select('*').eq('caps_code', caps_code).single();
    if(!kb) return NextResponse.json({error:"KB not found for "+caps_code}, {status:404});

    // 2. Call Gemini
    const prompt = `You are a South African CAPS expert teacher. Generate a lesson JSON for ${kb.subject} - ${kb.topic_name} (${kb.caps_code}).
    Node: ${kb.node_label} - ${kb.paper_section}
    Description: ${kb.description}

    Return ONLY valid JSON with structure:
    {
      "title": "",
      "objectives": [""],
      "nodes": {
        "A_Foundation": {"explain": "", "example": ""},
        "B_Intermediate": {"explain": "", "example": ""},
        "C_Advanced": {"explain": ""},
        "D_Exam": {"explain": "", "tips": ""},
        "E_Mistakes": {"list": [""]}
      },
      "questions": [{"q": "", "a": "", "level": 1}]
    }`;

    const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
    });
    const gemData = await gemRes.json();
    let text = gemData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // clean markdown
    text = text.replace(/```json|```/g,"").trim();
    const lesson = JSON.parse(text);

    // 3. Save to lesson_previews
    const { data, error } = await supabase.from('lesson_previews').insert({
      caps_code,
      subject: kb.subject,
      topic_name: kb.topic_name,
      content: lesson,
      status: 'pending',
      cost_usd: 0.0475
    }).select().single();

    if(error) throw error;

    return NextResponse.json({success:true, preview: data});
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status:500});
  }
}
