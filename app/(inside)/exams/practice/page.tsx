"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// OFFICIAL MIND THE GAP
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
    if (raw.match(/analytical|inclination|distance.*midpoint|circle.*centre|circle.*radius/)) return "Unit 9: Analytical Geometry";
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
    if (raw.match(/work.*energy|work-energy|power.*energy/)) return "Unit 4: Work, energy and power";
    if (raw.match(/electrostatics|coulomb|electric field/)) return "Unit 6: Electrostatics";
    if (raw.match(/ohms|internal resistance|electric circuits|emf.*circuit/)) return "Unit 7: Electric circuits";
    if (raw.match(/generator|motor|alternating current|ac and dc|electrodynamics/)) return "Unit 8: Electrodynamics - Electrical machines";
    if (raw.match(/photoelectric|optical|electromagnetic wave/)) return "Unit 9: Optical phenomena and properties of materials";
    if (raw.match(/emission spectra|absorption spectra/)) return "Unit 10: Emission and absorption spectra";
    if (raw.match(/organic|iupac|homologous|polymer|plastic/)) return "Unit 11: Organic compounds and macromolecules";
    if (raw.match(/rate.*reaction|collision theory|activation energy|catalyst|Δh|enthalpy/)) return "Unit 12: Rate and extent of reactions";
    if (raw.match(/equilibrium|le chatelier|kc/)) return "Unit 13: Chemical equilibrium";
    if (raw.match(/acid|base|ph |ka|kb|kw|titration|conjugate|ampholyte|salt hydrolysis/)) return "Unit 14: Acids and bases";
    if (raw.match(/electrochemistry|galvanic|voltaic|electrolytic|electrode potential|emf/)) return "Unit 15: Electrochemistry";
    if (raw.match(/chlor-alkali|chlor alkali/)) return "Unit 16: The chlor-alkali industry";
    return "Unit 1: Mechanics - Force and Newtons Laws";
  }
}

