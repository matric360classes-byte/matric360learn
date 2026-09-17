// lib/pdfExtractor.ts - Extracts topics + formulas FROM your PDFs
import { cleanFormula } from './formulaCleaner'

// CAPS 135 topics keywords - maps PDF text to your topic slugs
const TOPIC_MAP: Record<string, string[]> = {
  'arithmetic-series': ['arithmetic series', 'Sₙ', 'S_n', 'sum of arithmetic', 'Tₙ = a +'],
  'geometric-series': ['geometric series', 'geometric sequence', 'r^n'],
  'momentum': ['momentum', 'p = mv', 'p=mv', 'impulse'],
  'newton-second-law': ['F = ma', 'F=ma', 'newton second', 'net force'],
  'work-energy': ['work', 'W = F', 'kinetic energy', 'E_k = 1/2 mv^2'],
  // Add rest - system will auto-detect by title if not in map
}

export async function extractPDF(fileBlob: Blob, pdfMeta: any) {
  const pdfParse = (await import('pdf-parse')).default
  const buffer = Buffer.from(await fileBlob.arrayBuffer())
  const data = await pdfParse(buffer)
  const text = data.text || ''

  // 1. Extract ALL formulas using universal patterns
  const formulaRegex = [
    /\$[^$]{2,80}\$/g,
    /[A-Z]_[a-z0-9]\s*=\s*[^.\n]{2,80}/g, // S_n = ...
    /[a-z]\s*=\s*[a-z]\s*\*\s*[a-z]/gi, // p = m * v
    /\b[A-Z]_\{[^}]+\}/g,
    /\w+\^2|\w+\^3/g,
    /p\s*=\s*mv|F\s*=\s*ma|E_k\s*=/gi,
  ]

  let raw: string[] = []
  formulaRegex.forEach(rx => {
    const matches = text.match(rx) || []
    raw.push(...matches)
  })
  raw = [...new Set(raw)].slice(0, 20) // dedup, max 20 per PDF

  const cleaned = raw.map(latex => ({
    latex: cleanFormula(latex),
    original: latex,
    description: `From PDF: ${pdfMeta.title || pdfMeta.id}`,
  })).filter(f => f.latex.length > 2)

  // 2. Detect topics from PDF text + filename
  const lower = text.toLowerCase() + ' ' + (pdfMeta.title || '').toLowerCase()
  let detectedSlug = pdfMeta.topic_slug
  if (!detectedSlug) {
    for (const [slug, keywords] of Object.entries(TOPIC_MAP)) {
      if (keywords.some(k => lower.includes(k.toLowerCase()))) {
        detectedSlug = slug
        break
      }
    }
  }
  if (!detectedSlug) detectedSlug = (pdfMeta.title || pdfMeta.id).toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const topicTitle = pdfMeta.title || detectedSlug.replace(/-/g, ' ')

  return {
    topics: [{
      slug: detectedSlug,
      title: topicTitle,
      formulas: cleaned,
      rawText: text.slice(0, 10000),
    }],
    totalFormulas: cleaned.length,
  }
}
