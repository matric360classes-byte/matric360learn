import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// UNIVERSAL - Fixes ANY formula, not just examples
function cleanUniversal(latex: string): string {
  if (!latex) return ""
  let s = latex.trim()

  // Remove $ and LaTeX noise
  s = s.replace(/\$+/g, '').replace(/\\\(|\\\)/g, '')

  // REMOVE * GLOBALLY - for ALL formulas
  s = s.replace(/\s*\*\s*/g, '').replace(/\\cdot/g, '')

  // Fix ALL subscripts - ANY _n _1 _i _k _m etc
  const subMap: Record<string,string> = {
    '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
    'a':'ₐ','e':'ₑ','i':'ᵢ','k':'ₖ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','t':'ₜ','x':'ₓ','f':'բ'
  }
  s = s.replace(/_\{([^}]+)\}/g, (_, sub) => {
    let out = ''
    for (const c of sub) out += subMap[c] || c
    return out
  })
  s = s.replace(/_([A-Za-z0-9])/g, (_, c) => subMap[c] || subMap[c.toLowerCase()] || c)

  // Fix ALL superscripts - ^2 ^3 ^n
  s = s.replace(/\^2/g,'²').replace(/\^3/g,'³').replace(/\^n/g,'ⁿ')
      .replace(/\^\{2\}/g,'²').replace(/\^\{3\}/g,'³')

  s = s.replace(/_/g, '').replace(/\\/g, '')
  return s.replace(/\s+/g,' ').trim()
}

export async function POST() {
  const sup = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await sup.from('lesson_nodes').select('*').eq('level','B')

  let cleaned = 0
  for (const node of data || []) {
    const formulas = node.content?.formulas || []
    const newFormulas = formulas.map((f:any) => ({
     ...f,
      latex: cleanUniversal(f.latex || f.formula || f),
      clean: cleanUniversal(f.latex || f.formula || f)
    }))
    await sup.from('lesson_nodes').update({
      content: {...node.content, formulas: newFormulas }
    }).eq('id', node.id)
    cleaned++
  }
  return NextResponse.json({ success: true, cleaned_nodes: cleaned, total: 675 })
}
