// @ts-nocheck
export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

// OFFICIAL MIND THE GAP - FOR MAPPING
const MTG: any = {
  Mathematics: {
    "Unit 1: Exponents and surds": ["The number system","Working with irrational numbers","Exponents","Exponential equations","Equations with rational exponents","Exam type examples"],
    "Unit 2: Algebra": ["Algebraic expressions","Addition and subtraction","Multiplication and division","Factorising","Notes on factorising a trinomial","Quadratic equations","Quadratic inequalities","Simultaneous equations","The nature of the roots"],
    "Unit 3: Number patterns, sequences and series": ["Number patterns","Arithmetic sequences","Quadratic sequences","Geometric sequences","Arithmetic and geometric series","Sigma notation"],
    "Unit 4: Functions": ["What is a function?","Function notation","The basic functions, formulas and graphs","Inverse functions","The logarithmic function","Transformation of functions"],
    "Unit 5: Trig functions": ["Graphs of trigonometric functions","The effect of a on amplitude","The effect of q on vertical shift","The effect of b on period","The effect of p on horizontal shift"],
    "Unit 6: Finance, growth and decay": ["Simple and compound interest","Calculating P, i and n","Simple and compound decay","Nominal and effective interest rates","Investments with time and interest rate changes","Annuities","Future Value Annuity","Present Value","Future Value"],
    "Unit 7: Calculus": ["Average gradient","Average rate of change","Derivative of a function at a point","Uses of the derivative","Drawing graph of cubic polynomial","First principles","Rules of differentiation","Tangent to curve","Maxima and minima","Calculus"],
    "Unit 8: Probability": ["Theoretical probability","Venn diagrams","Mutually exclusive events","Complementary events","Tree diagrams","Contingency tables","Counting principles","Permutations","Combinations","Fundamental counting principle"],
    "Unit 9: Analytical Geometry": ["Analytical Geometry","The equation of a line","The inclination of a line","Circles in analytical geometry","Distance and midpoint formula"],
    "Unit 10: Trigonometry": ["Trig ratios","Trig ratios in all quadrants","Trig ratios of special angles","Reduction formulae","Trigonometric identities","Solving trigonometric equations","Compound and double angle identities","Co-functions"],
    "Unit 11: Trigonometry - Sine, cosine and area rules": ["Right-angled triangles","Area rule","Sine rule","Cosine rule","Problems in two and three dimensions","2D and 3D Problems"],
    "Unit 12: Euclidean Geometry": ["Proportion and area of triangles","Proportion theorems","Similar polygons","Circle theorems","Cyclic quadrilaterals","Similarity and proportionality","Midpoint Theorem","Tangent chord theorem"],
    "Unit 13: Statistics": ["Bar graphs and frequency tables","Measures of central tendency","Measures of dispersion","Five number summary and box and whisker plot","Histograms and frequency polygons","Cumulative frequency and ogives","Variance and standard deviation","Bivariate data and scatter plot","Linear regression line","Correlation coefficient","Quartiles"],
  },
  "Physical Sciences": {
    "Unit 1: Mechanics - Force and Newtons Laws": ["Vectors","Force","Force diagrams","Resultant net force","Newtons First Law","Newtons Second Law","Newtons Third Law","Universal Gravitation","Mass and weight","Velocity and acceleration"],
    "Unit 2: Momentum and impulse": ["Momentum","Change in momentum","Impulse","Conservation of linear momentum","Elastic and inelastic collisions"],
    "Unit 3: Vertical projectile motion in 1D": ["Graphs of velocity","Free fall","Dropping a projectile","Projectile shot up then falls","Bouncing ball","Projectile motion"],
    "Unit 4: Work, energy and power": ["Work","Energy","Power","Work-energy theorem","Conservation of energy"],
    "Unit 5: Doppler Effect": ["Waves","Doppler Effect","Ultrasound waves","Redshift and blueshift","Applications with light"],
    "Unit 6: Electrostatics": ["Electrical charge","Conservation of Charge","Coulombs Law","Electric fields","Electric field strength"],
    "Unit 7: Electric circuits": ["Resistance of a wire","Ohms Law","Voltage and emf","Internal Resistance","Electric energy","Power","Electric circuits"],
    "Unit 8: Electrodynamics - Electrical machines": ["Motors and generators","Alternating current","AC and DC","Electrical machines"],
    "Unit 9: Optical phenomena and properties of materials": ["Electromagnetic waves","Visible light","Photoelectric effect","Optical phenomena"],
    "Unit 10: Emission and absorption spectra": ["Continuous emission spectra","Atomic emission spectra","Atomic absorption spectra"],
    "Unit 11: Organic compounds and macromolecules": ["Organic compounds","Physical properties and structure","IUPAC Naming","Homologous series","Reactions of organic compounds","Plastics and polymers","Plastics and pollution"],
    "Unit 12: Rate and extent of reactions": ["Energy changes","Activation energy","Catalysts","ΔH","Endothermic and exothermic","Rates of reactions","Collision Theory","Measuring rates"],
    "Unit 13: Chemical equilibrium": ["Le Chateliers Principle","Equilibrium Constant Kc","Chemical equilibrium","Factors that influence equilibrium","Graphs for chemical systems"],
    "Unit 14: Acids and bases": ["Properties of acids and bases","Conjugate acid-base pairs","Ampholyte","Salt hydrolysis","Acid-base indicators","Acid-base titrations","Ka and Kb","Kw","pH scale","pH Calculations","Titration calculations"],
    "Unit 15: Electrochemistry": ["Electrochemical cells","Electrolytic cells","Voltaic Galvanic cells","Cell notation","Standard electrode potentials","Emf of electrochemical cell"],
    "Unit 16: The chlor-alkali industry": ["Chlor-alkali industry","Chlor-alkali reactants and products","Industrial process"],
  }
};

