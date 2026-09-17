// process-all now searches ALL PDFs for EACH topic
import { extractForTopic } from '@/lib/pdfExtractor'

const TOPICS_135 = [ {slug: 'arithmetic-series', title: 'Arithmetic Series'},... ] // your 135

for (const topic of TOPICS_135) {
  const extracted = await extractForTopic(supabase, topic.slug, topic.title)
  // extracted.rawText = relevant chunks from study guides + memos + papers
  // extracted.formulas = cleaned Sₙ, mv, etc.
  // Now build A-E nodes using extracted.rawText as source
}
