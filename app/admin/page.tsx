"use client";
import Link from "next/link";
export default function AdminLanding(){
  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"20px"}}>
        <div><h1 style={{fontSize:"22px",fontWeight:900,margin:0}}>CAPS Content Factory</h1><p style={{color:"#6b7280",fontSize:"13px"}}>Command center for Grade 12 curriculum production.</p></div>
        <Link href="/admin/factory" style={{background:"#8b8bff",color:"#000",padding:"12px 16px",borderRadius:"14px",fontWeight:700,fontSize:"13px",textDecoration:"none"}}>Open Content Studio</Link>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
        <div style={{background:"#151725",borderRadius:"20px",padding:"16px",border:"1px solid #1e2238"}}><div>📖</div><div style={{color:"#9ca3af",fontSize:"12px"}}>Total topics</div><div style={{fontSize:"28px",fontWeight:900}}>419</div></div>
        <div style={{background:"#151725",borderRadius:"20px",padding:"16px",border:"1px solid #1e2238"}}><div>✅</div><div style={{color:"#9ca3af",fontSize:"12px"}}>Published</div><div style={{fontSize:"28px",fontWeight:900,color:"#00ff88"}}>418</div></div>
        <div style={{background:"#151725",borderRadius:"20px",padding:"16px",border:"1px solid #1e2238"}}><div>❗</div><div style={{color:"#9ca3af",fontSize:"12px"}}>Missing CAPS meta</div><div style={{fontSize:"28px",fontWeight:900,color:"#facc15"}}>268</div></div>
      </div>
      <div style={{marginTop:"24px",background:"#151725",borderRadius:"20px",padding:"16px",border:"1px solid #252a44"}}>
        <div style={{fontWeight:800,marginBottom:"12px"}}>Missing content</div>
        <div style={{color:"#ff3b3b"}}>Topics missing nodes A-E: 249</div>
        <div style={{color:"#ff3b3b"}}>Topics with &lt;3 questions: 233</div>
        <div style={{color:"#ff3b3b"}}>Topics missing paper/section: 268</div>
      </div>
    </div>
  )
}
