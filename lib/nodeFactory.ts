// lib/nodeFactory.ts v22 — matches your new app UI + fixes Distance Midpoint
export function buildNodesForTopic(topicId: string, subjectId?: string) {
  const id = topicId.toLowerCase();
  const pretty = topicId.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase());

  const make = (title:string, formulas:any[], hookQ:string, worked:any, traps:any[]) => ({
    title,
    nodes: [
      { id:"A", label:"Exam Hook", title:`Exam Hook — ${title}`, data:{ intro:`${title} — 8-15 marks CAPS. High-yield in ${subjectId||'Grade 12'}.`, checklist:[`What is ${title}?`, `When is ${title} used?`], hookQuestion: hookQ, videoId:`${id}`, examinerTip:`Start with ${formulas[0]?.f||formulas[0]?.title||'formula'} — M mark` }},
      { id:"B", label:"Learn The Concept", title:"Learn The Concept", data:{ formulas, markdown: formulas.map((f:any)=>`${f.f||f.title} — ${f.d||f.desc||''}`).join('\n'), videoId:`${id}` }},
      { id:"C", label:"Worked Example", title:"Worked Example", data:{ worked: [worked], question: worked.q, steps: worked.steps, answer: worked.answer, finalAnswer: worked.answer }},
      { id:"D", label:"Examiner Traps", title:"Examiner Traps", data:{ errors: traps, traps, tips:["M=Method, A=Accuracy, CA=Continued Accuracy"] }},
      { id:"E", label:"Exam Challenge", title:"Exam Challenge", data:{ formulas: formulas.slice(0,3), checklist:["Formula?","Substitute?","Units?","2dp?"], examChallenge: worked, quickNotes: worked.steps?.slice(-1) }},
    ]
  });

  if(id.includes("distance")||id.includes("midpoint")||id.includes("analytical")||id.includes("gradient")||id.includes("circle")||id.includes("straight"))
    return make("Distance & Midpoint",
      [{f:"d = √[(x2-x1)² + (y2-y1)²]",d:"Distance between two points"},{f:"M = ((x1+x2)/2, (y1+y2)/2)",d:"Midpoint"},{f:"m = (y2-y1)/(x2-x1)",d:"Gradient"},{f:"y-y1=m(x-x1)",d:"Line equation"}],
      "Points A(1,2) and B(5,6). Find distance AB and midpoint M (4 marks)",
      { q:"Points A(1,2) and B(5,6). Find distance AB and midpoint M (4)", steps:["d = √[(5-1)²+(6-2)²] — M","= √[16+16]=√32=4√2 ≈5.66 — A","M=((1+5)/2,(2+6)/2) — M","M=(3,4) — CA","Quick: Midpoint is average of x and average of y"], answer:"AB=√32=4√2≈5.66, M=(3,4)", finalAnswer:"AB=√32=4√2≈5.66, M=(3,4)" },
      [{mistake:"Forgetting square root in distance",marks_lost:"2",correction:"Always √[(Δx)²+(Δy)²]"},{mistake:"M = (x1+x2, y1+y2) not divided by 2",marks_lost:"1",correction:"Average: divide by 2"}]
    );

  // keep other topics from v21b here...
  if(id.includes("annuit")||id.includes("future")||id.includes("present"))
    return make("Finance — Annuities",
      [{f:"A=P(1+i)ⁿ",d:"Compound"},{f:"Fv=x[((1+i)ⁿ-1)/i]",d:"Future value"},{f:"Pv=x[(1-(1+i)⁻ⁿ)/i]",d:"Present value"}],
      "R500 pm for 5 years at 9% p.a. monthly. FV? (5)",
      {q:"R500 pm for 5 years at 9% p.a. monthly. FV?",steps:["i=0.09/12=0.0075 n=60","Fv=x[((1+i)ⁿ-1)/i]","(1.0075)^60=1.5657","Fv=R37712"],answer:"R37 712.24",finalAnswer:"R37 712.24"},
      [{mistake:"Using annual i",marks_lost:"2",correction:"Divide by 12"}]
    );

  if(id.includes("work")||id.includes("energy"))
    return make("Work, Energy & Power",
      [{f:"W=FΔx cosθ",d:"Work"},{f:"W_net=ΔEk",d:"Theorem"}],
      "20kg crate pulled 15.6m up 18° ramp, F=96.8N, f=13.5N, find vf (5)",
      {q:"20kg crate pulled 15.6m up 18° ramp...",steps:["W_app=1509J","W_f=-210J","W_g=-945J","W_net=353J=½(20)vf²","vf=5.95 m/s"],answer:"5.95 m/s",finalAnswer:"5.95 m/s"},
      [{mistake:"W_net scalar not vector",marks_lost:"2",correction:"Add works"}]
    );

  return make(pretty,
    [{f:`${pretty} — CAPS Formula`,d:`Core for ${pretty}`}],
    `${pretty} — CAPS exam (5 marks)`,
    {q:`${pretty} — CAPS exam (5)`,steps:[`Write ${pretty} formula`,`Substitute`,`Solve`],answer:`Answer for ${pretty}`,finalAnswer:`Answer for ${pretty}`},
    [{mistake:"Sign error",marks_lost:"1",correction:"Check DEG mode"}]
  );
}
