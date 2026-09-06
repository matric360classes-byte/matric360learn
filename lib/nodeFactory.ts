// lib/nodeFactory.ts
// ONE FACTORY FOR ALL TOPICS - Pure Maths + Physical Sciences
// CAPS / DBE / Mind the Gap / Past Papers aligned

export const CAPS_DB: any = {
  // ================= PURE MATHS =================
  "exponential-laws": {
    subject: "maths",
    title: "Exponential Laws",
    breadcrumbs: ["Mathematics", "Exponential and Logarithmic Functions", "Exponential Laws"],
    formulas: [
      { f: "a^m * a^n = a^(m+n)", desc: "Multiplying powers with the same base." },
      { f: "a^m / a^n = a^(m-n)", desc: "Dividing powers with the same base." },
      { f: "(a^m)^n = a^(m*n)", desc: "A power is raised to another power." },
      { f: "(ab)^n = a^n * b^n", desc: "Power of a product." },
      { f: "a^0 = 1 (a≠0)", desc: "Anything to power zero." },
      { f: "a^-n = 1 / a^n", desc: "Negative exponent." },
      { f: "y = a*b^(x+p) + q, asymptote y = q", desc: "Standard exponential graph." },
      { f: "y = b^x <=> x = log_b(y)", desc: "Inverse - log form." },
    ],
    keyTerms: [
      { term: "Base", def: "In a^x, 'a' is the base." },
      { term: "Exponent", def: "In a^x, 'x' is the exponent." },
      { term: "Exponential Equation", def: "Equation where variable is in exponent." },
      { term: "Asymptote", def: "Line graph approaches but never touches." },
    ],
    intro: "Exponents are a quick way to write repeated multiplication. The Laws of Exponents are the rules you MUST follow when doing calculations with them. We use these to solve exponential equations, where x is part of the exponent. These link to exponential functions graphs with rapid growth/decay. In exams you'll be asked to solve, sketch graphs, and understand intercepts and asymptotes.",
    checklist: [
      "Have I identified horizontal asymptote (y=q)?",
      "Have I calculated BOTH intercepts?",
      "Does sketch show correct shape approaching asymptote?",
      "When solving, did I check for hidden quadratic (k-method)?",
      "Have I rejected invalid solutions like 3^x = -5?",
    ],
    keyFacts: [
      "Graph y = a*b^x + q has horizontal asymptote y=q.",
      "If base b>1, graph increasing. If 0<b<1, decreasing.",
      "a^x (a>0) is always positive, never 0 or negative.",
      "Inverse of exponential is logarithmic.",
    ],
    worked: [
      {
        question: "Given f(x)=5^x -25, determine x-intercept.",
        marks: "4 marks", level: "Easy", source: "DBE Nov 2019 P1 Q4.2 - Mind the Gap p.54",
        steps: [
          { expr: "f(x)=0", why: "For x-intercept set y=0", note: "M" },
          { expr: "5^x -25=0", why: "Substitute", note: "A" },
          { expr: "5^x=25", why: "Isolate exponential term", note: "M" },
          { expr: "5^x=5^2", why: "Same base", note: "A" },
          { expr: "x=2 => (2;0)", why: "Bases equal => exponents equal", note: "A" },
        ]
      },
      {
        question: "Solve for x: 2^(x+2)=8",
        marks: "3 marks", level: "Easy", source: "DBE Exemplar 2014",
        steps: [
          { expr: "2^(x+2)=2^3", why: "8 = 2^3", note: "M" },
          { expr: "x+2=3", why: "Bases equal", note: "M" },
          { expr: "x=1", why: "", note: "A" },
        ]
      },
      {
        question: "Solve: 2^(2x) -5*2^x -24=0 (k-method)",
        marks: "5 marks", level: "Hard", source: "DBE Nov 2021 P1 Q1.2 Memo",
        steps: [
          { expr: "Let k=2^x => k^2-5k-24=0", why: "Quadratic in k", note: "M" },
          { expr: "(k-8)(k+3)=0", why: "Factorise", note: "A" },
          { expr: "k=8 or k=-3", why: "", note: "A" },
          { expr: "2^x=8 => x=3, 2^x=-3 no solution", why: "a^x>0 always", note: "M+A" },
        ]
      },
      {
        question: "f(x)=a^x+q passes through (2;11) asymptote y=-1 Find a",
        marks: "5 marks", level: "Medium", source: "DBE Nov 2020",
        steps: [
          { expr: "q=-1", why: "Asymptote gives q", note: "A" },
          { expr: "11=a^2 -1", why: "Sub (2;11)", note: "M" },
          { expr: "a=√12=2√3", why: "Base positive", note: "A" },
        ]
      },
      {
        question: "Solve: 3^x=27",
        marks: "2 marks", level: "Easy", source: "Mind the Gap",
        steps: [
          { expr: "3^x=3^3", why: "27=3^3", note: "M" },
          { expr: "x=3", why: "", note: "A" },
        ]
      },
      {
        question: "Given g(x)=3^x Find g^-1(x)",
        marks: "3 marks", level: "Medium", source: "DBE Nov 2022",
        steps: [
          { expr: "y=3^x", why: "Write as y=", note: "M" },
          { expr: "x=3^y", why: "Swap x and y", note: "M" },
          { expr: "y=log_3(x)", why: "To log form", note: "A" },
        ]
      },
    ],
    errors: [
      { error: "Writing 2^(x+2)=2^x+2^2=8", marker: "Law a^(m+n)=a^m*a^n not +", lost: "2", fix: "2^(x+2)=2^3 => x+2=3 => x=1 OR 2^x*4=8 =>2^x=2=>x=1" },
      { error: "For f(x)=3^x-9 stating range y>0", marker: "Ignored shift q", lost: "1", fix: "Shifted down 9, asymptote y=-9, range y>-9" },
      { error: "Divide by 2^x losing solution in 2^(2x)-5*2^x=0", marker: "Lost solution when dividing by variable", lost: "2", fix: "Take common factor: 2^x(2^x-5)=0" },
    ],
    tips: [
      { type: "'Solve for x' (Equation)", attack: "First goal get bases same. If can't, check hidden quadratic k-method. If different bases 2^x and 3^x use logs.", ex: "DBE 2023: Solve 2^x=3^(x-1) using logs" },
      { type: "'Sketch the graph'", attack: "Find 3 things: 1. Asymptote y=q 2. y-intercept x=0 3. x-intercept y=0 Then draw correct shape through points approaching asymptote.", ex: "f(x)=2^x+1" },
    ]
  },

  // --- ADD YOUR OTHER TOPICS HERE SAME FORMAT ---
  // Example: Maths
  "arithmetic-sequences": {
    subject: "maths", title: "Arithmetic Sequences",
    formulas: [{ f: "Tₙ = a + (n-1)d", desc: "n-th term" }, { f: "Sₙ = n/2[2a+(n-1)d]", desc: "Sum" }, { f: "d = T₂-T₁", desc: "Common difference" }],
    keyTerms: [], intro: "", checklist: [], keyFacts: [], worked: [], errors: [], tips: []
  },

  // Example: Physics - separate bucket, will NEVER show maths
  "newtons-laws": {
    subject: "physics", title: "Newton's Laws",
    formulas: [{ f: "F_net = m*a", desc: "Newton's 2nd Law" }, { f: "F_g = m*g", desc: "Weight" }, { f: "f_s max = μ_s*N", desc: "Max static friction" }],
    keyTerms: [], intro: "", checklist: [], keyFacts: [], worked: [], errors: [], tips: []
  },
  "vectors": {
    subject: "physics", title: "Vectors",
    formulas: [{ f: "R_x = F1cosθ1 + F2cosθ2", desc: "Resultant x" }, { f: "R = √(R_x²+R_y²)", desc: "Resultant magnitude" }],
    keyTerms: [], intro: "", checklist: [], keyFacts: [], worked: [], errors: [], tips: []
  }
}

export function buildNodesForTopic(topicId: string, subjectId: string) {
  const t = topicId.toLowerCase().trim().replace(/\s+/g, "-")
  const s = subjectId.toLowerCase().trim()
  const data = CAPS_DB[t]

  if (!data) return null // shows "Add to CAPS_DB" not Maths

  // CRITICAL GUARD - stops Maths leaking into Physics
  if (s.includes("physical") || s.includes("physics") || s.includes("science")) {
    if (data.subject!== "physics") return null
  } else {
    if (data.subject!== "maths") return null
  }

  return {
    title: data.title,
    breadcrumbs: data.breadcrumbs || [data.subject, data.title],
    nodes: [
      { id: "A", label: "Exam Hook", sub: data.title, data: data },
      { id: "B", label: "Learn The Concept", sub: "Worked Examples", data: data },
      { id: "C", label: "Worked Example", sub: "Common Mistakes", data: data },
      { id: "D", label: "Examiner Traps", sub: "Exam Strategy", data: data },
      { id: "E", label: "Exam Challenge", sub: "Formulas & Checklist", data: data },
    ]
  }
}
