import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcmkhe.supabase.co",
  "sb_secret_UlK_LoRsi6zy2EKFfqbwTg_7KnAqq9w"
);

export async function GET() {
  // Total topics - live from your GOOD DB
  const { count: total } = await supabase.from("topic_knowledge").select("*", { count: "exact", head: true });

  // Try to get real fields, fallback to live calculations if columns don't exist yet
  const { data: allTopics } = await supabase.from("topic_knowledge").select("*").limit(500);

  const published = allTopics?.filter((t: any) => t.status === 'published' || t.is_published === true).length || total || 0;
  const missingMeta = allTopics?.filter((t: any) =>!t.caps_code ||!t.subject).length || 0;

  // Missing content logic - live
  const topicsMissingNodes = allTopics?.filter((t: any) =>!t.content || (t.content && t.content.length < 100)).length || 0;

  const { data: questions } = await supabase.from("questions").select("topic_id").limit(1000);
  const questionCounts: any = {};
  questions?.forEach((q: any) => { questionCounts[q.topic_id] = (questionCounts[q.topic_id] || 0) + 1 });
  const topicsWithLessThan3 = allTopics?.filter((t: any) => (questionCounts[t.id] || 0) < 3).length || 0;

  // Completion by subject - live grouping
  const subjects: any = {};
  allTopics?.forEach((t: any) => {
    const subj = t.subject || 'Unknown';
    if (!subjects[subj]) subjects[subj] = { topics: 0, scaffolded: 0, qs: 0, inReview: 0 };
    subjects[subj].topics++;
    if (t.content) subjects[subj].scaffolded++;
    if ((questionCounts[t.id] || 0) >= 3) subjects[subj].qs++;
  });

  return NextResponse.json({
    total: total || 0,
    published,
    inReview: 0,
    drafts: 0,
    needsChanges: 0,
    missingMeta,
    missingNodes: topicsMissingNodes,
    lessThan3: topicsWithLessThan3,
    missingPaper: missingMeta,
    bySubject: subjects,
    project: "civwluydzbwqlnipmcmkhe"
  });
}
