"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "katex/dist/katex.min.css";
import katex from "katex";

function FormulaCard({ latex, desc }: {latex:string, desc:string}){
  let html = "";
  try{ html = katex.renderToString(latex, {throwOnError:false, displayMode:true}) }catch{ html = latex }
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 my-4">
      <div className="text-center text-2xl" dangerouslySetInnerHTML={{__html: html}} />
      <div className="text-center text-[13px] text-gray-400 mt-3">{desc}</div>
    </div>
  )
}

function ContentRenderer({ content }: {content:any}){
  const md = content?.body_markdown || "";
  const formulas = content?.formulas || content?.formulas_list || [];

  // Extract $...$ from markdown if formulas array empty
  const autoFormulas = formulas.length===0
   ? [...md.matchAll(/\$([^$]+)\$/g)].slice(0,6).map((m:any)=>({ latex: m[1], desc: "" }))
    : formulas;

  return (
    <div>
      {autoFormulas.map((f:any,i:number)=> <FormulaCard key={i} latex={f.latex||f.formula||f} desc={f.description||f.explanation||f.when_to_use||""} />)}
      <div className="whitespace-pre-wrap leading-7 text-[15px] mt-4">
        {md.replace(/\$[^$]+\$/g, "").replace(/\*\*/g,"")}
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
        <Link href="/learn" className="text-xs text-gray-400">← Back</Link>
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