function findOfficialUnit(subject: string, rawTopic: string): {unit: string, officialTopic: string} {
  const isPhys = (subject||"").toLowerCase().includes("physical");
  const subjKey = isPhys? "Physical Sciences" : "Mathematics";
  const raw = rawTopic.toLowerCase();
  const unitsObj = MTG[subjKey];
  for (const [unitName, topics] of Object.entries(unitsObj)) {
    for (const t of topics as string[]) {
      if(raw.includes(t.toLowerCase()) || t.toLowerCase().includes(raw)) {
        return {unit: unitName, officialTopic: t};
      }
    }
  }
  if(subjKey==="Mathematics"){
    if(raw.match(/interest|annuity|future value|present value|finance/)) return {unit:"Unit 6: Finance, growth and decay", officialTopic: rawTopic};
    if(raw.match(/sequence|series|sigma/)) return {unit:"Unit 3: Number patterns, sequences and series", officialTopic: rawTopic};
    if(raw.match(/probab|permutation|combination|venn/)) return {unit:"Unit 8: Probability", officialTopic: rawTopic};
    if(raw.match(/sine rule|cosine rule|area rule/)) return {unit:"Unit 11: Trigonometry - Sine, cosine and area rules", officialTopic: rawTopic};
    if(raw.match(/statistics|regression|ogive|quartile|box|variance|histogram/)) return {unit:"Unit 13: Statistics", officialTopic: rawTopic};
    if(raw.match(/calculus|derivative|differentiation|first principles/)) return {unit:"Unit 7: Calculus", officialTopic: rawTopic};
    if(raw.match(/analytical/)) return {unit:"Unit 9: Analytical Geometry", officialTopic: rawTopic};
    if(raw.match(/euclidean|circle theorem|cyclic/)) return {unit:"Unit 12: Euclidean Geometry", officialTopic: rawTopic};
    if(raw.match(/trig function|amplitude|vertical shift/)) return {unit:"Unit 5: Trig functions", officialTopic: rawTopic};
    if(raw.match(/trig|identity|reduction/)) return {unit:"Unit 10: Trigonometry", officialTopic: rawTopic};
    if(raw.match(/function|parabola|hyperbola|logarithm/)) return {unit:"Unit 4: Functions", officialTopic: rawTopic};
    if(raw.match(/exponent|surd/)) return {unit:"Unit 1: Exponents and surds", officialTopic: rawTopic};
    return {unit:"Unit 2: Algebra", officialTopic: rawTopic};
  } else {
    if(raw.match(/doppler|redshift/)) return {unit:"Unit 5: Doppler Effect", officialTopic: rawTopic};
    if(raw.match(/momentum|impulse|collision/)) return {unit:"Unit 2: Momentum and impulse", officialTopic: rawTopic};
    if(raw.match(/projectile|free fall/)) return {unit:"Unit 3: Vertical projectile motion in 1D", officialTopic: rawTopic};
    if(raw.match(/work|energy|power/)) return {unit:"Unit 4: Work, energy and power", officialTopic: rawTopic};
    if(raw.match(/electrostatics|coulomb|electric field/)) return {unit:"Unit 6: Electrostatics", officialTopic: rawTopic};
    if(raw.match(/ohms|circuit|internal resistance/)) return {unit:"Unit 7: Electric circuits", officialTopic: rawTopic};
    if(raw.match(/generator|motor|alternating/)) return {unit:"Unit 8: Electrodynamics - Electrical machines", officialTopic: rawTopic};
    if(raw.match(/photoelectric|optical/)) return {unit:"Unit 9: Optical phenomena and properties of materials", officialTopic: rawTopic};
    if(raw.match(/emission spectra|absorption spectra/)) return {unit:"Unit 10: Emission and absorption spectra", officialTopic: rawTopic};
    if(raw.match(/organic|iupac|polymer/)) return {unit:"Unit 11: Organic compounds and macromolecules", officialTopic: rawTopic};
    if(raw.match(/rate.*reaction|collision theory/)) return {unit:"Unit 12: Rate and extent of reactions", officialTopic: rawTopic};
    if(raw.match(/equilibrium|le chatelier|kc/)) return {unit:"Unit 13: Chemical equilibrium", officialTopic: rawTopic};
    if(raw.match(/acid|base|ph |titration/)) return {unit:"Unit 14: Acids and bases", officialTopic: rawTopic};
    if(raw.match(/electrochemistry|galvanic|voltaic/)) return {unit:"Unit 15: Electrochemistry", officialTopic: rawTopic};
    if(raw.match(/chlor-alkali/)) return {unit:"Unit 16: The chlor-alkali industry", officialTopic: rawTopic};
    return {unit:"Unit 1: Mechanics - Force and Newtons Laws", officialTopic: rawTopic};
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const batch = parseInt(searchParams.get('batch') || '0')
  const BATCH_SIZE = 3

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: topics, error } = await supabase
.from('caps_knowledge_base')
.select('id, topic, subject, grade, caps_code')
.range(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE - 1)
.order('id')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!topics || topics.length === 0) return Response.json({ questions_created: 0, message: "No topics in this batch - done", batch, done: true })

  let totalQuestions = 0
  let errors: any[] = []

  for (const t of topics) {
    const official = findOfficialUnit(t.subject, t.topic);

    const prompt = `
You are generating Matric DBE Grade 12 exam questions for SOUTH AFRICA.

Subject: ${t.subject}
Official Unit: ${official.unit}
Official Subtopic: ${official.officialTopic}
Original CAPS code: ${t.caps_code}
Original Topic from PDF: ${t.topic}

CRITICAL RULES - NO TERM + OFFICIAL UNITS + LaTeX + SA RAND:

1. GROUPING: Must be ${t.subject} > ${official.unit} > ${official.officialTopic} - NO TERM, NO Grade
2. CURRENCY - SOUTH AFRICAN RAND ONLY:
   - NEVER use $ for money. $ is RESERVED ONLY for LaTeX math delimiters.
   - Always use R for Rand. Format: R 5 000, R 12 500, R 150, R 2 500 000 (space as thousand separator)
   - Example CORRECT: "Thandi invests R 15 000 at 8% p.a."
   - Example WRONG: "Thandi invests $15 000" or "$ 15 000"
   - For finance questions, write: "Calculate future value if R 5 000 is invested at $8\\%$ per annum" (R outside math, % inside $...$)
3. MATH FORMULAS MUST BE LaTeX with $...$:
   - Use $...$ ONLY for math: $2^{x+1}=8$, $\\sqrt{50}$, $\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$, $x=\\frac{-b}{2a}$, $\\sin^2\\theta+\\cos^2\\theta=1$, $A=P(1+i)^n$, $F=ma$
   - For percentages in math: $8\\%$, $12\\%$
4. Generate 8 questions: Mix Easy L1, Medium L2-L3, Hard L4, Exam L5
5. Return JSON ONLY: {"questions": [{"question_text": "Question with R 5 000 and $...$ math...", "topic": "${official.officialTopic}", "difficulty_l": "Medium", "difficulty_label": "Medium", "marks": 3, "correct_answer": "R 7 320 and $...$", "explanation": "Memo with R amounts and $...$ formulas"}]}

Example of correct style for Finance:
"question_text": "Thandi invests R 15 000 at $8\\%$ per annum compound interest. Calculate the future value after 3 years using $A=P(1+i)^n$."

Generate now.
`

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })

    const parsed = JSON.parse(resp.choices[0].message.content || "{}")
    const questions = parsed.questions || []

    for (const q of questions) {
      // Final safety: ensure no $ money slipped through
      let cleanQ = (q.question_text||"").replace(/\$\s*([0-9,]+)/g, "R $1").replace(/US\s*\$\s*/gi, "R ").replace(/\bDollars\b/gi, "Rand")
      let cleanA = (q.correct_answer||"").replace(/\$\s*([0-9,]+)/g, "R $1")
      let cleanE = (q.explanation||"").replace(/\$\s*([0-9,]+)/g, "R $1")

      // Fix double R
      cleanQ = cleanQ.replace(/R\s*R/g, "R ")
      cleanA = cleanA.replace(/R\s*R/g, "R ")
      cleanE = cleanE.replace(/R\s*R/g, "R ")

      const { error: insErr } = await supabase.from('questions').insert({
        question_text: cleanQ,
        subject: t.subject,
        unit: official.unit,
        topic: q.topic || official.officialTopic,
        topic_path: `${t.subject} > ${official.unit} > ${q.topic || official.officialTopic}`,
        difficulty_l: q.difficulty_l || "Medium",
        difficulty_label: q.difficulty_label || q.difficulty_l || "Medium",
        difficulty: q.difficulty_l || "Medium",
        marks: q.marks || 3,
        correct_answer: cleanA,
        explanation: cleanE,
        access: "Free",
        review_status: "approved",
        grade: 12,
        is_term_based: false,
        source_topic_id: t.id
      })

      if (insErr) {
        errors.push(insErr.message)
      } else {
        totalQuestions++
      }
    }
  }

  return Response.json({
    batch,
    questions_created: totalQuestions,
    topics_processed: topics.length,
    errors: errors.length > 0? errors.slice(0,3) : undefined,
    status: totalQuestions > 0? `SAVED ${totalQuestions} with SA RAND R and LaTeX $...$` : "FAILED",
    official_mapping_used: true,
    currency: "ZAR R"
  })
}
