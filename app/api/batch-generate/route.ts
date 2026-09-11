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
    if(!topicIds || topicIds.length===0) return NextResponse.json({error:"No topics"}, {status:400});
    if(topicIds.length>50) return NextResponse.json({error:"Max 50 - cost guard"}, {status:400});

    let generated = 0;
    const details: string[] = [];
    let cost = 0;

    for(const id of topicIds){
      const {data: topic, error} = await supabase.from("topic_knowledge").select("*").eq("id", id).single();
      if(error || !topic) {
        details.push(`${id} -> not found`);
        continue;
      }
      
      const topicName = (topic as any).topic_name || (topic as any).title || "Topic";
      const grade = (topic as any).grade || "";
      
      // 1. Update topic_knowledge to in_review
      await supabase.from("topic_knowledge").update({
        status: "in_review",
        updated_at: new Date().toISOString()
      }).eq("id", id);

      // 2. Create lesson_preview (Nodes A-E scaffold)
      const lessonContent = `# ${topicName} - Grade ${grade}\n\n**Node A: Concept**\nExplain ${topicName}\n\n**Node B: Example**\nWorked example for ${topicName}\n\n**Node C: Practice**\n3 Questions\n\n**Node D: Exam Style**\nDBE past paper style\n\n**Node E: Summary**\nKey formulas for ${topicName}`;

      await supabase.from("lesson_previews").insert({
        topic_id: id,
        content: lessonContent
      });

      generated++;
      cost += 0.04;
      details.push(`${topicName} - Grade ${grade} -> in_review + preview created`);
    }

    return NextResponse.json({ generated, cost, details });
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status:500});
  }
}
