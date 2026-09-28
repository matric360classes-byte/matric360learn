// @ts-nocheck
export const dynamic = 'force-dynamic'
export const maxDuration = 300
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(){
  const BATCH_SIZE = 12
  let totalFixed = 0
  let totalProcessed = 0
  let batch = 0
  let logs: any[] = []

  while(true){
    const { data: qs } = await supabase.from('questions')
    .select('id, question_text, correct_answer, explanation, options, subject, unit')
    .range(batch*BATCH_SIZE, (batch+1)*BATCH_SIZE-1)
    .order('id')

    if(!qs || qs.length===0) break

    for(const q of qs){
      totalProcessed++
      const text = `${q.question_text} ${q.correct_answer} ${(q.explanation||"")} ${(q.options||[]).join(' ')}`
      const hasDollarMoney = /\$\s*[0-9][0-9,]+/.test(text)
      const hasPlainLog = /\blog\s*x\b/i.test(text) || /x\^\(1\/10\)/i.test(text) || /f\^-1/i.test(text) || /\bIn\s*x\b/.test(text)

      if(text.includes('$\\log') &&!hasDollarMoney &&!hasPlainLog){
        continue
      }

      const prompt = `
Fix to PERFECT KaTeX + SA Rand R.

Rules:
- $5000 -> R 5 000, NEVER $ for money
- log x => $\\log x$, ln x, In x => $\\ln x$, log_5 x => $\\log_5 x$, log_2 8 => $\\log_2 8$
- x^2 => $x^2$, x^(1/10) => $x^{1/10}$, 1/10^x => $\\frac{1}{10^x}$
- f^-1 => $f^{-1}(x)$, f(x)=2^x => $f(x)=2^x$, x>0, (0, infinity) => $x\\in(0,\\infty)$
- sqrt => $\\sqrt{}$, H2SO4 => $H_2SO_4$, F=ma => $F=ma$
- Options: ["log x"] => ["$\\log x$"]

Return JSON: {"question_text":"...","correct_answer":"...","explanation":"...","options":["$...$"]}

Original:
Q: ${q.question_text}
A: ${q.correct_answer}
E: ${(q.explanation||"").slice(0,600)}
Opts: ${JSON.stringify(q.options||[])}
`
      try{
        const resp = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{role:"user", content: prompt}],
          response_format: {type:"json_object"},
          temperature: 0.1
        })
        const parsed = JSON.parse(resp.choices[0].message.content||"{}")
        const fixMoney = (t:string)=> t? t.replace(/\bUS\s*\$\s*/gi,"R ").replace(/\$\s*([0-9][0-9,]{2,})/g,"R $1").replace(/R\s*R/g,"R ") : t

        let newOpts = parsed.options || q.options
        if(newOpts) newOpts = newOpts.map((o:string)=>{
          let opt=o.toString().trim()
          if(opt.toLowerCase()==="log x") return "$\\log x$"
          if(opt.toLowerCase()==="ln x"||opt.toLowerCase()==="in x") return "$\\ln x$"
          if(opt.includes("x^(1/10")) return "$x^{1/10}$"
          if(opt.includes("1/10^x")) return "$\\frac{1}{10^x}$"
          return fixMoney(opt)
        })

        await supabase.from('questions').update({
          question_text: fixMoney(parsed.question_text||q.question_text),
          correct_answer: fixMoney(parsed.correct_answer||q.correct_answer),
          explanation: fixMoney(parsed.explanation||q.explanation),
          options: newOpts
        }).eq('id', q.id)
        totalFixed++
      }catch(e){}
    }
    logs.push(`Batch ${batch}: done`)
    batch++
    if(batch>90) break // safety for 1000
  }

  return Response.json({ totalProcessed, totalFixed, batches: batch, status: `DONE - Fixed ${totalFixed} of ${totalProcessed} - now like example app with logs/bases/powers + R Rand`, logs: logs.slice(-5) })
}
