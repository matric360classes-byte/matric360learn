"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../lib/subjects";
import { useState } from "react";

export default function SubjectPage(){
 const p=useParams() as any;
 let sid=p.id as string;
 if(sid==="physical-science") sid="physical-sciences";
 const subj=(SUBJECTS_DATA as any)[sid];
 const sections=subj?.sections||[];
 const [tab,setTab]=useState("All topics");

 // Flatten units with section info for numbering
 let allUnits:any[]=[];
 sections.forEach((sec:any)=>{
  sec.units?.forEach((u:any)=> allUnits.push({...u, sectionTitle: sec.title})
 );
 });

 const tabs=["All topics","In progress","Completed","Not started"];

 return(
  <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
   {/* Breadcrumb */}
   <div style={{padding:"12px 16px 0",fontSize:14,color:"#6b7280"}}>
    <Link href="/subjects" style={{color:"#6b7280",textDecoration:"none"}}>Subjects</Link> <span style={{margin:"0 6px"}}>›</span> <span style={{color:"#fff"}}>{subj?.name||sid}</span>
   </div>

   <h1 style={{fontSize:30,fontWeight:900,padding:"10px 16px 6px"}}>{subj?.name||sid}</h1>
   <p style={{color:"#8a8a9a",fontSize:14,padding:"0 16px 16px",lineHeight:"1.4"}}>CAPS-aligned exam practice, worked solutions and progress tracking.</p>

   {/* TABS */}
   <div style={{display:"flex",gap:8,padding:"0 16px 16px",overflowX:"auto"}}>
    {tabs.map(t=>{
     const active=t===tab;
     return <button key={t} onClick={()=>setTab(t)} style={{whiteSpace:"nowrap",padding:"8px 14px",borderRadius:20,border:`1px solid ${active?"#6c6cff":"#2a2d4a"}`,background:active?"#252a5a":"#1a1c2e",color:active?"#8b8bff":"#9aa0b6",fontSize:13,fontWeight:700}}>{t}</button>
    })}
   </div>

   {/* PHYSICAL SCIENCES - Show section headers */}
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
        {sec.units?.map((u:any,i:number)=>{
         const globalIdx=allUnits.findIndex((au:any)=>au.id===u.id)+1;
         return <UnitCard key={u.id} unit={u} index={globalIdx} sid={sid}/>
        })}
       </div>
      )
     })}
    </div>
   ) : (
    // MATHEMATICS - Straight UNIT 1,2,3 like screenshot
    <div style={{padding:"0 12px",display:"flex",flexDirection:"column",gap:14}}>
     {allUnits.map((u:any,idx:number)=> <UnitCard key={u.id} unit={u} index={idx+1} sid={sid}/>)}
    </div>
   )}
  </div>
 )
}

function UnitCard({unit,index,sid}:{unit:any,index:number,sid:string}){
 const topicsCount=unit.topics?.length||5;
 return(
  <Link href={`/subjects/${sid}/${unit.id}`} style={{textDecoration:"none"}}>
   <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:22,padding:"16px 16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
     <div style={{flex:1}}>
      <div style={{fontSize:11,color:"#6b7280",letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>UNIT {index}</div>
      <div style={{fontSize:18,fontWeight:800,color:"#fff",lineHeight:"1.25",paddingRight:12}}>{unit.title}</div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10}}>
       <div style={{width:20,height:20,borderRadius:10,background:"#1a3d2a",border:"1px solid #22c55e",display:"flex",alignItems:"center",justifyContent:"center",color:"#22c55e",fontSize:12}}>✓</div>
       <span style={{fontSize:12,color:"#8a8a9a"}}>Completed · {topicsCount} topics</span>
      </div>
     </div>
     <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
      <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>100%</div>
      <div style={{background:"#252a5a",border:"1px solid #3a3f8a",color:"#8b8bff",fontSize:12,fontWeight:700,padding:"6px 14px",borderRadius:20,display:"flex",alignItems:"center",gap:4}}>Continue <span>›</span></div>
     </div>
    </div>
    {/* Progress bar */}
    <div style={{marginTop:12,height:6,background:"#252a44",borderRadius:10,overflow:"hidden"}}>
     <div style={{width:"100%",height:"100%",background:"#7b7eff",borderRadius:10}}/>
    </div>
   </div>
  </Link>
 )
}