export default function PracticeEngine(){
  const router = useRouter();
  const [questions,setQuestions]=useState<any[]>([]);
  const [subjects,setSubjects]=useState<string[]>([]);
  const [units,setUnits]=useState<string[]>([]);
  const [topics,setTopics]=useState<string[]>([]);
  const [difficulties,setDifficulties]=useState<string[]>([]);
  const [subject,setSubject]=useState("");
  const [unit,setUnit]=useState("All units");
  const [topic,setTopic]=useState("All topics");
  const [difficulty,setDifficulty]=useState("All");
  const [count,setCount]=useState(10);

  useEffect(()=>{
    async function load(){
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
      setQuestions(allData);
      const rawSubs = allData.map((q:any)=>q.subject).filter(Boolean);
      const lowerMap = new Map<string,string>();
      rawSubs.forEach((s:string)=>{
        const low = s.toLowerCase().trim().replace(/-/g," ");
        if(!lowerMap.has(low)){
          if(low.includes("physical")) lowerMap.set(low, "Physical Sciences");
          else if(low.includes("math")) lowerMap.set(low, "Mathematics");
          else lowerMap.set(low, s);
        }
      });
      const subs = [...lowerMap.values()].sort();
      setSubjects(subs);
      if(subs.length>0 &&!subject) setSubject(subs[0]);
      const diffs = [...new Set(allData.map((q:any)=>q.difficulty_l || q.difficulty_label).filter(Boolean))].sort();
      setDifficulties(["All",...diffs]);
    }
    load();
  },[]);

  useEffect(()=>{
    if(!subject || questions.length===0) return;
    const subjKey = subject.toLowerCase().includes("physical")? "Physical Sciences" : "Mathematics";
    const officialUnits = Object.keys(MTG[subjKey] || MTG["Mathematics"]);
    setUnits(["All units",...officialUnits]);
    const allTopicsForSubject: string[] = [];
    Object.values(MTG[subjKey] || MTG["Mathematics"]).forEach((arr:any)=> allTopicsForSubject.push(...arr));
    setTopics(["All topics",...Array.from(new Set(allTopicsForSubject)).sort()]);
    setUnit("All units");
    setTopic("All topics");
  },[subject, questions]);

  useEffect(()=>{
    if(!subject) return;
    const subjKey = subject.toLowerCase().includes("physical")? "Physical Sciences" : "Mathematics";
    if(unit==="All units"){
      const allTopicsForSubject: string[] = [];
      Object.values(MTG[subjKey] || {}).forEach((arr:any)=> allTopicsForSubject.push(...arr));
      setTopics(["All topics",...Array.from(new Set(allTopicsForSubject)).sort()]);
    } else {
      const unitTopics = (MTG[subjKey] && MTG[subjKey][unit])? MTG[subjKey][unit] : [];
      setTopics(["All topics",...unitTopics]);
    }
    setTopic("All topics");
  },[unit, subject]);

  function startSession(){
    router.push(`/exams/practice/session?subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}&topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&count=${count}`);
  }

  const filteredCount = questions.filter((q:any)=>{
    if(subject && (q.subject||"").toLowerCase().replace(/-/g," ")!== subject.toLowerCase().replace(/-/g," ")) return false;
    if(unit!=="All units"){
      const official = findOfficialUnit(subject, q);
      if(official!==unit) return false;
    }
    if(topic!=="All topics"){
      const raw = `${q.unit||""} ${q.topic||""} ${q.topic_path||""} ${q.question_text||""}`.toLowerCase();
      if(!raw.includes(topic.toLowerCase())) return false;
    }
    if(difficulty!=="All" && (q.difficulty_l!==difficulty && q.difficulty_label!==difficulty)) return false;
    return true;
  }).length;

  return(
    <div style={{padding:"12px 12px 90px", background:"#0a0a12", minHeight:"100vh", color:"white"}}>
      <div onClick={()=>router.push("/exams")} style={{fontSize:14,color:"#9ca3af",cursor:"pointer"}}>← Back to Exams</div>
      <div style={{fontSize:26,fontWeight:900,marginTop:12}}>Practice Engine</div>
      <div style={{fontSize:13,color:"#9ca3af",marginTop:6}}>Official Mind the Gap units • {questions.length} total in DB • Topics auto-filter by Unit</div>
      <div style={{marginTop:18, display:"flex", flexDirection:"column", gap:14}}>
        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>SUBJECT - {subjects.length} found in DB</div>
          <select value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {subjects.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>UNIT - Official Mind the Gap - {units.length-1} units for {subject}</div>
          <select value={unit} onChange={e=>setUnit(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {units.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>TOPIC - {topics.length-1} official subtopics for {unit==="All units"? subject : unit}</div>
          <select value={topic} onChange={e=>setTopic(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {topics.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{fontSize:10,color:"#22c55e",marginTop:8}}>{questions.length} total questions in DB • {filteredCount} match current filters ✅</div>
          {filteredCount>0 && filteredCount < count && (
            <div style={{fontSize:10,color:"#fbbf24",marginTop:6, background:"#422006", padding:6, borderRadius:8, border:"1px solid #854d0e"}}>⚠️ You asked for {count} but only {filteredCount} exist for {unit} → {topic}. Try All topics.</div>
          )}
        </div>
        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>DIFFICULTY - {difficulties.length-1} levels from DB</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
            {difficulties.map(d=>(
              <button key={d} onClick={()=>setDifficulty(d)} style={{padding:12,borderRadius:999,border:"1px solid #2a2a3a",background:difficulty===d?"#4f46e5":"#0f0f14",color:"white", fontSize:13}}>{d}</button>
            ))}
          </div>
        </div>
        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}># QUESTION COUNT</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginTop:10}}>
            {[5,10,20,50].map(n=>(
              <button key={n} onClick={()=>setCount(n)} style={{padding:12,borderRadius:999,border:"1px solid #2a2a3a",background:count===n?"#4f46e5":"#0f0f14",color:"white"}}>{n}</button>
            ))}
          </div>
        </div>
        <button disabled={filteredCount===0} onClick={startSession} style={{marginTop:6,background:filteredCount===0?"#333":"white",color:filteredCount===0?"#777":"black",padding:16,borderRadius:14,fontWeight:900,fontSize:15,border:"none"}}>
          {filteredCount===0? `No questions for this filter` : `Start Session → ${Math.min(count,filteredCount)} Questions • ${subject}`}
        </button>
      </div>
    </div>
  )
}
