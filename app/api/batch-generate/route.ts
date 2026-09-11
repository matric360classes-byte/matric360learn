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
    if(topicIds.length>50) return NextResponse.json({error:"Max 50 per batch - cost guard"}, {status:400});

    let generated = 0;
    const details: string[] = [];
    let cost = 0;

    for(const id of topicIds){
      const {data: topic, error} = await supabase.from("topic_knowledge").select("*").eq("id", id).single();
      if(error || !topic) continue;
      
      await supabase.from("topic_knowledge").update({
        is_scaffolded: true,
        status: "in_review",
        updated_at: new Date().toISOString()
      }).eq("id", id);

      generated++;
      cost += 0.04;
      const name = (topic as any).topic || (topic as any).title || (topic as any).name || id;
      details.push(name + " -> in_review");
    }

    return NextResponse.json({ generated, cost, details });
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status:500});
  }
}
