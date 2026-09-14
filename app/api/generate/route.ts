import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(){
  const { count: t } = await supabase.from("lesson_nodes").select("*", { count: "exact", head: true });
  const { count: n } = await supabase.from("lesson_parts").select("*", { count: "exact", head: true });
  const { data } = await supabase.from("lesson_parts").select("content_json").limit(1000);
  const filled = data?.filter(d => JSON.stringify(d.content_json).length > 100).length || 0;
  return NextResponse.json({ status: "ready", topics_135: t, nodes_675: n, filled_nodes: filled });
}

export async function POST(req: NextRequest){
  const { topicIds } = await req.json().catch(()=>({})) as any;
  
  // Get 10 empty nodes at a time (to avoid timeout)
  let query = supabase.from("lesson_parts").select("*, lesson_nodes!inner(title, subject)").eq("content_json", "{}" as any).limit(10);
  if(topicIds?.length) query = supabase.from("lesson_parts").select("*, lesson_nodes!inner(title, subject)").in("parent_node_id", topicIds).limit(10);
  
  const { data: parts } = await query;
  if(!parts?.length) return NextResponse.json({ message: "All 675 Nodes filled! DONE", done: true });

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", generationConfig: { temperature: 0.4, maxOutputTokens: 8000 } });

  const SYSTEM = `
You are Matric360 senior examiner. Build lesson from 4 PDF sources:

PDF SOURCES & HOW TO USE:
1. Mind the Gap (Maths/Phys/Chem) = PRIMARY for NODE B Learn Concept for ALL 135 topics. Use its simple definitions, explanations, diagrams. If topic not found, adapt closest chapter.
2. DBE Past Papers 2020-2024 + Memos = For NODE A Exam Hook (real question) and NODE C Worked Example and NODE E Challenge
3. Chief Marker's / Diagnostic Reports = PRIMARY for NODE D Traps. Extract EXACT quotes: "Many learners lost marks because...", include % failure rates, page numbers. Create 5 traps from report.
4. Exam Guidelines / CAPS = For mark allocation.

MANDATORY FOR EVERY NODE A-E:
- 400+ words minimum in body_markdown. REJECT if less.
- 5+ formulas in KaTeX: inline $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ and block $$E_k = \\frac{1}{2}mv^2$$ - minimum 5
- 5+ concepts/examples/traps
- Reference old Matric360 style: GIVEN/FORMULA/SUBSTITUTION/ANSWER, tables, bullet points, exam refs "DBE Nov 2023 Q2.1 - 68% failed"
- Simple Grade 12 language

NODE E SPECIAL - Interconnected Topics Map REQUIRED:
At end add section "### 🔗 Where This Topic Appears in Exams" with table:
| Related Topic | How It's Used Together | Brief Example (max 15 words) |
List minimum 5 related topics within same subject and what it's used on briefly.
Example: Quadratic Equations -> links to Parabola, Inequalities, Word Problems etc.

OUTPUT JSON ONLY, no markdown wrapper:
{"body_markdown": "## ... 400+ words with table ...", "formulas": ["$...$","$$...$$", ...5], "exam_refs": ["DBE 2023 Q..."], "traps": ["5 traps"], "related_topics": [{"topic":"...","used_for":"...","example":"..."} x5] }
`;

  let generated = 0;
  for(const part of parts){
    const nodeKey = (part as any).node_key; // A,B,C,D,E
    const title = (part as any).lesson_nodes.title;
    const subject = (part as any).lesson_nodes.subject;
    
    let nodeInstruction = "";
    if(nodeKey==='A') nodeInstruction = "NODE A Exam Hook: Start with real DBE question from Past Paper, state why 60%+ failed, use Chief Marker % if available. 400+ words.";
    if(nodeKey==='B') nodeInstruction = "NODE B Learn Concept: Use Mind the Gap as primary. 5 concepts each with definition + example. 400+ words. Use for ALL topics.";
    if(nodeKey==='C') nodeInstruction = "NODE C Worked Example: 5-step solution GIVEN/FORMULA/SUBSTITUTION/ANSWER from Memo. 400+ words.";
    if(nodeKey==='D') nodeInstruction = "NODE D Examiner Traps: Use Chief Marker Report as primary. 5 traps with exact quote 'As stated in DBE Diagnostic Report pX: ...', What learners do vs What examiner wants, how to avoid.";
    if(nodeKey==='E') nodeInstruction = "NODE E Exam Challenge: Hardest DBE question + full memo + Interconnected Topics Table with 5+ related topics and what it's used on briefly + marks allocation.";

    const prompt = `${SYSTEM}\n\nTopic: ${title}\nSubject: ${subject}\nNode: ${nodeKey} - ${part.title}\nInstruction: ${nodeInstruction}`;

    try{
      const result = await model.generateContent(prompt);
      let text = result.response.text().replace(/```json|```/g, "").trim();
      const json = JSON.parse(text);
      
      await supabase.from("lesson_parts").update({ content_json: json, updated_at: new Date().toISOString() }).eq("id", part.id);
      generated++;
    } catch(e:any){
      console.error("Failed", title, nodeKey, e.message);
    }
  }

  return NextResponse.json({ success: true, generated_batch: generated, next: "Call POST again to process next 10 until 675 done" });
}
