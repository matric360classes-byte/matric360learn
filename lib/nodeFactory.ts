// lib/nodeFactory.ts — v27 — Node D = same shape as working Nodes — no crash
export function buildNodesForTopic(topicId: string, subjectId?: string) {
  const id = (topicId||"").toLowerCase();
  const pretty = topicId.replace(/-/g," ").replace(/\b\w/g,(l:any)=>l.toUpperCase());

  const make = (title:string, formulas:any[], hook:string, worked:any, rawTraps:any[]) => {
    // D will be built like A/E so it cannot crash
    const trapText = rawTraps.map((t:any)=>`• ${t.m} — FIX: ${t.f} [${t.l}]`).join('\n');
    const trapList = rawTraps.map((t:any)=>`${t.m}`);

    return {
      title,
      nodes: [
        { id:"A", title:`Exam Hook — ${title}`, data:{ intro:`${title} — 8-15 marks CAPS.`, hookQuestion:hook, hook, examinerTip: formulas[0]?.f, checklist:trapList }},
        { id:"B", title:"Learn The Concept", data:{ formulas }},
        { id:"C", title:"Worked Example", data:{ question:worked.q, steps:worked.steps, answer:worked.answer, finalAnswer:worked.answer }},
        // D — NOW SAME SHAPE AS A — CANNOT CRASH
        { id:"D", title:"Examiner Traps", data:{
          intro:`Common examiner traps for ${title} — where marks are lost.`,
          checklist: trapList,
          traps: trapList,
          items: rawTraps,
          formulas: formulas.slice(0,1),
          // also include text fields so any renderer finds something
          hookQuestion: trapText,
          hook: trapText,
          question: `Traps for ${title}`,
          steps: rawTraps.map((t:any)=>`❌ ${t.m} => ✅ ${t.f}`),
          answer: trapText,
          finalAnswer: trapText,
          markdown: trapText,
          content: trapText
        }},
        { id:"E", title:"Exam Challenge", data:{ formulas: formulas.slice(0,2), checklist:["Formula?","Sub?","Units?"], challenge:worked }},
      ]
    };
  };

  if(id.includes("ph")||id.includes("acid")||id.includes("base"))
    return make("pH of Acids and Bases",
      [{f:"pH=-log[H3O+]",d:"pH"},{f:"Kw=[H3O+][OH-]=1e-14",d:"Kw"}],
      "Calculate pH of 0.05M H2SO4 (4)",
      {q:"pH of 0.05M H2SO4", steps:["[H+]=0.10M diprotic","pH=1.00"], answer:"pH=1.00", finalAnswer:"pH=1.00"},
      [{m:"H2SO4 diprotic x2", f:"[H+]=2*C", l:"2 marks"}, {m:"pH=log not -log", f:"-log", l:"1 mark"}, {m:"Kw temp", f:"1e-14 at 25C", l:"1 mark"}]
    );

  if(id.includes("distance")||id.includes("midpoint")||id.includes("analytical"))
    return make("Distance & Midpoint",
      [{f:"d=√[(x2-x1)²+(y2-y1)²]",d:"Distance"},{f:"M=((x1+x2)/2,(y1+y2)/2)",d:"Midpoint"}],
      "A(1,2) B(5,6) Find AB and M (4)",
      {q:"A(1,2) B(5,6)", steps:["d=√32=4√2","M=(3,4)"], answer:"AB=4√2, M=(3,4)", finalAnswer:"AB=4√2, M=(3,4)"},
      [{m:"Forget √", f:"Always √", l:"2 marks"}, {m:"M not /2", f:"/2", l:"1 mark"}]
    );

  // FALLBACK FOR ALL OTHER 171 TOPICS — still gives D as checklist so it works
  return make(pretty,
    [{f:`${pretty} — CAPS Formula`,d:"Core"}],
    `${pretty} — CAPS (5)`,
    {q:`${pretty} (5)`, steps:[`Write ${pretty} formula`,`Sub`,`Solve`], answer:pretty, finalAnswer:pretty},
    [{m:`Confusing ${pretty} with similar`, f:`Define ${pretty} first`, l:"1 mark"}, {m:"Units missing", f:"Include units", l:"1 mark"}, {m:"DEG vs RAD", f:"Set DEG", l:"1 mark"}]
  );
}
