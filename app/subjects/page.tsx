import { SUBJECTS, LESSONS } from "../../lib/lessons";
import Link from "next/link";

export default function Page() {
  return (
    <div style={{padding:24, maxWidth:800, margin:"0 auto", fontFamily:"sans-serif"}}>
      <h1 style={{fontSize:28, fontWeight:"bold"}}>Choose Subject</h1>
      <p style={{color:"#666", marginTop:8}}>Matric 360 - CAPS Mind the Gap</p>
      <div style={{marginTop:20}}>
        {SUBJECTS.map(s => {
          const count = LESSONS.filter(l => l.subjectId === s.id).length;
          return (
            <Link key={s.id} href={`/subjects/${s.id}`} style={{display:"block", border:"1px solid #ddd", borderRadius:12, padding:16, marginTop:12, textDecoration:"none", color:"black"}}>
              <b>{s.name}</b> - {count} topics <span style={{float:"right", color:"blue"}}>Open →</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
