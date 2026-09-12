import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request){
  const { topics } = await req.json();
  let queued = 0;
  for(const t of topics){
    // Parse: "Algebraic Expressions - Grade 10 - G10 | MATH-ALG-001 | 3..."
    const parts = t.split('|').map((s:string)=>s.trim());
    const nameGrade = parts[0] || t;
    const caps = parts[1] || `CAPS-${Date.now()}-${queued}`;
    const gradeMatch = nameGrade.match(/Grade (\d+)/);
    const grade = gradeMatch? parseInt(gradeMatch[1]) : 10;
    const subject = caps.includes("MATH")? "Mathematics" : caps.includes("PHYS")? "Physical Sciences" : caps.includes("LIFE")? "Life Sciences" : "Mathematics";
    const topic_name = nameGrade.split('-')[0].trim();

    await supabase.from("lesson_previews").upsert({
      caps_code: caps,
      grade, subject, topic_name,
      status: "queued"
    }, {onConflict:"caps_code"});
    queued++;
  }
  return NextResponse.json({queued});
}
