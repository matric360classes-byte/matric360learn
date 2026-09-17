// lib/nodeFactory.ts - FINAL FIX - Auto-cleans future PDF formulas
import { cleanFormula, cleanFormulasArray } from './formulaCleaner'

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

// Allow 2 OR 3 arguments
export function createNodesForTopic(topicId: string, subject: string, topicName?: string): CapsNode[] {
  const displayName = topicName || topicId;
  return (['A','B','C','D','E'] as CapsNodeType[]).map(type => ({
    id: `${topicId}-${type}`,
    topicId,
    type,
    title: `${NODE_TEMPLATES[type].title}: ${displayName}`,
    status: (type === 'A'? 'scaffolded' : 'draft') as any,
    content: {
      subject,
      topic: displayName,
      template: NODE_TEMPLATES[type].desc,
      createdAt: new Date().toISOString(),
      knowledgeRef: `topic_knowledge:${subject}:${topicId}`,
      // Future formulas will be auto-cleaned here
      formulas: [], // Will be filled and cleaned by cleanFormulasArray
    }
  }));
}

// NEW: Use this when you get formulas from PDFs
export function createNodeWithCleanFormulas(
  topicId: string,
  subject: string,
  topicName: string,
  rawFormulas: any[]
) {
  const nodes = createNodesForTopic(topicId, subject, topicName)
  // Auto-clean ALL formulas from PDFs: S_n->Sₙ, m*v->mv, v^2->v²
  const cleaned = cleanFormulasArray(rawFormulas)

  // Put cleaned formulas into B and C nodes (where formulas live)
  const bNode = nodes.find(n => n.type === 'B')
  const cNode = nodes.find(n => n.type === 'C')
  if (bNode) bNode.content.formulas = cleaned
  if (cNode) cNode.content.formulas = cleaned

  return nodes
}

// COMPATIBILITY - OLD NAME
export const buildNodesForTopic = createNodesForTopic;
export default createNodesForTopic;

export function ensureAllTopicsHaveNodes(topics: any[]) {
  const missing: any[] = [];
  topics.forEach((t: any) => {
    const existingTypes = t.nodes?.map((n:any) => n.type) || [];
    (['A','B','C','D','E'] as CapsNodeType[]).forEach(type => {
      if (!existingTypes.includes(type)) {
        missing.push(createNodesForTopic(t.id, t.subject, t.name)[['A','B','C','D','E'].indexOf(type)]);
      }
    });
  });
  return missing;
}

export async function fixAllMissingNodes(supabase: any) {
  const { data: topics } = await supabase.from('topics').select('*');
  if (!topics) return { fixed: 0 };
  const nodesToCreate = ensureAllTopicsHaveNodes(topics);
  if (nodesToCreate.length > 0) {
    await supabase.from('caps_nodes').upsert(nodesToCreate, { onConflict: 'id' });
  }
  return { fixed: nodesToCreate.length };
}
