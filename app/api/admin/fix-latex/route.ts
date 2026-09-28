// @ts-nocheck
export const dynamic = 'force-dynamic'
export const maxDuration = 300
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const batch = parseInt(searchParams.get('batch') || '0')
  const BATCH_SIZE = 12

  const { data: qs } = await supabase.from('questions')
   .select('id, question_text, correct_answer, explanation, options, subject, unit')
   .range(batch*BATCH_SIZE, (batch+1)*BATCH_SIZE-1)
   .order('id')

  if(!qs || qs.length===0) return Response.json({done:true, batch, message:"All done"})

  let fixed=0
  let skipped=0
  let errors: string[] = []

  for(const q of qs){
    const text = `${q.question_text} ${q.correct_answer} ${(q.explanation||"")} ${(q.options||[]).join(' ')}`
    const hasDollarMoney = /\$\s*[0-9][0-9,]+/.test(text)
    const hasPlainLog = /\blog\s*x\b/i.test(text) || /x\^\(1\/10\)/i.test(text) || /f\^-1/i.test(text) || /\bIn\s*x\b/.test(text)

    // Skip if already perfect LaTeX AND no $ money AND no plain logs
    if(text.includes('$\\log') &&!hasDollarMoney &&!hasPlainLog){
      skipped++
      continue
    }

    const prompt = `
Fix this South African Matric question to PERFECT KaTeX rendering like example app.

TASK: Convert to LaTeX + SA Rand R.

RULES - CRITICAL:

1. CURRENCY - RAND ONLY:
   - Convert $5000, $ 5000, US$ -> R 5 000, R 12 500
   - NEVER use $ for money. $ is ONLY for math $...$
   - Example: "R 5 000 at $8\\%$"

2. MATH RENDERING - MUST MATCH EXAMPLE APP SCREENSHOT:

   LOGS (most important - fix these):
   - log x => $\\log x$
   - ln x, In x => $\\ln x$
   - log_5 x, log base 5 x => $\\log_5 x$
   - log_10 x, log base 10 => $\\log_{10} x$
   - log_2 8=3 => $\\log_2 8=3$

   POWERS & BASES:
   - x^2, x^3 => $x^2$, $x^3$
   - 2^x, 10^x => $2^x$, $10^x$
   - x^(1/10), x^1/10 => $x^{1/10}$
   - 1/10^x, 1/(10^x) => $\\frac{1}{10^x}$
   - 2^(x+1)=8 => $2^{x+1}=8$

   INVERSE & FUNCTIONS:
   - f^-1(x), f^-1(8), f^(-1) => $f^{-1}(x)$, $f^{-1}(8)$
   - f(x)=2^x, f(x)=10^x => $f(x)=2^x$, $f(x)=10^x$
   - f^-1(x)=log_5 x => $f^{-1}(x)=\\log_5 x$
   - Domain x>0, (0, infinity) => $x>0$, $x\\in(0,\\infty)$

   OTHER:
   - sqrt(x), sqrt(50) => $\\sqrt{x}$, $\\sqrt{50}$
   - (a+b)/c => $\\frac{a+b}{c}$
   - H2SO4, CH4 => $H_2SO_4$, $CH_4$
   - F=ma, Ek=1/2mv^2 => $F=ma$, $E_k=\\frac{1}{2}mv^2$
   - g=9.8, 20 m/s => $g=9.8 m\\cdot s^{-2}$, $20 m\\cdot s^{-1}$

3. OPTIONS: Must also be LaTeX
   - ["log x", "ln x"] => ["$\\log x$", "$\\ln x$"]

EXAMPLE INPUT -> OUTPUT:
Input: "Domain of f^-1(x) = log_5 x is log x vs ln x"
Output: "Domain of $f^{-1}(x)=\\log_5 x$ is $\\log x$ vs $\\ln x$"

Input: "If $5000 at 8% and sqrt(25)"
Output: "If R 5 000 at $8\\%$ and $\\sqrt{25}$"

Input Options: ["log x", "ln x", "x^(1/10)", "1/10^x"]
Output Options: ["$\\log x$", "$\\ln x$", "$x^{1/10}$", "$\\frac{1}{10^x}$"]

Return JSON ONLY:
{"question_text":"...","correct_answer":"...","explanation":"...","options":["$...$","$...$","$...$","$...$"]}

Original:
Subject: ${q.subject}
Unit: ${q.unit}
Question: ${q.question_text}
Answer: ${q.correct_answer}
Explanation: ${(q.explanation||"").slice(0,700)}
Options: ${JSON.stringify(q.options||[])}
`

    try{
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{role:"user", content: prompt}],
        response_format: {type:"json_object"},
        temperature: 0.1
      })
      const parsed = JSON.parse(resp.choices[0].message.content||"{}")

      const fixMoney = (txt:string) => {
        if(!txt) return txt
        return txt.replace(/\bUS\s*\$\s*/gi, "R ").replace(/\$\s*([0-9][0-9,]{2,})/g, "R $1").replace(/\bDollars?\b/gi, "Rand").replace(/R\s*R/g, "R ")
      }

      let newQ = fixMoney(parsed.question_text || q.question_text)
      let newA = fixMoney(parsed.correct_answer || q.correct_answer)
      let newE = fixMoney(parsed.explanation || q.explanation)
      let newOpts = parsed.options || q.options

      if(newOpts && Array.isArray(newOpts)){
        newOpts = newOpts.map((o:string)=>{
          if(!o) return o
          let opt = o.toString().trim()
          if(opt.toLowerCase()==="log x") return "$\\log x$"
          if(opt.toLowerCase()==="ln x" || opt.toLowerCase()==="in x") return "$\\ln x$"
          if(opt==="x^(1/10)" || opt.includes("x^(1/10")) return "$x^{1/10}$"
          if(opt.includes("1/10^x")) return "$\\frac{1}{10^x}$"
          return fixMoney(opt)
        })
      }

      const { error } = await supabase.from('questions').update({
        question_text: newQ,
        correct_answer: newA,
        explanation: newE,
        options: newOpts
      }).eq('id', q.id)

      if(!error) fixed++
      else errors.push(error.message)

    }catch(e:any){ errors.push(e.message) }
  }

  return Response.json({
    batch,
    processed: qs.length,
    fixed,
    skipped_already_perfect: skipped,
    errors: errors.slice(0,3),
    next: `/api/admin/fix-latex?batch=${batch+1}`,
    status: fixed>0? `Fixed ${fixed} - logs/bases/powers now like example app + R Rand` : "No fixes in batch"
  })
}
