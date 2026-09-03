"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage(){
  const [search,setSearch]=useState("");
  const stats = {
    total: 419,
    published: 418,
    inReview: 0,
    drafts: 0,
    needsChanges: 0,
    missingMeta: 268,
    missingNodes: 249,
    lessThan3Qs: 233,
    missingPaper: 268
  };

  return(
    <div style={{padding:"16px",background:"#0f111e",minHeight:"100vh",color:"white",paddingBottom:90}}>
      {/* Top Banner */}
      <div style={{background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.35)",borderRadius:16,padding:"14px 16px",marginBottom:16}}>
        <div style={{color:"#22c55e",fontWeight:800,fontSize:14}}>Content Admin mode</div>
        <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.4,marginTop:2}}>Lessons, videos, CAPS and question bank. Payments, roles and system settings are restricted.</div>
      </div>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:16}}>
        <div>
          <div style={{fontSize:22,fontWeight:900}}>CAPS Content Factory</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>Command center for Grade 12 curriculum production.</div>
        </div>
        <Link href="/admin/factory" style={{background:"#818cf8",color:"#0f111e",padding:"10px 16px",borderRadius:14,fontWeight:800,fontSize:13,textDecoration:"none",whiteSpace:"nowrap"}}>Open Content Studio</Link>
      </div>

      {/* Stats Grid - 2 cols on mobile */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <StatCard icon="📖" label="Total topics" value={stats.total} />
        <StatCard icon="✅" label="Published" value={stats.published} color="#22c55e" />
        <StatCard icon="⏱" label="In review" value={stats.inReview} color="#eab308" />
        <StatCard icon="📝" label="Drafts" value={stats.drafts} />
        <StatCard icon="🚨" label="Needs changes" value={stats.needsChanges} color="#ef4444" />
        <StatCard icon="✨" label="Missing CAPS meta" value={stats.missingMeta} color="#eab308" />
      </div>

      {/* Missing Content - Actionable */}
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:800,fontSize:16,marginBottom:10}}>Missing content</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <MissingCard label="Topics missing nodes A–E" value={stats.missingNodes} href="/admin/content-health?filter=missing-nodes" />
          <MissingCard label="Topics with <3 questions" value={stats.lessThan3Qs} href="/admin/question-coverage?filter=less3" />
          <MissingCard label="Topics missing paper/section" value={stats.missingPaper} href="/admin/content-health?filter=missing-paper" />
        </div>
      </div>

      {/* Completion Table */}
      <div style={{marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:16,marginBottom:10}}>Completion by subject</div>
        <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.6fr 0.9fr 0.5fr 0.6fr",padding:"12px 14px",fontSize:11,color:"#6b7280",fontWeight:700,letterSpacing:0.5,borderBottom:"1px solid #252a44"}}>
            <div>SUBJECT</div><div>TOPICS</div><div>SCAFFOLDED</div><div>≥3 QS</div><div>IN REVIEW</div>
          </div>
          <Row subj="Mathematics" topics={167} scaff={28} qs={97} review={0} />
          <Row subj="Physical Sciences" topics={252} scaff={142} qs={89} review={0} />
        </div>
      </div>

      {/* Quick Tools */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        <QuickLink label="Lesson Manager" href="/admin/lessons" icon="📚" />
        <QuickLink label="Question Bank" href="/admin/questions" icon="❓" />
        <QuickLink label="Content Health" href="/admin/content-health" icon="🩺" />
        <QuickLink label="Factory" href="/admin/factory" icon="🏭" />
      </div>

      {/* Review Lessons - Fixed Search */}
      <div>
        <div style={{fontSize:20,fontWeight:900}}>Review Lessons</div>
        <div style={{fontSize:13,color:"#94a3b8",marginTop:4,marginBottom:12}}>Search any lesson and jump straight into the editor.</div>
        
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:14,top:12,color:"#64748b"}}>🔍</span>
          <input 
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search subject, unit, topic, or lesson title..."
            style={{width:"100%",background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px 14px 12px 38px",color:"white",outline:"none",fontSize:14}}
          />
        </div>

        <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:20,textAlign:"center",color:"#64748b"}}>
          {search ? `Searching for "${search}"... Connect this to Supabase lessons table` : "Type to search lessons (Mathematics, Physical Sciences)"}
          <div style={{marginTop:12}}>
            <Link href="/admin/lessons/new" style={{background:"#232646",color:"white",padding:"8px 14px",borderRadius:10,textDecoration:"none",fontSize:13}}> + Create New Lesson</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({icon,label,value,color="#fff"}:{icon:string,label:string,value:number,color?:string}){
  return(
    <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px"}}>
      <div style={{fontSize:18}}>{icon}</div>
      <div style={{fontSize:12,color:"#94a3b8",marginTop:6}}>{label}</div>
      <div style={{fontSize:26,fontWeight:900,marginTop:4,color}}>{value}</div>
    </div>
  );
}
function MissingCard({label,value,href}:{label:string,value:number,href:string}){
  return(
    <Link href={href} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px",display:"flex",justifyContent:"space-between",alignItems:"center",textDecoration:"none"}}>
      <div>
        <div style={{fontSize:12,color:"#94a3b8"}}>{label}</div>
        <div style={{fontSize:26,fontWeight:900,color:"#ef4444",marginTop:2}}>{value}</div>
      </div>
      <div style={{color:"#7c7cff",fontSize:18}}>›</div>
    </Link>
  );
}
function Row({subj,topics,scaff,qs,review}:{subj:string,topics:number,scaff:number,qs:number,review:number}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.6fr 0.9fr 0.5fr 0.6fr",padding:"14px",fontSize:14,borderBottom:"1px solid #1e223a",alignItems:"center"}}>
      <div style={{fontWeight:700}}>{subj}</div>
      <div style={{textAlign:"center"}}>{topics}</div>
      <div style={{textAlign:"center"}}>{scaff}</div>
      <div style={{textAlign:"center"}}>{qs}</div>
      <div style={{textAlign:"center",color:"#eab308"}}>{review}</div>
    </div>
  );
}
function QuickLink({label,href,icon}:{label:string,href:string,icon:string}){
  return <Link href={href} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px",textDecoration:"none",color:"white",fontSize:13,fontWeight:600,display:"flex",gap:8,alignItems:"center"}}><span>{icon}</span> {label}</Link>
}
