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
      
      // Update status
      await supabase.from("topic_knowledge").update({ status: "in_review" }).eq("id", id);

      const lessonContent = `# ${topicName} - Grade ${topic.grade}\n\nNode A: Concept\nNode B: Example\nNode C: Practice\nNode D: Exam\nNode E: Summary for ${topicName}`;

      // INSERT using caps_code (your table's real column)
      const { error: insertError } = await supabase.from("lesson_previews").insert({
        caps_code: caps,
        content: lessonContent
      });

      if(insertError){
        details.push(`${topicName} FAILED: ${insertError.message}`);
      } else {
        generated++;
        details.push(`${topicName} -> created in lesson_previews`);
      }
    }
    return NextResponse.json({ generated, cost: generated*0.04, details });
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status:500});
  }
}
