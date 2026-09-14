import { LESSONS } from "@/lib/lessons";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(){
  let count=0;
  for(const l of LESSONS){
    const { error } = await supabase.from("lesson_nodes").insert({
      id: l.id,
      topic_id: l.id,
      node_label: l.id,
      title: l.title,
      // store extra for your factory matching
      subject: l.subjectId,
      unit: l.unitId,
    });
    if(!error) count++;
  }
  // Now create 5 parts for each
  const { data: nodes } = await supabase.from("lesson_nodes").select("id");
  for(const node of nodes!){
    const parts = [
      {parent_node_id: node.id, node_key:"A", title:"Exam Hook", sort_order:1},
      {parent_node_id: node.id, node_key:"B", title:"Learn The Concept", sort_order:2},
      {parent_node_id: node.id, node_key:"C", title:"Worked Example", sort_order:3},
      {parent_node_id: node.id, node_key:"D", title:"Examiner Traps", sort_order:4},
      {parent_node_id: node.id, node_key:"E", title:"Exam Challenge", sort_order:5},
    ];
    await supabase.from("lesson_parts").insert(parts);
  }
  return Response.json({ok:true, inserted_topics: count, final_nodes: count*5 });
}
