"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import 'katex/dist/katex.min.css'
import katex from 'katex'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// --- FINAL GENERAL CLEANER - FIXES OLD 1000 BATCH: infty, ext{}, R, ^(x), log_2 ---
function cleanLatex(input: any): string {
  if (!input) return "";
  let t = String(input);

  // Fast exit for clean 2350
  if (!/ext|rac|frac|qrt|infty|\\t|\bR\b|10\^|log_/i.test(t)) return t;

  // 1. Remove empty wrappers like ext{ } and ext{}
  t = t.replace(/\\?ext\s*\{\s*\}/gi, "");
  t = t.replace(/\[R\s*0,?/gi, "[0,");
  t = t.replace(/\[R/gi, "[");
  t = t.replace(/\bR\s+(?=\d|10\^|log|\\log)/gi, ""); // R 10^x -> 10^x

  // 2. Fix \infty - your main bug: \t infty, infty, \tinfty
  t = t.replace(/\\t\s*infty/gi, "\\infty");
  t = t.replace(/\\tinfty/gi, "\\infty");
  t = t.replace(/\\t\b/gi, "\\");
  t = t.replace(/\binfty\b/gi, "\\infty");

  // 3. Fix log/ln/text/frac
  t = t.replace(/\\?ext\s*\{\s*log\s*\}/gi, "\\log");
  t = t.replace(/\\?ext\s*\{\s*ln\s*\}/gi, "\\ln");
  t = t.replace(/ext\s*log/gi, "\\log");
  t = t.replace(/ext\s*ln/gi, "\\ln");
  t = t.replace(/\\?ext\s*\{/gi, "\\text{");
  t = t.replace(/\\?ext\b/gi, "\\text");

  t = t.replace(/(^|[^a-z\\])rac\s*\{/gi, "$1\\frac{");
  t = t.replace(/(^|[^a-z\\])frac\s*\{/gi, "$1\\frac{");
  t = t.replace(/(^|[^a-z\\])qrt\s*\{/gi, "$1\\sqrt{");
  t = t.replace(/(^|[^a-z\\])sqrt\s*\{/gi, "$1\\sqrt{");
  t = t.replace(/\blog_(\d+)\((.*?)\)/gi, "\\log_{$1}($2)");
  t = t.replace(/\blog_(\d+)/gi, "\\log_{$1}");
  t = t.replace(/\blog\b/gi, "\\log");

  // 4. Fix exponents 10^(x) -> 10^{x}
  t = t.replace(/10\^\(([^)]+)\)/g, "10^{$1}");
  t = t.replace(/(\d+)\^\(([^)]+)\)/g, "$1^{$2}");
  t = t.replace(/(\d+)\^x/gi, "$1^{x}");
  t = t.replace(/\^x/gi, "^{x}");

  // 5. Clean double spaces and stray "ext"
  t = t.replace(/\bext\b/gi, "");
  t = t.replace(/\s{2,}/g, " ");

  return t;
}

function MathText({ text }: { text: any }) {
  if (!text) return null;
  let raw = String(text);
  if (!raw.includes("$")) {
    raw = cleanLatex(raw);
    if (/\\(frac|log|ln|sqrt|infty)/.test(raw)) {
      if (!raw.startsWith("$")) raw = `$${raw}$`;
    }
  } else {
    raw = raw.split("$").map((p,i)=> i%2===1? cleanLatex(p) : p).join("$");
  }
  raw = raw.replace(/\\\(/g, "$").replace(/\\\)/g, "$").replace(/\\\[|\\\]/g, "$");
  const parts = raw.split("$");
  return (
    <span style={{lineHeight:"1.6"}}>
      {parts.map((p, i) => {
        if (i % 2 === 1 && p.trim()) {
          try {
            const html = katex.renderToString(p, { throwOnError: false, displayMode: false, strict: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch { return <span key={i}>{p}</span>; }
        }
        return <span key={i} style={{whiteSpace:"pre-wrap"}}>{p}</span>;
      })}
    </span>
  );
}

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

function findOfficialUnit(subject: string, q: any): string {
  const isPhys = (subject||"").toLowerCase().includes("physical") || (q.subject||"").toLowerCase().includes("physical");
  const subjKey = isPhys? "Physical Sciences" : "Mathematics";
  const raw = `${q.unit||""} ${q.topic||""} ${q.topic_path||""} ${q.question_text||""}`.toLowerCase();
  const unitsObj = MTG[subjKey];
  for (const [unitName, topics] of Object.entries(unitsObj)) {
    for (const t of topics as string[]) {
      const tLow = t.toLowerCase();
      if (tLow.length > 3 && raw.includes(tLow)) return unitName;
    }
  }
  if (subjKey === "Mathematics") {
    if (raw.match(/interest|annuity|present value|future value|nominal|decay|depreci/)) return "Unit 6: Finance, growth and decay";
    if (raw.match(/sequence|series|sigma/)) return "Unit 3: Number patterns, sequences and series";
    if (raw.match(/probability|permutation|combination|counting|venn/)) return "Unit 8: Probability";
    if (raw.includes("area rule") || raw.includes("sine rule") || raw.includes("cosine rule") || raw.includes("2d and 3d")) return "Unit 11: Trigonometry - Sine, cosine and area rules";
    if (raw.match(/statistics|regression|correlation|box and whisker|quartile|ogive|variance|standard deviation|histogram|scatter/)) return "Unit 13: Statistics";
    if (raw.match(/calculus|derivative|differentiation|first principles|cubic/)) return "Unit 7: Calculus";
    if (raw.match(/analytical|inclination|distance.*midpoint|circle.*centre|circle.*radius|circles in analytical/)) return "Unit 9: Analytical Geometry";
    if (raw.match(/euclidean|circle theorem|cyclic|tangent chord|similarity|proportionality/)) return "Unit 12: Euclidean Geometry";
    if (raw.match(/trig function|amplitude|vertical shift|period|horizontal shift|graphs of trigonometric/)) return "Unit 5: Trig functions";
    if (raw.match(/trig|simplif.*trig|identity|compound angle|double angle|reduction|co-function/)) return "Unit 10: Trigonometry";
    if (raw.match(/function|parabola|hyperbola|logarithmic|inverse function/)) return "Unit 4: Functions";
    if (raw.match(/exponent|surd|irrational/)) return "Unit 1: Exponents and surds";
    return "Unit 2: Algebra";
  } else {
    if (raw.match(/doppler|redshift|blueshift|ultrasound/)) return "Unit 5: Doppler Effect";
    if (raw.match(/momentum|impulse|collision/)) return "Unit 2: Momentum and impulse";
    if (raw.match(/projectile|free fall|bouncing ball/)) return "Unit 3: Vertical projectile motion in 1D";
    if (raw.match(/work.*energy|work-energy/)) return "Unit 4: Work, energy and power";
    if (raw.match(/electrostatics|coulomb|electric field/)) return "Unit 6: Electrostatics";
    if (raw.match(/ohms|internal resistance|electric circuits/)) return "Unit 7: Electric circuits";
    if (raw.match(/generator|motor|alternating current|electrodynamics/)) return "Unit 8: Electrodynamics - Electrical machines";
    if (raw.match(/photoelectric|optical|electromagnetic wave/)) return "Unit 9: Optical phenomena and properties of materials";
    if (raw.match(/emission spectra|absorption spectra/)) return "Unit 10: Emission and absorption spectra";
    if (raw.match(/organic|iupac|homologous|polymer|plastic/)) return "Unit 11: Organic compounds and macromolecules";
    if (raw.match(/rate.*reaction|collision theory|activation energy|catalyst/)) return "Unit 12: Rate and extent of reactions";
    if (raw.match(/equilibrium|le chatelier|kc/)) return "Unit 13: Chemical equilibrium";
    if (raw.match(/acid|base|ph |ka|kb|kw|titration|conjugate/)) return "Unit 14: Acids and bases";
    if (raw.match(/electrochemistry|galvanic|voltaic|electrolytic|electrode potential/)) return "Unit 15: Electrochemistry";
    if (raw.match(/chlor-alkali/)) return "Unit 16: The chlor-alkali industry";
    return "Unit 1: Mechanics - Force and Newtons Laws";
  }
}

function getOptions(q:any): string[] {
  try {
    const o = typeof q.options === "string"? JSON.parse(q.options) : q.options;
    return Array.isArray(o)? o : [];
  } catch { return []; }
}
function getCorrectText(q:any): string {
  const opts = getOptions(q);
  const ca = (q.correct_answer?? "").toString().trim();
  if (!ca) return "";
  if (/^[0-3]$/.test(ca) && opts[Number(ca)]) return opts[Number(ca)];
  if (/^[1-4]$/.test(ca) && opts[Number(ca)-1]) return opts[Number(ca)-1];
  if (/^[A-D]$/i.test(ca) && opts[ca.toUpperCase().charCodeAt(0)-65]) return opts[ca.toUpperCase().charCodeAt(0)-65];
  return ca;
}
function normalize(s:string){ return s.toLowerCase().replace(/\s+/g,"").replace(/\\[\(\)]/g,"").replace(/[*×]/g,"*").trim(); }
function autoMarkLong(userAns:string, q:any){
  const ca = (q.correct_answer||"").toString();
  const memo = (q.explanation||"").toString();
  const fullCorrect = (ca + " " + memo).toLowerCase();
  const userNorm = normalize(userAns);
  const correctNorm = normalize(ca);
  if(!userNorm) return { correct:false, marks:0, reason:"No answer" };
  if(userNorm === correctNorm) return { correct:true, marks:q.marks, reason:"Exact match" };
  const numRegex = /-?\d+(\.\d+)?/g;
  const correctNums = (ca.match(numRegex)||[]).map((n:string)=>normalize(n));
  const userNums = (userAns.match(numRegex)||[]).map((n:string)=>normalize(n));
  if(correctNums.length>0){
    let matched = correctNums.filter((n:string)=> userNums.includes(n) || userNorm.includes(n)).length;
    if(matched>0){
      const ratio = matched / correctNums.length;
      if(ratio===1) return { correct:true, marks:q.marks, reason:`All values: ${correctNums.join(", ")}` };
      if(ratio>=0.5) return { correct:false, marks: Math.max(1, Math.round(ratio*q.marks)), reason:`Partial - found ${matched}/${correctNums.length}` };
    }
  }
  const keywords = fullCorrect.split(/[^a-z0-9]+/).filter((w:string)=>w.length>3);
  const keyMatched = keywords.filter((k:string)=> userAns.toLowerCase().includes(k)).length;
  if(keywords.length>0 && keyMatched / keywords.length >= 0.6){ return { correct:true, marks:q.marks, reason:"Key terms matched" }; }
  if(userNorm.length>=3 && (correctNorm.includes(userNorm) || fullCorrect.replace(/\s+/g,"").includes(userNorm))){ return { correct:true, marks:q.marks, reason:"Contains answer" }; }
  return { correct:false, marks:0, reason:`Expected: ${ca || memo.slice(0,80)}` };
}

function SessionInner(){
  const router = useRouter();
  const params = useSearchParams();
  const [qs,setQs]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState<string|null>(null);
  const [textAns,setTextAns]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const [scores,setScores]=useState<any[]>([]);

  useEffect(()=>{
    async function load(){
      const subject = params.get("subject")||"";
      const unit = params.get("unit")||"All units";
      const topic = params.get("topic")||"All topics";
      const difficulty = params.get("difficulty")||"All";
      const count = Number(params.get("count")||10);
      let allData: any[] = [];
      let from = 0;
      const batchSize = 1000;
      while(true){
        const { data } = await supabase.from("questions").select("*").eq("review_status","approved").range(from, from + batchSize - 1);
        if(!data || data.length===0) break;
        allData = [...allData,...data];
        if(data.length < batchSize) break;
        from += batchSize;
      }
      let f = allData;
      if(subject) f = f.filter((q:any)=>(q.subject||"").toLowerCase().replace(/-/g," ").trim() === subject.toLowerCase().replace(/-/g," ").trim());
      if(!unit.includes("All")){
        f = f.filter((q:any)=> findOfficialUnit(subject,q) === unit);
      }
      if(!topic.includes("All")){
        const tLow = topic.toLowerCase();
        const words = tLow.split(/[^a-z0-9]+/).filter((w:string)=>w.length>3);
        f = f.filter((q:any)=>{
          const raw = `${q.unit||""} ${q.topic||""} ${q.topic_path||""} ${q.question_text||""}`.toLowerCase();
          const hasWord = words.some((w:string)=> raw.includes(w));
          return raw.includes(tLow) || hasWord;
        });
      }
      if(difficulty!=="All") f = f.filter((q:any)=>q.difficulty_l===difficulty || q.difficulty_label===difficulty);
      setQs(f.sort(()=>0.5-Math.random()).slice(0,count));
      setLoading(false);
    }
    load();
  },[params]);

  function handleSubmit(){
    const q = qs[idx];
    const opts = getOptions(q);
    let result:any;
    if(opts.length>0){
      const correctText = getCorrectText(q);
      const isCorrect = (selected||"").trim().toLowerCase() === correctText.trim().toLowerCase();
      result = { correct:isCorrect, marks: isCorrect? q.marks:0, correctText, reason: isCorrect? "Correct option":"Wrong option" };
    } else {
      const auto = autoMarkLong(textAns, q);
      result = { correct:auto.correct, marks:auto.marks, correctText: getCorrectText(q) || q.explanation, reason:auto.reason };
    }
    const newEntry = { qId: q.id, question: q, userAnswer: opts.length>0? selected:textAns, correctText: result.correctText, correct: result.correct, marks: result.marks, total: q.marks, reason: result.reason };
    setScores(prev=> [...prev.filter((s:any)=>s.qId!==q.id), newEntry]);
    setSubmitted(true);
  }
  function next(){
    if(idx<qs.length-1){ setIdx(idx+1); setSelected(null); setTextAns(""); setSubmitted(false); }
    else {
      const total = scores.reduce((a:number,b:any)=>a+b.marks,0);
      const max = qs.reduce((a:number,b:any)=>a+(b.marks||0),0);
      localStorage.setItem("matric360_last_session", JSON.stringify({ qs, scores, subject: params.get("subject"), date: new Date().toISOString(), total, max }));
      router.push("/exams/practice/result");
    }
  }

  if(loading) return <div style={{padding:20, background:"#0a0a12", color:"white", minHeight:"100vh"}}>Loading...</div>;
  if(qs.length===0) return <div style={{padding:20, background:"#0a0a12", color:"white", minHeight:"100vh"}}>No questions found for {params.get("unit")} → {params.get("topic")} <button onClick={()=>router.push("/exams/practice")}>Back</button></div>;

  const q = qs[idx];
  if(!q) return null;
  const opts = getOptions(q);
  const isLong = opts.length===0;
  const totalScore = scores.reduce((a:number,b:any)=>a+b.marks,0);
  const totalMax = qs.reduce((a:number,b:any)=>a+(b.marks||0),0);
  const currentScore = scores.find((s:any)=>s.qId===q.id);

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", color:"white", paddingBottom:80}}>
      <div style={{padding:"12px 16px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid #1a1a2e"}}>
        <span style={{fontSize:14, color:"#9ca3af"}}>Question {idx+1} / {qs.length}</span>
        <span style={{fontSize:14, color:"#9ca3af"}}>Score: {totalScore} / {totalMax}</span>
      </div>
      <div style={{height:4, background:"#1a1a2e"}}><div style={{height:4, background:"#818cf8", width:`${((idx)/qs.length)*100}%`, transition:"0.3s"}} /></div>
      <div style={{padding:16}}>
        <div style={{background:"#15151f", borderRadius:20, padding:16, border:"1px solid #222"}}>
          <div style={{fontSize:11, color:"#9ca3af"}}>{(q.question_type|| (isLong?"LONG_QUESTION":"MCQ")).toUpperCase()} · {q.marks} MARKS · {q.difficulty_l||q.difficulty_label} {q.topic_path? `· ${q.topic_path}`: ""}</div>
          <div style={{marginTop:8, fontSize:16, lineHeight:1.5}}><MathText text={q.question_text} /></div>
          {!submitted? (
            isLong? (
              <>
                <textarea value={textAns} onChange={(e:any)=>setTextAns(e.target.value)} placeholder="Write your full answer here..." style={{marginTop:16, width:"100%", minHeight:120, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14, color:"white"}}/>
                <button onClick={handleSubmit} disabled={!textAns.trim()} style={{width:"100%", marginTop:12, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none", opacity: textAns.trim()?1:0.5}}>Submit answer</button>
                <div style={{fontSize:11, color:"#9ca3af", marginTop:8}}>Auto-marked by system • No self-marking</div>
              </>
            ) : (
              <>
                <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
                  {opts.map((o:string,i:number)=><div key={i} onClick={()=>setSelected(o)} style={{padding:"14px 16px", borderRadius:999, border:"1px solid", borderColor:selected===o?"#818cf8":"#2a2a3a", background:selected===o?"#1e1b4b":"#0f0f14", cursor:"pointer"}}><MathText text={o} /></div>)}
                </div>
                <button onClick={handleSubmit} disabled={!selected} style={{width:"100%", marginTop:16, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none", opacity:selected?1:0.5}}>Submit answer</button>
              </>
            )
          ) : (
            <>
              {isLong && <div style={{marginTop:16, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14, color:"#d1d5db"}}><b>Your answer:</b> {textAns}</div>}
              <div style={{marginTop:16, padding:14, borderRadius:16, border:"1px solid", borderColor: currentScore?.correct? "#22c55e": (currentScore?.marks>0? "#f59e0b":"#ef4444"), background: currentScore?.correct? "#052e16": (currentScore?.marks>0? "#422006":"#450a0a")}}>
                <div style={{fontWeight:800, display:"flex", justifyContent:"space-between"}}><span>{currentScore?.correct? "✓ Correct": (currentScore?.marks>0? `~ Partial · ${currentScore?.marks}/${q.marks}`: `✗ Incorrect · 0/${q.marks}`)}</span><span style={{fontSize:11, opacity:0.8}}>{currentScore?.reason}</span></div>
                <div style={{fontSize:13, marginTop:6}}><b>Answer:</b> <MathText text={currentScore?.correctText || getCorrectText(q)} /></div>
                {q.explanation && <div style={{fontSize:13, marginTop:8, color:"#d1d5db"}}><b>Memo:</b> <MathText text={q.explanation} /></div>}
              </div>
              <button onClick={next} style={{width:"100%", marginTop:16, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none"}}>{idx<qs.length-1?"Next question →":"Finish → View Results"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default function SessionPage(){
  return(
    <Suspense fallback={<div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading...</div>}>
      <SessionInner/>
    </Suspense>
  )
}
