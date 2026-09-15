import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const filled = data?.filter((d: any) => d.content && JSON.stringify(d.content).length > 100).length || 0;
  return NextResponse.json({
    filled,
    remaining: (data?.length || 0) - filled,
    total: data?.length || 0,
    route: "batch-generate-v1-2.0-flash"
  });
}

export async function POST() {
  const { data: all } = await supabase.from("lesson_nodes").select("*").limit(1000);
  const empty = all?.filter((p: any) =>!p.content || JSON.stringify(p.content).length < 100).slice(0, 2) || [];

  if (!empty.length) {
    return NextResponse.json({ done: true, generated: 0, remaining: 0 });
  }

  let gen = 0;
  let lastError = "none";

  for (const p of empty) {
    const prompt = `You are Matric360 SA CAPS expert. Topic: ${p.title} | Node: ${p.node_label}.
Write 500+ words comprehensive lesson.
Include 5 KaTeX formulas like $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ and $$E=mc^2$$
Include 5 worked examples.
If Node E, include table: | Related Topic | How Used | Example | with 5 rows.
Return ONLY valid JSON: {"body_markdown":"...full content...","formulas":["$formula1$","$formula2$"]}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 8000 }
          })
        }
      );

      const j = await res.json();

      if (!j.candidates) {
        lastError = JSON.stringify(j).slice(0, 300);
        continue;
      }

      let txt = j.candidates[0].content.parts[0].text
       .replace(/```json/g, "")
       .replace(/```/g, "")
       .trim();

      const parsed = JSON.parse(txt);

      await supabase
       .from("lesson_nodes")
       .update({ content: parsed, status: "generated" })
       .eq("id", p.id);

      gen++;
    } catch (e: any) {
      lastError = (e.message || "parse error").slice(0, 300);
    }
  }

  const { data: check } = await supabase.from("lesson_nodes").select("content").limit(1000);
  const remaining = check?.filter((d: any) =>!d.content || JSON.stringify(d.content).length < 100).length || 0;

  return NextResponse.json({
    done: remaining === 0,
    generated: gen,
    remaining,
    lastError,
    model: "v1/gemini-2.0-flash"
  });
}
