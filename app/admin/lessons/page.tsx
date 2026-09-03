"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Lesson = { id:string, title:string, subject:string, unit:string, topic:string };

export default function LessonsAdmin(){
  const [search,setSearch] = useState("");
  const [lessons,setLessons] = useState<Lesson[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    // Mock data from your 419 topics - will auto-load from Supabase next
    const mock: Lesson[] = [
      {id:"1",title:"Trigonometry - Compound Angles", subject:"Mathematics", unit:"Trig", topic:"Compound Angles"},
      {id:"2",title:"Organic Chemistry - Nomenclature", subject:"Physical Sciences", unit:"Organic", topic:"Nomenclature"},
      {id:"3",title:"Electric Circuits - Internal Resistance", subject:"Physical Sciences", unit:"Electricity", topic:"Circuits"},
      {id:"4",title:"Calculus - Optimization", subject:"Mathematics", unit:"Calculus", topic:"Optimization"},
      {id:"5",title:"Photosynthesis", subject:"Life Sciences", unit:"Plant Bio", topic:"Photosynthesis"},
    ];
    setTimeout(()=>{ setLessons(mock); setLoading(false); }, 500);
  },[]);

  const filtered = lessons.filter(l => 
    (l.title+l.subject+l.unit).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{padding:"16px",background:"#0f111e",minHeight:"100vh",color:"white"}}>
      <Link href="/admin" style={{color:"#94a3b8",fontSize:13,textDecoration:"none"}}>← Back to Factory</Link>
      
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,marginBottom:16}}>
        <div><div style={{fontSize:20,fontWeight:900}}>Lesson Manager</div><div style={{fontSize:12,color:"#94a3b8"}}>{filtered.length} lessons • {loading ? "Loading..." : "Live"}</div></div>
        <button style={{background:"#22c55e",color:"#0f111e",padding:"8px 14px",borderRadius:10,fontWeight:800,fontSize:13,border:"none"}}>+ New Lesson</button>
      </div>

      <div style={{position:"relative",marginBottom:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subject, unit, topic..." style={{width:"100%",background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px 14px 12px 38px",color:"white",outline:"none"}} />
        <span style={{position:"absolute",left:12,top:11}}>🔍</span>
      </div>

      {loading ? (
        <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:20,textAlign:"center",color:"#64748b"}}>Loading lessons...</div>
      ) : filtered.length===0 ? (
        <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:30,textAlign:"center"}}>
          <div style={{fontSize:32}}>📚</div>
          <div style={{fontWeight:700,marginTop:8}}>No lessons match</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:4}}>Try different search: "{search}"</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(l=>(
            <div key={l.id} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px",display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700}}>{l.title}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{l.subject} • {l.unit} • {l.topic}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{background:"rgba(34,197,94,0.15)",color:"#22c55e",fontSize:10,fontWeight:800,padding:"4px 8px",borderRadius:20}}>PUBLISHED</span>
                <Link href={`/admin/lessons/${l.id}`} style={{color:"#818cf8",fontSize:12,textDecoration:"none"}}>Edit →</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop:20,background:"rgba(129,140,248,0.1)",border:"1px solid #2e335e",borderRadius:12,padding:"12px",fontSize:11,color:"#94a3b8"}}>
        Next: Wire this to Supabase `lessons` table. For now showing mock 5 to kill the 404/empty bug. Once green, we swap to real query.
      </div>
    </div>
  );
}
