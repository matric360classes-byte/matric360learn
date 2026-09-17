// lib/formulaCleaner.ts - Auto-cleans ALL future PDF formulas
const subMap: Record<string,string> = {
  '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
  'a':'ₐ','e':'ₑ','i':'ᵢ','k':'ₖ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','t':'ₜ','x':'ₓ'
}

export function cleanFormula(latex: string): string {
  if (!latex) return ""
  let s = String(latex).replace(/\$+/g, '').replace(/\\\(|\\\)/g, '')
  s = s.replace(/\s*\*\s*/g, '').replace(/\\cdot/g, '').replace(/\\times/g, '')
  s = s.replace(/_\{([^}]+)\}/g, (_, inner) =>
    [...inner].map((c:string) => subMap[c] || c).join('')
  )
  s = s.replace(/_([A-Za-z0-9])/g, (_, c) => subMap[c] || subMap[c.toLowerCase()] || c)
  s = s.replace(/\^2/g,'²').replace(/\^3/g,'³').replace(/\^n/g,'ⁿ')
   .replace(/\^\{2\}/g,'²').replace(/\^\{3\}/g,'³')
  return s.replace(/\s+/g,' ').trim()
}

export function cleanFormulasArray(formulas: any[]) {
  return formulas.map(f => ({
  ...f,
    latex: cleanFormula(f.latex || f.formula || ''),
  }))
}
