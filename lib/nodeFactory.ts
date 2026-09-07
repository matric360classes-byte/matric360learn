// lib/nodeFactory.ts - CAPS Node Factory - WIRED & FIXED
export type CapsNodeType = 'A' | 'B' | 'C' | 'D' | 'E';

export interface CapsNode {
  id: string;
  topicId: string;
  type: CapsNodeType;
  title: string;
  status: 'draft' | 'scaffolded' | 'published';
  content: any;
}

export const NODE_TEMPLATES = {
  A: { title: "A - Lesson", desc: "Core lesson explanation" },
  B: { title: "B - Video", desc: "Video lesson" },
  C: { title: "C - CAPS", desc: "CAPS alignment + formulas" },
  D: { title: "D - Questions", desc: "3+ practice questions" },
  E: { title: "E - Example", desc: "Worked example" },
};

export function createNodesForTopic(topicId: string, subject: string, topicName: string): CapsNode[] {
  return (['A','B','C','D','E'] as CapsNodeType[]).map(type => ({
    id: `${topicId}-${type}`,
    topicId,
    type,
    title: `${NODE_TEMPLATES[type].title}: ${topicName}`,
    status: type === 'A'? 'scaffolded' : 'draft', // Auto-scaffold Lesson
    content: {
      subject,
      topic: topicName,
      template: NODE_TEMPLATES[type].desc,
      createdAt: new Date().toISOString(),
      // AUTO-FILL CAPS knowledge link
      knowledgeRef: `topic_knowledge:${subject}:${topicId}`,
    }
  }));
}

// Fixes 249 missing nodes - run this for all topics
export function ensureAllTopicsHaveNodes(topics: any[]) {
  const missing: any[] = [];
  topics.forEach(t => {
    const existingTypes = t.nodes?.map((n:any) => n.type) || [];
    (['A','B','C','D','E'] as CapsNodeType[]).forEach(type => {
      if (!existingTypes.includes(type)) {
        missing.push(createNodesForTopic(t.id, t.subject, t.name)[['A','B','C','D','E'].indexOf(type)]);
      }
    });
  });
  return missing;
}

// Used by admin to auto-fix
export async function fixAllMissingNodes(supabase: any) {
  // Fetch all topics
  const { data: topics } = await supabase.from('topics').select('*');
  if (!topics) return { fixed: 0 };

  const nodesToCreate = ensureAllTopicsHaveNodes(topics);

  if (nodesToCreate.length > 0) {
    await supabase.from('caps_nodes').upsert(nodesToCreate, { onConflict: 'id' });
  }

  return { fixed: nodesToCreate.length, nodes: nodesToCreate };
}
