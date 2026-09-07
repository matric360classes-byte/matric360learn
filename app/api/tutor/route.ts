import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  const { subject, topic, topic_content, grade, question } = await req.json();

  const prompt = `You are Matric360Learn CAPS AI Tutor for ${subject}, Grade ${grade}.
Topic: ${topic}
CAPS Content: ${topic_content}
Learner Question: ${question}

Rules: Answer in simple South African learner language, use CAPS exam style, give example, then ask a follow-up question. Keep under 150 words.`;

  // Using Groq (free) - if you have OPENAI_KEY, replace
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

  if(!apiKey){
    return NextResponse.json({ answer: `Mock Answer (add GROQ_API_KEY in Vercel): For ${topic}, ${topic_content}. Your question "${question}" - In CAPS, remember F=ma. Example: 2kg mass with 10N = 5m/s² acceleration. Can you calculate force for 3kg at 2m/s²?` });
  }

  try{
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{ "Authorization": `Bearer ${apiKey}`, "Content-Type":"application/json" },
      body: JSON.stringify({
        model:"llama-3.1-8b-instant",
        messages:[{role:"user", content: prompt}],
        max_tokens: 400
      })
    });
    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || "No answer";
    return NextResponse.json({ answer });
  }catch(e:any){
    return NextResponse.json({ answer: `Error: ${e.message}. But for ${topic}: ${topic_content}` });
  }
}
