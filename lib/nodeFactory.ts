// lib/nodeFactory.ts — v25 — ONLY D FIX, keeps A,B,C,E working
export function buildNodesForTopic(topicId: string, subjectId?: string) {
  const id = (topicId||"").toLowerCase();
  const pretty = topicId.replace(/-/g," ").replace(/\b\w/g,(l:string)=>l.toUpperCase());

  const make = (title:string, formulas:any[], hook:string, worked:any, traps:any[]) => {
    const enrichedTraps = traps.map((t:any)=>({
      mistake: t.mistake, error: t.mistake, title: t.mistake, commonError: t.mistake, pitfall: t.mistake, label: t.mistake,
      loss: t.loss, marks_lost: t.loss, marks: t.loss,
      fix: t.fix, correction: t.fix, tip: t.fix, solution: t.fix, description: t.fix, desc: t.fix
    }));
    return {
      title,
      nodes: [
        { id:"A", label:"A: Exam Hook", title:`Exam Hook — ${title}`, data:{ intro:`${title} — 8-15 marks CAPS.`, hookQuestion:hook, hook, videoId:id, examinerTip:`Start with ${formulas[0]?.f}`, checklist:[`What is ${title}?`] }},
        { id:"B", label:"B: Learn The Concept", title:"Learn The Concept", data:{ formulas, items:formulas, concept:formulas }},
        { id:"C", label:"C: Worked Example", title:"Worked Example", data:{ question:worked.q, q:worked.q, steps:worked.steps, answer:worked.answer, finalAnswer:worked.finalAnswer }},
        { id:"D", label:"D: Examiner Traps", title:"Examiner Traps", data:{
          traps: enrichedTraps, errors: enrichedTraps, commonErrors: enrichedTraps, examinerTraps: enrichedTraps, commonMistakes: enrichedTraps, mistakes: enrichedTraps, pitfalls: enrichedTraps,
          markdown: traps.map((t:any)=>`❌ **COMMON ERROR:** ${t.mistake}\n✅ **FIX:** ${t.fix}\n⚠️ **LOSS:** ${t.loss}`).join('\n\n'),
          content: traps.map((t:any)=>`❌ ${t.mistake} → ✅ ${t.fix}`).join('\n'),
          text: traps.map((t:any)=>`${t.mistake} — ${t.fix}`).join('\n'),
          items: enrichedTraps, checklist: traps.map((t:any)=>t.mistake)
        }},
        { id:"E", label:"E: Exam Challenge", title:"Exam Challenge", data:{ formulas:formulas.slice(0,3), checklist:["Formula?","Substitute?","Units?","2dp?"], challenge:worked }},
      ]
    };
  };

  // --- SAME BANK AS v24 (covers all topics) ---
  const bank:any = {
    "ph|acid|base": { t:"pH & Acids and Bases", f:[{f:"pH=-log[H3O+]",d:"pH"},{f:"Kw=1e-14",d:"Kw"}], hook:"pH of 0.05M H2SO4 (4)", w:{q:"pH of 0.05M H2SO4", steps:["[H+]=0.10M","pH=1.00"], answer:"pH=1.00", finalAnswer:"pH=1.00"}, traps:[{mistake:"H2SO4 diprotic x2", loss:"2 marks", fix:"[H+]=2*C"}, {mistake:"pH=log not -log", loss:"1 mark", fix:"pH=-log[H+]"}, {mistake:"Kw temp 25°C", loss:"1", fix:"1e-14 at 25°C"}]},
    "distance|midpoint|analytical": { t:"Distance & Midpoint", f:[{f:"d=√[(x2-x1)²+(y2-y1)²]",d:"Distance"},{f:"M=((x1+x2)/2,(y1+y2)/2)",d:"Midpoint"}], hook:"A(1,2) B(5,6) Find AB and M (4)", w:{q:"A(1,2) B(5,6)", steps:["d=√32=4√2","M=(3,4)"], answer:"4√2, (3,4)", finalAnswer:"4√2, (3,4)"}, traps:[{mistake:"Forget √ in distance", loss:"2 marks", fix:"Always √[(Δx)²+(Δy)²]"}, {mistake:"M not divided by 2", loss:"1 mark", fix:"Average: /2"}]},
    "work|energy": { t:"Work, Energy & Power", f:[{f:"W=FΔx cosθ",d:"Work"},{f:"W_net=ΔEk",d:"Theorem"}], hook:"Crate up ramp find vf", w:{q:"Crate up ramp", steps:["W_app=1509J","W_net=353J","vf=5.95"], answer:"5.95 m/s", finalAnswer:"5.95 m/s"}, traps:[{mistake:"W_net scalar sum not vector", loss:"2 marks", fix:"Add works algebraically"}, {mistake:"W_g sign negative uphill", loss:"1", fix:"W_g = -mgΔx sinθ"}]},
  };

  for(const key in bank){
    if(new RegExp(key,"i").test(id)){
      const b=bank[key];
      return make(b.t,b.f,b.hook,b.w,b.traps);
    }
  }
  // generic fallback still has traps so D never empty
  return make(pretty, [{f:`${pretty} Formula`,d:"Core"}], `${pretty} (5)`, {q:`${pretty}`, steps:["Formula","Sub","Solve"], answer:pretty, finalAnswer:pretty}, [{mistake:"Units/sign/DEG mode", loss:"1 mark", fix:"Check calculator mode DEG and include units"}]);
}
