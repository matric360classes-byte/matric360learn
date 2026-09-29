export const dynamic='force-dynamic'
import { createClient } from '@supabase/supabase-js'

export async function GET(){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { count: total } = await supabase.from('questions').select('*',{count:'exact', head:true})

  const { data: all } = await supabase.from('questions').select('id, subject, unit, subtopic, question_text, correct_answer')

  // Group by subject
  const bySubject: any = {}
  const byUnit: any = {}
  const bySubtopic: any = {}
  let withDollar = 0
  let withRand = 0
  let withLatex = 0
  let withPlainLog = 0
  let broken = 0

  all?.forEach((q:any)=>{
    bySubject[q.subject] = (bySubject[q.subject]||0)+1
    byUnit[`${q.subject} - ${q.unit}`] = (byUnit[`${q.subject} - ${q.unit}`]||0)+1
    const key = `${q.subject} | ${q.unit} | ${q.subtopic||'NO_SUBTOPIC'}`
    bySubtopic[key] = (bySubtopic[key]||0)+1

    const txt = `${q.question_text} ${q.correct_answer}`
    if(/\$\s*[0-9]/.test(txt)) withDollar++
    if(/R\s*[0-9]/.test(txt)) withRand++
    if(txt.includes('$\\') || txt.includes('$f') || txt.includes('$x')) withLatex++
    if(/\blog\s*x\b/i.test(txt) || /x\^\(/.test(txt)) withPlainLog++
    if(txt.includes('\\$') || txt.includes('$$') || txt.includes('\\log x') &&!txt.includes('$\\log')) broken++
  })

  // Find empty subtopics (you have curriculum list?)
  const sortedSubtopics = Object.entries(bySubtopic).sort((a:any,b:any)=>a[1]-b[1])

  return Response.json({
    total,
    withDollar_MONEY_ERROR: withDollar,
    withRand_OK: withRand,
    withLatex_OK: withLatex,
    withPlainLog_NEEDS_FIX: withPlainLog,
    possiblyBroken: broken,
    bySubject,
    byUnit,
    fewestSubtopics: sortedSubtopics.slice(0, 30), // bottom 30 - these have few or 0
    mostSubtopics: sortedSubtopics.slice(-20),
    totalSubtopics: Object.keys(bySubtopic).length
  })
}
