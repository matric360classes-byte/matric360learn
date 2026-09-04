"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SUBJECTS_DATA } from "../../../../lib/subjects";

export default function SubjectPage(){
 const p=useParams() as any;
 let sid=p.id as string;
 if(sid==="physical-science") sid="physical-sciences";
 const subj=(SUBJECTS_DATA as any)[sid];
 const sections=subj?.sections||[];
 const [tab,setTab]=useState("All topics");
 let allUnits:any[]=[];
 sections.forEach((sec:any)=>{ sec.units?.forEach((u:any)=> allUnits.push({...u, sectionTitle: sec.title}))});
 const tabs=["All topics","In progress","Completed","Not started"];

 return(
  <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
   <div style={{padding:"12px 16px 0",fontSize:14,color:"#6b7280"}}>
    <Link href="/subjects" style={{color:"#6b7280",textDecoration:"none"}}>Subjects</Link> <span style={{margin:"0 6px"}}>›</span> <span style={{color:"#fff"}}>{subj?.name||sid}</span>
   </div>
   <h1 style={{fontSize:30,fontWeight:900,padding:"10px 16px 6px"}}>{subj?.name||sid}</h1>
   <p style={{color:"#8a8a9a",fontSize:14,padding:"0 16px 16px"}}>CAPS-aligned exam practice, worked solutions and progress tracking.</p>
   <div style={{display:"flex",gap:8,padding:"0 16px 16px",overflowX:"auto"}}>
    {tabs.map(t=>{
     const active=t===tab;
     return <button key={t} onClick={()=>setTab(t)} style={{whiteSpace:"nowrap",padding:"8px 14px",borderRadius:20,border:`1px solid ${active?"#6c6cff":"#2a2d4a"}`,background:active?"#252a5a":"#1a1c2e",color:active?"#8b8bff":"#9aa0b6",fontSize:13,fontWeight:700}}>{t}</button>
    })}
   </div>
   {sid==="physical-sciences"? (
    <div style={{padding:"0 12px"}}>
     {sections.map((sec:any)=>{
      const isPhysics=sec.title.toLowerCase().includes("physics");
      return(
       <div key={sec.title} style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 4px"}}>
         <div style={{width:3,height:14,background:isPhysics?"#3b82f6":"#10b981",borderRadius:2}}/>
         <span style={{fontSize:11,fontWeight:900,letterSpacing:2,color:"#9aa0b6"}}>{sec.title.toUpperCase()}</span>
        </div>
        {sec.units?.map((u:any)=>{ const globalIdx=allUnits.findIndex((au:any)=>au.id===u.id)+1; return <div key={u.id} style={{marginBottom:12}}><UnitCard unit={u} index={globalIdx} sid={sid}/></div>})}
       </div>
      )
     })}
    </div>
   ) : (
    <div style={{padding:"0 12px",display:"flex",flexDirection:"column",gap:14}}>
     {allUnits.map((u:any,idx:number)=> <UnitCard key={u.id} unit={u} index={idx+1} sid={sid}/>)}
    </div>
   )}
  </div>
 )
}

function UnitCard({unit,index,sid}:{unit:any,index:number,sid:string}){
 const [pct,setPct]=useState(0);
 const [count,setCount]=useState(0);
 useEffect(()=>{
  try{
   const saved = localStorage.getItem("matric360_progress");
   const done = saved? new Set(JSON.parse(saved)) : new Set<string>();
   const total = unit.topics?.length||0;
   const doneCount = unit.topics?.filter((t:any)=> done.has(`${sid}_${unit.id}_${t.id}`)).length||0;
   setCount(doneCount);
   setPct(total? Math.round((doneCount/total)*100):0);
  }catch{}
 },[unit,sid]);

 const isComplete = pct===100 && pct>0;
 const inProgress = pct>0 && pct<100;

 return(
  <Link href={`/subjects/${sid}/${unit.id}`} style={{textDecoration:"none"}}>
   <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:22,padding:"16px"}}>
    <div style={{display:"flex",justifyContent:"space-between"}}>
     <div style={{flex:1}}>
      <div style={{fontSize:11,color:"#6b7280",letterSpacing:1.2}}>UNIT {index}</div>
      <div style={{fontSize:18,fontWeight:800,color:"#fff",paddingRight:12}}>{unit.title}</div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10}}>
       <div style={{width:20,height:20,borderRadius:10,background:isComplete?"#1a3d2a":"#1f1f2e",border:`1px solid ${isComplete?"#22c55e":"#2a2d4a"}`,display:"flex",alignItems:"center",justifyContent:"center",color:isComplete?"#22c55e":"#6b7280",fontSize:12}}>{isComplete?"✓":inProgress?"◐":"○"}</div>
       <span style={{fontSize:12,color:"#8a8a9a"}}>{isComplete?"Completed":inProgress?"In progress":"Not started"} · {count}/{unit.topics?.length||0} topics</span>
      </div>
     </div>
     <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
      <div style={{fontSize:16,fontWeight:800,color:pct>0?"#fff":"#6b7280"}}>{pct}%</div>
      <div style={{background:pct>0?"#252a5a":"#1f1f2e",border:`1px solid ${pct>0?"#3a3f8a":"#2a2d4a"}`,color:pct>0?"#8b8bff":"#6b7280",fontSize:12,padding:"6px 14px",borderRadius:20}}>{pct===0?"Start":pct===100?"Review":"Continue"} ›</div>
     </div>
    </div>
    <div style={{marginTop:12,height:6,background:"#252a44",borderRadius:10,overflow:"hidden"}}>
     <div style={{width:`${pct}%`,height:"100%",background:isComplete?"#22c55e":"#7b7eff",borderRadius:10,transition:"width 0.4s"}}/>
    </div>
   </div>
  </Link>
 )
}
