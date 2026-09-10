"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function StudioPage(){
  const router = useRouter();
  const [topics,setTopics] = useState<any[]>([]);
  const [filter,setFilter] = useState("all");

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("topic_knowledge").select("*").order("grade").order("topic_name");
    setTopics(data||[]);
  })()},[]);

  const filtered = filter==="all" ? topics : topics.filter((t:any)=>t.subject?.toLowerCase().includes(filter));

  return (
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui", padding:16, paddingBottom:80}}>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <button onClick={()=>router.push("/admin")} style={{background:"#1e1e28", border:"none", color:"white", padding:"8px 14px", borderRadius:10}}>← Back</button>
        <h1 style={{margin:0}}>Content Studio - {topics.length}</h1>
      </div>

      <div style={{display:"flex", gap:8, marginTop:16, overflowX:"auto"}}>
        {["all","math","physical","life","geography"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{background: filter===f ? "#8b7cf8" : "#1e1e28", color: filter===f ? "black" : "white", border:"none", padding:"8px 16px", borderRadius:20, fontWeight:"bold", textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>

      <div style={{display:"grid", gap:12, marginTop:20}}>
        {filtered.map((t:any)=>(
          <div key={t.id} style={{background:"#1c1c24", padding:14, borderRadius:16, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <b>{t.topic_name}</b><br/>
              <span style={{color:"#8b7cf8", fontSize:12}}>Grade {t.grade} • {t.subject}</span><br/>
              <small style={{color:"#666"}}>{t.caps_code || t.id.slice(0,8)}</small>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:6}}>
              <button onClick={()=>router.push(`/admin/studio/${t.id}`)} style={{background:"#8b7cf8", border:"none", padding:"6px 12px", borderRadius:8, fontWeight:"bold"}}>Edit</button>
              <button onClick={()=>alert("Generate lesson for "+t.topic_name)} style={{background:"#1e1e28", border:"1px solid #333", color:"white", padding:"6px 12px", borderRadius:8}}>Generate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
