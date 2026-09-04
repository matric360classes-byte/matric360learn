"use client";
import { useState } from "react";
import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import { SUBJECTS } from "@/lib/subjects";

export default function LessonsAdmin(){
  const [search,setSearch]=useState("");
  const [filterSubject,setFilterSubject]=useState("all");

  const filtered = LESSONS.filter(t=>{
    const matchesSearch = `${t.title} ${t.subjectId} ${t.unit}`.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject==="all" || t.subjectId===filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div style={{padding:16,background:"#0f111e",minHeight:"100vh",color:"white"}}>
      <Link href="/admin" style={{color:"#94a3b8",fontSize:13,textDecoration:"none"}}>← Factory</Link>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
        <div style={{fontSize:20,fontWeight:900}}>Lesson Manager</div>
        <div style={{fontSize:12,background:"#22c55e20",color:"#22c55e",padding:"4px 10px",borderRadius:20,border:"1px solid #22c55e40"}}>{LESSONS.length} LIVE • {filtered.length} shown</div>
      </div>

      <div style={{display:"flex",gap:8,marginTop:16}}>
        <div style={{position:"relative",flex:1}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${LESSONS.length} topics...`} style={{width:"100%",background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px 14px 12px 38px",color:"white",outline:"none"}} />
          <span style={{position:"absolute",left:12,top:11}}>🔍</span>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginTop:12,overflowX:"auto"}}>
        <button onClick={()=>setFilterSubject("all")} style={{padding:"6px 14px",borderRadius:20,border:"1px solid #252a44",background:filterSubject==="all"?"#6366f1":"#1a1d2f",color:"white",fontSize:12,whiteSpace:"nowrap"}}>All ({LESSONS.length})</button>
        {SUBJECTS.map(s=>(
          <button key={s.id} onClick={()=>setFilterSubject(s.id)} style={{padding:"6px 14px",borderRadius:20,border:"1px solid #252a44",background:filterSubject===s.id?"#6366f1":"#1a1d2f",color:"white",fontSize:12,whiteSpace:"nowrap"}}>{s.name}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}>
        {filtered.map(t=>(
          <div key={t.id} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{t.title}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:4,display:"flex",gap:8}}>
                <span style={{background:"#252a44",padding:"2px 8px",borderRadius:10}}>{t.unit}</span>
                <span>{t.chapter} • {t.duration}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:t.status==="published"?"#22c55e20":"#f59e0b20",color:t.status==="published"?"#22c55e":"#f59e0b",border:`1px solid ${t.status==="published"?"#22c55e40":"#f59e0b40"}`}}>{t.status}</span>
              <Link href={`/admin/lessons/${t.id}`} style={{color:"#818cf8",fontSize:12,textDecoration:"none",fontWeight:700}}>Edit →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
