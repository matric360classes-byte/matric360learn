"use client";
import Link from "next/link";

export default function AdminPage(){
  return (
    <div style={{padding:"16px",background:"#0f111e",minHeight:"100vh",color:"white",fontFamily:"Inter,system-ui"}}>
      
      <div style={{background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.35)",borderRadius:16,padding:"14px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:"#22c55e",fontWeight:800,fontSize:14}}>Content Admin mode — LIVE</div>
          <div style={{color:"#94a3b8",fontSize:12,marginTop:2}}>Lessons • Videos • CAPS • Question Bank</div>
        </div>
        <div style={{background:"#22c55e",color:"#0f111e",fontSize:11,fontWeight:900,padding:"4px 8px",borderRadius:20}}>GREEN</div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:16}}>
        <div>
          <div style={{fontSize:22,fontWeight:900,letterSpacing:-0.5}}>CAPS Content Factory</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>Command center for Grade 12 • 419 topics wired</div>
        </div>
        <Link href="/admin/lessons" style={{background:"#818cf8",color:"#0f111e",padding:"10px 16px",borderRadius:14,fontWeight:800,fontSize:13,textDecoration:"none"}}>Open Studio →</Link>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Stat label="Total topics" value="419" icon="📖" />
        <Stat label="Published" value="418" icon="✅" color="#22c55e" />
        <Stat label="Missing CAPS meta" value="268" icon="✨" color="#eab308" />
        <Stat label="Needs changes" value="0" icon="🚨" color="#ef4444" />
      </div>

      <div style={{fontWeight:800,marginBottom:8,fontSize:14}}>Missing content</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        <Card title="Topics missing nodes A-E" value="249" color="#ef4444" href="/admin/lessons" />
        <Card title="Topics with <3 questions" value="233" color="#ef4444" href="/admin/lessons" />
        <Card title="Topics missing video" value="251" color="#eab308" href="/admin/lessons" />
      </div>

      <div style={{fontWeight:800,marginBottom:8,fontSize:14}}>Completion by subject</div>
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,overflow:"hidden",marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1.6fr 0.5fr 0.8fr",padding:"10px 14px",fontSize:11,color:"#6b7280",fontWeight:700,letterSpacing:0.5}}><div>SUBJECT</div><div>TOPICS</div><div>SCAFFOLDED</div></div>
        <Row subj="Mathematics" topics="167" scaff="28" />
        <Row subj="Physical Sciences" topics="252" scaff="142" />
      </div>

      <Link href="/admin/lessons" style={{display:"block",background:"#232646",border:"1px solid #2e335e",color:"white",padding:"14px",borderRadius:14,textAlign:"center",fontWeight:700,textDecoration:"none",fontSize:14}}>Go to Review Lessons → Lesson Manager</Link>
    </div>
  );
}

function Stat({label,value,icon,color="#fff"}:{label:string,value:string,icon:string,color?:string}){
  return <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px"}}><div style={{fontSize:16}}>{icon}</div><div style={{fontSize:11,color:"#94a3b8",marginTop:6}}>{label}</div><div style={{fontSize:24,fontWeight:900,marginTop:2,color}}>{value}</div></div>
}
function Card({title,value,color,href}:{title:string,value:string,color:string,href:string}){
  return <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,color:"#94a3b8"}}>{title}</div><div style={{fontSize:24,fontWeight:900,marginTop:2,color}}>{value}</div></div><Link href={href} style={{color:"#818cf8",fontSize:13,fontWeight:700,textDecoration:"none"}}>Fix →</Link></div>
}
function Row({subj,topics,scaff}:{subj:string,topics:string,scaff:string}){
  return <div style={{display:"grid",gridTemplateColumns:"1.6fr 0.5fr 0.8fr",padding:"12px 14px",fontSize:13,borderTop:"1px solid #252a44"}}><div style={{fontWeight:600}}>{subj}</div><div style={{color:"#94a3b8"}}>{topics}</div><div style={{color:"#22c55e",fontWeight:700}}>{scaff}</div></div>
}
