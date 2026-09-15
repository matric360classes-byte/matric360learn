"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function cleanFormula(latex:string){
  return latex
   .replace(/\\text\{net\}/g,"net")
   .replace(/\\Delta/g,"Δ")
   .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,"($1)/($2)")
   .replace(/_\{([^}]+)\}/g,"_$1")
   .replace(/[\{\}]/g,"")
   .replace(/\$/g,"")
   .replace(/\\ /g," ")
   .trim();
}

function FormulaCard({ latex, desc }: {latex:string, desc:string}){
  const clean = cleanFormula(latex);
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 my-4 shadow-lg">
      <div className="text-center text-2xl font-serif font-bold tracking-wide text-white">
        {clean}
      </div>
      {desc && <div className="text-center text-[13px] text-gray-400 mt-3">{desc}</div>}
    </div>
  )
}

function ContentRenderer({ content }: {content:any}){
  const md = content?.body_markdown || "";
  const formulas = content?.formulas || [];

  // Auto-extract $...$ if no formulas array
  let list = formulas;
  if(list.length===0){
    const matches = [...md.matchAll(/\$([^$]+)\$/g)];
    list = matches.slice(0,8).map((m:any)=>({ latex: m[1], description: "" }));
  }

  return (
    <div>
      {list.map((f:any,i:number)=> (
        <FormulaCard key={i} latex={f.latex||f.formula||f} desc={f.description||f.explanation||""} />
      ))}
      <div className="whitespace-pre-wrap leading-7 text-[15px] mt-6 opacity-90">
        {md.replace(/\$[^$]+\$/g,"").replace(/\*\*/g,"").slice(0,4000)}
      </div>
    </div>
  )
}

export default function LessonReader(){
  const { subject } = useParams() as {subject:string};
  const id = decodeURIComponent(subject);
  const [all,setAll]=useState<any[]>([]);
  const [active,setActive]=useState("A");

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const r=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data:any=await r.json();
      const first = data.find((x:any)=> x.id===id) || data.find((x:any)=> x.title===id);
      if(!first) return;
      const siblings = data.filter((x:any)=> x.title===first.title).sort((a:any,b:any)=>a.node_label.localeCompare(b.node_label));
      setAll(siblings);
      const letter = (first.node_label?.slice(-1) || "A").replace(/[^A-E]/g,"A");
      setActive(letter);
    })();
  },[id]);

  const activeNode = all.find(n=> (n.node_label||"").endsWith(active)) || all[0];
  if(!activeNode) return <div className="bg-[#0a0f1c] text-white p-6">Loading {id}...</div>;

  return(
    <div className="min-h-screen bg-[#0a0f1c] text-white pb-24">
      <div className="p-4 border-b border-white/10 sticky top-0 bg-[#0a0f1c] z-10">
        <Link href="/learn" className="text-xs text-gray-400">← Back to 135 topics</Link>
        <h1 className="font-bold text-xl">{activeNode.title}</h1>
        <p className="text-xs opacity-60">{all.length} Nodes • {activeNode.node_label}</p>
      </div>
      <div className="p-3 flex gap-2 overflow-auto">
        {["A","B","C","D","E"].map(l=>(
          <button key={l} onClick={()=>setActive(l)} className={`px-4 py-2 rounded-xl border text-sm ${active===l?"bg-white text-black font-bold":"bg-[#1a2235]"}`}>Node {l}</button>
        ))}
      </div>
      <div className="p-4 max-w-3xl mx-auto">
        <ContentRenderer content={activeNode.content} />
      </div>
    </div>
  )
}
