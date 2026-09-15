"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function cleanLatex(latex:string){
  return latex
.replace(/\$/g,"")
.replace(/\\text\{([^}]+)\}/g,"$1")
.replace(/\\frac\{n\}\{2\}/g,"n/2")
.replace(/\\cdot/g,"") // remove dot
.replace(/\s*\*\s*/g,"") // REMOVE * -> mv not m*v
.replace(/[\\{}]/g,"")
.replace(/S_n/g,"Sₙ").replace(/T_n/g,"Tₙ")
.replace(/F_net/g,"Fₙₑₜ").replace(/p\s*=\s*mv/g,"p = mv")
.replace(/_([a-z0-9])/g, (_,c)=>{
    const sub:any={n:"ₙ",a:"ₐ",1:"₁",2:"₂"};
    return sub[c]||c;
  })
.replace(/_/g,"")
.trim();
}

function FormulaCard({ latex, desc }: {latex:string, desc:string}){
  const clean = cleanLatex(latex);
  return (
    <div className="bg-[#1e1f26] border border-white/10 rounded-[20px] p-7 my-4">
      <div className="text-center font-serif italic text-[26px] text-white">
        {clean}
      </div>
      {desc && <div className="text-center text-[13px] text-[#9aa0af] mt-4">{desc}</div>}
    </div>
  )
}

export default function LessonReader(){
  const { subject } = useParams() as {subject:string};
  const id = decodeURIComponent(subject);
  const [nodes,setNodes]=useState<any[]>([]);
  const [active,setActive]=useState("A");

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const r=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const all:any=await r.json();
      const first = all.find((x:any)=> x.id===id);
      if(!first) return;
      const sibs = all.filter((x:any)=> x.title===first.title);
      setNodes(sibs.length? sibs : [first]);
    })();
  },[id]);

  const node = nodes.find(n=> (n.node_label||"").endsWith(active)) || nodes[0];
  if(!node) return <div className="bg-[#0a0f1c] text-white p-6">Loading...</div>;

  const isMomentum = node.title?.toLowerCase().includes("momentum") || node.title?.toLowerCase().includes("impulse");
  const isArith = node.title?.toLowerCase().includes("arith");

  let formulas = [];
  if(isArith){
    formulas = [
      { latex: "Tₙ = a + (n - 1)d", description: "You need to find the value of a specific term, find the position (n) of a term, or find the general formula of the sequence." },
      { latex: "Sₙ = n/2[2a + (n - 1)d]", description: "You need to calculate the sum of the first 'n' terms and you know 'a', 'd', and 'n'." },
      { latex: "Sₙ = n/2[a + l]", description: "You need to calculate the sum of the first 'n' terms and you know the first term 'a', the last term 'l' (which is Tₙ), and 'n'." },
    ];
  } else if(isMomentum){
    formulas = [
      { latex: "p = mv", description: "Calculating momentum of a single object." },
      { latex: "FₙₑₜΔt = Δp", description: "Relating force, contact time, and change in momentum. Core of this topic." },
      { latex: "Fₙₑₜ = Δp/Δt", description: "Newton's Second Law in terms of momentum." },
    ];
  } else {
    formulas = node.content?.formulas || [...(node.content?.body_markdown||"").matchAll(/\$([^$]+)\$/g)].map((m:any)=>({latex:m[1], description:""}));
  }

  return(
    <div className="min-h-screen bg-[#0a0f1c] text-white pb-24">
      <div className="p-4 border-b border-white/10 sticky top-0 bg-[#0a0f1c]">
        <Link href="/learn" className="text-xs text-gray-400">← Back to 135 topics</Link>
        <h1 className="font-bold text-lg">{node.title}</h1>
      </div>
      <div className="p-3 max-w-2xl mx-auto">
        {formulas.map((f:any,i:number)=>(
          <FormulaCard key={i} latex={f.latex||f} desc={f.description||""} />
        ))}
      </div>
    </div>
  )
}
