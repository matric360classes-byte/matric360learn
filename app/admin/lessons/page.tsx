"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Topic = { id:string, title:string, subject:string, unit:string, status:string };

export default function LessonsAdmin(){
  const [search,setSearch] = useState("");
  const [topics,setTopics] = useState<Topic[]>([]);
  const [loading,setLoading] = useState(true);
  const supabase = createClient();

  useEffect(()=>{
    async function load(){
      setLoading(true);
      // Try lessons first, fallback to topics - your DB has 419 topics
      let { data, error } = await supabase.from("topics").select("id, title, subject, unit").limit(419);
      if(error || !data || data.length===0){
        const res2 = await supabase.from("lessons").select("id, title, subject, unit").limit(419);
        data = res2.data as any;
        error = res2.error;
      }
      if(data){
        setTopics(data.map((t:any)=>({ id:t.id, title:t.title||t.topic||"Untitled", subject:t.subject||"General", unit:t.unit||"Unit", status:"published" })));
      }
      setLoading(false);
    }
    load();
  },[]);

  const filtered = topics.filter(t => 
    `${t.title} ${t.subject} ${t.unit}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{padding:"16px",background:"#0f111e",minHeight:"100vh",color:"white"}}>
      <Link href="/admin" style={{color:"#94a3b8",fontSize:13,textDecoration:"none"}}>← Factory</Link>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:12,marginBottom:16}}>
        <div><div style={{fontSize:20,fontWeight:900}}>Lesson Manager — LIVE DB</div><div style={{fontSize:12,color:"#22c55e"}}>{loading ? "Connecting..." : `${filtered.length} / ${topics.length} topics from Supabase`}</div></div>
      </div>

      <div style={{position:"relative",marginBottom:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search 419 topics..." style={{width:"100%",background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px 14px 12px 38px",color:"white",outline:"none"}} />
        <span style={{position:"absolute",left:12,top:11}}>🔍</span>
      </div>

      {loading ? <div style={{padding:20,textAlign:"center",color:"#64748b"}}>Loading Supabase...</div> :
       filtered.length===0 ? <div style={{padding:30,textAlign:"center",color:"#64748b"}}>No lessons match "{search}"</div> :
       <div style={{display:"flex",flexDirection:"column",gap:10}}>
         {filtered.map(t=>(
           <div key={t.id} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px",display:"flex",justifyContent:"space-between"}}>
             <div><div style={{fontSize:13,fontWeight:700}}>{t.title}</div><div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{t.subject} • {t.unit}</div></div>
             <Link href={`/admin/lessons/${t.id}`} style={{color:"#818cf8",fontSize:12,textDecoration:"none",alignSelf:"center"}}>Edit →</Link>
           </div>
         ))}
       </div>
      }
    </div>
  );
}
