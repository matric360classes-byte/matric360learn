import Link from "next/link";
import { SUBJECTS_DATA } from "@/lib/subjects";

export default function Home() {
  return (
    <div style={{background:"#0b0b12", minHeight:"100vh", color:"#fff", fontFamily:"system-ui", padding:"20px"}}>
      <header style={{display:"flex", justifyContent:"space-between", marginBottom:"30px"}}>
        <b>Matric360</b>
        <span style={{border:"1px solid #333", padding:"4px 10px", borderRadius:"20px", fontSize:"12px"}}>Online</span>
      </header>
      <h1 style={{fontSize:"32px"}}>Welcome to Matric360</h1>
      <p style={{color:"#888"}}>Choose a subject to continue</p>
      <div style={{display:"grid", gap:"12px", marginTop:"20px"}}>
        {Object.keys(SUBJECTS_DATA).map((key)=>{
          const s = SUBJECTS_DATA[key];
          return (
            <Link key={key} href={`/subjects/${s.slug || key}`} style={{textDecoration:"none", background:"#15151f", border:"1px solid #2a2a3a", borderRadius:"16px", padding:"20px"}}>
              <div style={{color:"#fff", fontWeight:"bold", fontSize:"18px"}}>{s.name}</div>
              <div style={{color:"#888", fontSize:"13px", marginTop:"4px"}}>{s.desc}</div>
              <div style={{marginTop:"10px", color:"#8b7bff", fontSize:"13px"}}>Open →</div>
            </Link>
          )
        })}
      </div>
      <div style={{marginTop:"30px", textAlign:"center"}}>
        <Link href="/subjects" style={{background:"#8b7bff", color:"#fff", padding:"12px 24px", borderRadius:"30px", textDecoration:"none", display:"inline-block"}}>View All Subjects</Link>
      </div>
    </div>
  )
}
