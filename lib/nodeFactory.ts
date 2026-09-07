// NEW APP — lib/nodeFactory.ts — v21 topic-aware (mirrors old app proper content)
export function buildNodesForTopic(topicId: string) {
  const pretty = topicId.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase());
  const low = topicId.toLowerCase();

  const T = (title:string, formulas:any[], q:string, steps:string[], ans:string, traps:any[]) => {
    return {
      title, 
      nodes: [
        { id:"A", title:`Exam Hook — ${title}`, data:{ intro:`${title} — 8-15 marks CAPS. Old app showed this as high-yield.`, tip:`EXAMINER TIP: Start with ${formulas[0].f}`, hook: q }},
        { id:"B", title:"Learn The Concept", data:{ formulas }},
        { id:"C", title:"Worked Example", data:{ question: q, steps, answer: ans }},
        { id:"D", title:"Examiner Traps", data:{ traps }},
        { id:"E", title:"Exam Challenge", data:{ formulas: formulas.slice(0,3), challenge:{ q, steps, ans }}},
      ]
    }
  };

  if(low.includes("analytical")||low.includes("circle"))
    return T("Analytical Geometry",
      [{f:"m=(y2-y1)/(x2-x1)",d:"Gradient"},{f:"(x-a)²+(y-b)²=r²",d:"Circle"},{f:"y=mx+c",d:"Line"},{f:"d=√[(x2-x1)²+(y2-y1)²]",d:"Distance"}],
      "Circle centre (2,-3) through (5,1). Find equation (4 marks)",
      ["(x-a)²+(y-b)²=r² — M","r²=(5-2)²+(1+3)²=25 — A","(x-2)²+(y+3)²=25 — CA","r=5","Quick: (x-2) means centre +2"],
      "(x-2)²+(y+3)²=25, r=5",
      [{mistake:"Sign flip (x-2) → centre -2",loss:"1 mark"}]
    );

  if(low.includes("annuit")||low.includes("future")||low.includes("present")||low.includes("investment"))
    return T("Finance — Annuities",
      [{f:"A=P(1+i)ⁿ",d:"Compound"},{f:"Fv=x[((1+i)ⁿ-1)/i]",d:"Future value"},{f:"Pv=x[(1-(1+i)⁻ⁿ)/i]",d:"Present value"}],
      "R500 pm for 5 years at 9% p.a. monthly. FV? (5)",
      ["i=0.09/12=0.0075 n=60","Fv=x[((1+i)ⁿ-1)/i]","(1.0075)^60=1.5657","Fv=500*75.42=R37712"],
      "R37 712.24",
      [{mistake:"Using annual i not monthly",loss:"2 marks"}]
    );

  if(low.includes("calculus")||low.includes("differential")||low.includes("limit"))
    return T("Differential Calculus",
      [{f:"f'(x)=lim(h→0)[f(x+h)-f(x)]/h",d:"First principles"},{f:"d/dx xⁿ=n xⁿ⁻¹",d:"Power rule"}],
      "Differentiate f(x)=3x³-4x²+5 from first principles (5)",
      ["f(x+h)=3(x+h)³-4(x+h)²+5","Subtract f(x)","Divide by h, let h→0","f'(x)=9x²-8x"],
      "f'(x)=9x²-8x",
      [{mistake:"Leaving h in final",loss:"1 mark"}]
    );

  if(low.includes("work")||low.includes("energy")||low.includes("theorem"))
    return T("Work, Energy & Power",
      [{f:"W=FΔx cosθ",d:"Work"},{f:"W_net=ΔEk=½m(vf²-vi²)",d:"Theorem FINAL-INITIAL"},{f:"Ek=½mv² Ep=mgh",d:"Energy"}],
      "20kg crate pulled 15.6m up 18° ramp, F=96.8N, f=13.5N, find vf (5)",
      ["W_app=1509J","W_f=-210J","W_g=-945J","W_net=353J=½(20)vf²","vf=5.95 m/s"],
      "5.95 m/s",
      [{mistake:"W_net scalar not vector",loss:"2 marks"}]
    );

  if(low.includes("organic")||low.includes("ester")||low.includes("isomer"))
    return T("Organic Chemistry",
      [{f:"C_nH_2n+2 alkane",d:"Alkanes"},{f:"-OH alcohol -COOH acid -COO- ester",d:"Functional groups"},{f:"Isomers same formula diff structure",d:"Isomers"}],
      "Draw isomers of C4H8O2 as esters (4)",
      ["Ester R-COO-R'","methyl propanoate","ethyl ethanoate","Name with -oate"],
      "methyl propanoate & ethyl ethanoate",
      [{mistake:"Missing COO linkage",loss:"1 mark"}]
    );

  // Fallback — uses topic name, NOT Work-Energy
  return T(pretty,
    [{f:`${pretty} — Main CAPS Formula`,d:`Core for ${pretty}`},{f:"Formula→Substitute→Solve",d:"Method"},{f:"Check units/signs",d:"Check"}],
    `${pretty} — CAPS exam (5 marks)`,
    [`Write ${pretty} formula`,`Substitute`,`Solve`,`Check`],
    `Answer for ${pretty}`,
    [{mistake:"Sign/mode error",loss:"1"}]
  );
}
