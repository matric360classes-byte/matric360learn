import { LESSONS } from "../../../../lib/lessons";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const subjectId = decodeURIComponent(params.id).toUpperCase();
  
  // Show topics even if SUBJECTS list doesn't have MATHS
  const topics = (LESSONS as any[]).filter((l: any) => {
    const sid = (l.subjectId || l.subject || "").toString().toUpperCase();
    return sid === subjectId || sid.includes(subjectId) || subjectId.includes(sid);
  });

  return (
    <div style={{padding:24, maxWidth:800, margin:"0 auto"}}>
      <Link href="/subjects" style={{color:"blue"}}>← Back to Subjects</Link>
      <h1 style={{marginTop:12, fontSize:28, fontWeight:"bold"}}>{subjectId}</h1>
      <p style={{color:"#666"}}>{topics.length} topics found - Approved CAPS</p>

      {topics.length === 0 && (
        <div style={{marginTop:20, padding:16, background:"#fff3cd", borderRadius:8}}>
          No lessons found for {subjectId} in lib/lessons.ts — but page is working again!
        </div>
      )}

      <div style={{marginTop:20}}>
        {topics.map((t: any) => (
          <Link key={t.id} href={`/lesson/${t.id}`} style={{display:"block", border:"1px solid #ddd", borderRadius:12, padding:16, marginTop:12, textDecoration:"none", color:"black", background:"white"}}>
            <b>{t.topic || t.title || t.name || t.id}</b>
            <div style={{fontSize:13, color:"#666", marginTop:4}}>
              {t.examWeight || t.weight || ""} {t.paper ? `| Paper ${t.paper}` : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
