import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const topicIds = body.topicIds as string[];
    if(!topicIds?.length) return NextResponse.json({error:"No topics"}, {status:400});

    let generated = 0;
    const details: string[] = [];

    for(const id of topicIds){
      const {data: topic} = await supabase.from("topic_knowledge").select("*").eq("id", id).single();
      if(!topic) continue;
      
      const topicName = (topic as any).topic_name || (topic as any).title || "Topic";
      const caps = (topic as any).caps_code;
      const subj = (topic as any).subject || "Mathematics";
      const grade = (topic as any).grade || "10";
      
      await supabase.from("topic_knowledge").update({ status: "in_review" }).eq("id", id);

      const lessonContent = `# ${topicName} - Grade ${grade}\n\n**Node A: Concept** - DBE CAPS explanation of ${topicName}\n\n**Node B: Example** - Worked example\n\n**Node C: Practice** - 3 questions\n\n**Node D: Exam** - Past paper style\n\n**Node E: Summary**`;

      const { error } = await supabase.from("lesson_previews").insert({
        caps_code: caps,
        subject: subj,
        topic_name: topicName,
        content: { markdown: lessonContent, grade: grade, nodes: ["A","B","C","D","E"] },
        status: "pending",
        cost_usd: 0.04
      });

      if(error){
        details.push(`${topicName} FAILED: ${error.message}`);
      } else {
        generated++;
        details.push(`${topicName} -> pending + $${0.04}`);
      }
    }
    return NextResponse.json({ generated, cost: generated*0.04, details });
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status:500});
  }
}
