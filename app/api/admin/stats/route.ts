export const dynamic='force-dynamic'
import { createClient } from '@supabase/supabase-js'

export async function GET(){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { count: total } = await supabase.from('questions').select('*',{count:'exact', head:true})

  let all: any[] = []
  let from = 0
  const step = 1000
  while(true){
    const { data } = await supabase.from('questions').select('id, subject, unit, subtopic, question_text, correct_answer, options, explanation').range(from, from+step-1).order('id')
    if(!data || data.length===0) break
    all = all.concat(data)
    from += step
    if(data.length < step) break
    if(from > 5000) break
  }

  const bySubject: any = {}
  const byUnit: any = {}
  const bySubtopic: any = {}
  let withDollar=0, withRand=0, withLatex=0, withPlainLog=0, broken=0

  all.forEach((q:any)=>{
    bySubject[q.subject] = (bySubject[q.subject]||0)+1
    byUnit[`${q.subject} | ${q.unit}`] = (byUnit[`${q.subject} | ${q.unit}`]||0)+1
    const key = `${q.subject} | ${q.unit} | ${q.subtopic||'NO_SUBTOPIC'}`
    bySubtopic[key] = (bySubtopic[key]||0)+1
    const txt = `${q.question_text} ${q.correct_answer} ${(q.options||[]).join(' ')} ${q.explanation||''}`
    if(/\$\s*[0-9]{2,}/.test(txt)) withDollar++
    if(/R\s*[0-9 ]{2,}/.test(txt)) withRand++
    if(txt.includes('$\\log') || txt.includes('$\\ln') || txt.includes('$x^') || txt.includes('$f^{-1}')) withLatex++
    if(/\blog\s*x\b/i.test(txt) || /x\^\s*\(/.test(txt) || /\bIn\s*x\b/.test(txt)) withPlainLog++
    if(txt.includes('$$') || txt.includes('\\$')) broken++
  })

  const sorted = Object.entries(bySubtopic).sort((a:any,b:any)=>a[1]-b[1])

  return Response.json({
    total,
    actually_scanned: all.length,
    withDollar_MONEY_ERROR: withDollar,
    withRand_OK: withRand,
    withLatex_OK: withLatex,
    withPlainLog_NEEDS_FIX: withPlainLog,
    possiblyBroken_$$: broken,
    bySubject,
    byUnitCount: Object.keys(byUnit).length,
    totalSubtopics: Object.keys(bySubtopic).length,
    fewestSubtopics_need_more: sorted.slice(0, 40),
    mostSubtopics: sorted.slice(-15),
    byUnit
  })
}
