import Link from "next/link";
import { LESSONS } from "../../../../lib/lessons";

export default function Page({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id).toUpperCase();
  const allLessons = (LESSONS as any[]) || [];

  const list = allLessons.filter((l: any) => {
    const s = (l.subjectId || l.subject || "").toString().toUpperCase();
    return s === id || s.includes(id);
  });

  return (
    <div style={{padding:24, maxWidth:800, margin:"0 auto"}}>
      <Link href="/subjects" style={{color:"#3b82f6"}}>← Back to Subjects</Link>
      <h1 style={{marginTop:12, fontSize:28, fontWeight:"bold"}}>{id}</h1>
      <p style={{color:"#666"}}>{list.length} approved CAPS topics</p>
      
      {list.map((t: any) => (
        <Link key={t.id} href={`/lesson/${t.id}`} style={{display:"block", border:"1px solid #333", padding:16, marginTop:12, borderRadius:12, textDecoration:"none", color:"white", background:"#1a1a1a"}}>
          <b>{t.topic || t.title || t.name || t.id}</b>
          <div style={{fontSize:12, color:"#888", marginTop:4}}>{t.examWeight || t.weight || ""}</div>
        </Link>
      ))}

      {list.length === 0 && <p style={{marginTop:20, color:"orange"}}>No lessons found for {id} — but route is working! Check lib/lessons.ts has subjectId: "{id}"</p>}
    </div>
  )
}
