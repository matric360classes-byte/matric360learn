import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const NODES = [
  { id: "A", title: "Core Concept" },
  { id: "B", title: "Worked Examples" },
  { id: "C", title: "Practice Zone" },
  { id: "D", title: "Common Mistakes" },
  { id: "E", title: "Exam Link" },
];

export async function POST(req: Request) {
  try {
    const { pdf_path, subject, grade } = await req.json();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPA__URL || process.env.NEXT__URL || "https://civwluydzbwqlnipmcmkhe.supabase.co";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPA__KEY || process.env.SUPA_KEY || "sb_secret_UlK_LoRsi6zy2EKFfqbwTg_7KnAqq9w";
    const supabase = createClient(url, key);

    const topicName = pdf_path.split("-").pop()?.replace(".pdf","").replace(/_/g," ") || "New Topic";
    
    const { data: topic, error: tErr } = await supabase.from("topic_knowledge").insert({
      title: topicName,
      subject: subject || "Mathematics",
      grade: parseInt(grade) || 12,
      paper: "P1",
      section: "General",
      status: "in_review",
      caps_code: "CAPS-" + Date.now().toString().slice(-4),
      source_pdf: pdf_path
    }).select().single();

    if (tErr) throw new Error(tErr.message);

    const lessons = NODES.map(n => ({
      topic_id: topic.id,
      node: n.id,
      title: `${topicName} - Node ${n.id}: ${n.title}`,
      summary: n.title,
      content: `# ${topicName}\nNode ${n.id}\nFrom: ${pdf_path}`,
      status: "draft"
    }));

    await supabase.from("lesson_previews").insert(lessons);

    const qs = Array.from({ length: 5 }).map((_, i) => ({
      topic_id: topic.id,
      question_text: `Q${i+1} for ${topicName} — from ${pdf_path}`,
      option_a: "A", option_b: "B", option_c: "C", option_d: "D",
      correct_answer: "A",
      explanation: "Auto-generated",
      difficulty: "medium", marks: 3
    }));

    await supabase.from("questions").insert(qs);

    return NextResponse.json({ ok: true, topic_id: topic.id });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
