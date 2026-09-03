"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminPage(){
  const [search,setSearch]=useState("");
  const stats = { total: 419, published: 418, inReview: 0, drafts: 0, needsChanges: 0, missingMeta: 268, missingNodes: 249, lessThan3Qs: 233, missingPaper: 268 };

  return(
    <div style={{padding:"16px",background:"#0f111e",minHeight:"100vh",color:"white",paddingBottom:90}}>
      <div style={{background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.35)",borderRadius:16,padding:"14px 16px",marginBottom:16}}>
        <div style={{color:"#22c55e",fontWeight:800,fontSize:14}}>Content Admin mode</div>
        <div style={{color:"#94a3b8",fontSize:13}}>Lessons, videos, CAPS and question bank. Payments, roles and system settings are restricted.</div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:16}}>
        <div><div style={{fontSize:22,fontWeight:900}}>CAPS Content Factory</div><div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>Command center for Grade 12 curriculum production.</div></div>
        <Link href="/admin/factory" style={{background:"#818cf8",color:"#0f111e",padding:"10px 16px",borderRadius:14,fontWeight:800,fontSize:13,textDecoration:"none"}}>Open Content Studio</Link>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Card label="Total topics" value={stats.total} icon="📖" />
        <Card label="Published" value={stats.published} icon="✅" color="#22c55e" />
        <Card label="In review" value={stats.inReview} icon="⏱" color="#eab308" />
        <Card label="Drafts" value={stats.drafts} icon="📝" />
        <Card label="Needs changes" value={stats.needsChanges} icon="🚨" color="#ef4444" />
        <Card label="Missing CAPS meta" value={stats.missingMeta} icon="✨" color="#eab308" />
      </div>

      <div style={{fontWeight:800,marginBottom:8}}>Missing content</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        <Missing label="Topics missing nodes A–E" value={249} />
        <Missing label="Topics with <3 questions" value={233} />
        <Missing label="Topics missing paper/section" value={268} />
      </div>

      <div style={{fontWeight:800,marginBottom:8}}>Completion by subject</div>
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,overflow:"hidden",marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.6fr 0.9fr 0.5fr",padding:"12px",fontSize:11,color:"#6b7280",fontWeight:700}}><div>SUBJECT</div><div>TOPICS</div><div>SCAFFOLDED</div><div>≥3 QS</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.6fr 0.9fr 0.5fr",padding:"14px",fontSize:14,borderTop:"1px solid #252a44"}}><div style={{fontWeight:700}}>Mathematics</div><div>167</div><div>28</div><div>97</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.6fr 0.9fr 0.5fr",padding:"14px",fontSize:14,borderTop:"1px solid #252a44"}}><div style={{fontWeight:700}}>Physical Sciences</div><div>252</div><div>142</div><div>89</div></div>
      </div>

      <div style={{fontSize:20,fontWeight:900}}>Review Lessons</div>
      <div style={{fontSize:13,color:"#94a3b8",margin:"4px 0 12px"}}>Search any lesson and jump straight into the editor.</div>
      <div style={{position:"relative"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subject, unit, topic, or lesson title..." style={{width:"100%",background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px 14px 12px 38px",color:"white",outline:"none"}} />
        <span style={{position:"absolute",left:14,top:12}}>🔍</span>
      </div>
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:20,textAlign:"center",color:"#64748b",marginTop:12}}>{search ? `Searching "${search}"...` : "Start typing to search"}</div>
    </div>
  );
}
function Card({label,value,icon,color="#fff"}:{label:string,value:number,icon:string,color?:string}){ return <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px"}}><div>{icon}</div><div style={{fontSize:12,color:"#94a3b8",marginTop:6}}>{label}</div><div style={{fontSize:26,fontWeight:900,marginTop:4,color}}>{value}</div></div> }
function Missing({label,value}:{label:string,value:number}){ return <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px",display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:12,color:"#94a3b8"}}>{label}</div><div style={{fontSize:26,fontWeight:900,color:"#ef4444",marginTop:2}}>{value}</div></div><div style={{color:"#7c7cff"}}>›</div></div> }
