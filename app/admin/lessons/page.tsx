"use client";
import { useState } from "react";
import Link from "next/link";

export default function LessonsAdmin(){
  const [search,setSearch]=useState("");
  const topics = [
    {id:"1",title:"Trigonometry - Compound Angles", subject:"Mathematics", unit:"Trig"},
    {id:"2",title:"Organic Nomenclature", subject:"Physical Sciences", unit:"Organic"},
    {id:"3",title:"Electric Circuits", subject:"Physical Sciences", unit:"Electricity"},
    {id:"4",title:"Calculus Optimization", subject:"Mathematics", unit:"Calculus"},
  ];
  const filtered = topics.filter(t=> `${t.title} ${t.subject}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{padding:16,background:"#0f111e",minHeight:"100vh",color:"white"}}>
      <Link href="/admin" style={{color:"#94a3b8",fontSize:13,textDecoration:"none"}}>← Factory</Link>
      <div style={{fontSize:20,fontWeight:900,marginTop:12}}>Lesson Manager</div>
      <div style={{position:"relative",marginTop:16,marginBottom:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:"100%",background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px 14px 12px 38px",color:"white",outline:"none"}} />
        <span style={{position:"absolute",left:12,top:11}}>🔍</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(t=>(
          <div key={t.id} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:14,display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontSize:13,fontWeight:700}}>{t.title}</div><div style={{fontSize:11,color:"#94a3b8"}}>{t.subject} • {t.unit}</div></div>
            <Link href={`/admin/lessons/${t.id}`} style={{color:"#818cf8",fontSize:12,textDecoration:"none"}}>Edit →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
