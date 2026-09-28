// @ts-nocheck
export const dynamic = 'force-dynamic'
export const maxDuration = 300
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const batch = parseInt(searchParams.get('batch') || '0')
  const BATCH_SIZE = 10

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: qs, error } = await supabase.from('questions')
    .select('id, question_text, correct_answer, explanation, options')
    .range(batch*BATCH_SIZE, (batch+1)*BATCH_SIZE-1)
    .order('id')

  if(error) return Response.json({ error: error.message, batch })
  if(!qs || qs.length===0) return Response.json({ done:true, batch, processed:0, fixed:0 })

  let fixed=0
  let skipped=0

  for(const q of qs){
    const txt = `${q.question_text} ${q.correct_answer}`
    const hasMoney = /\$\s*[0-9]/.test(txt)
    const hasPlain = /\blog\s*x\b/i.test(txt) || /x\^\(1\/10\)/.test(txt)

    if(txt.includes('$\\log') && !hasMoney && !hasPlain){
      skipped++
      continue
    }

    const prompt = `Fix to KaTeX + Rand R. Rules: $5000->R 5 000, log x=>$\\log x$, ln x=>$\\ln x$, log_5 x=>$\\log_5 x$, x^(1/10)=>$x^{1/10}$, 1/10^x=>$\\frac{1}{10^x}$, f^-1=>$f^{-1}$. Options same. Return JSON {"question_text":"","correct_answer":"","explanation":"","options":[]} Original Q:${q.question_text} A:${q.correct_answer} E:${(q.explanation||'').slice(0,400)} Opts:${JSON.stringify(q.options||[])}`

    try{
      const r = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{role:"user", content: prompt}],
        response_format: {type:"json_object"},
        temperature: 0.1
      })
      const p = JSON.parse(r.choices[0].message.content||"{}")
      const clean = (s:string)=> s? s.replace(/\bUS\s*\$\s*/gi,"R ").replace(/\$\s*([0-9][0-9,]{2,})/g,"R $1").replace(/R\s*R/g,"R "):s

      await supabase.from('questions').update({
        question_text: clean(p.question_text||q.question_text),
        correct_answer: clean(p.correct_answer||q.correct_answer),
        explanation: clean(p.explanation||q.explanation),
        options: p.options||q.options
      }).eq('id', q.id)
      fixed++
    }catch(e){}
  }

  return Response.json({ batch, processed: qs.length, fixed, skipped_already_perfect: skipped, done: false })
}
