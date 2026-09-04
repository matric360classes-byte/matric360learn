import { SUBJECTS, LESSONS } from "../../../../lib/lessons";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const subjectId = decodeURIComponent(params.id).toUpperCase();
  const subject = SUBJECTS.find((s: any) => s.id === subjectId);
  const topics = LESSONS.filter((l: any) => l.subjectId === subjectId);

  if (!subject) return <div style={{padding:24}}>Subject {subjectId} not found</div>;

  return (
    <div style={{padding:24, maxWidth:800, margin:"0 auto"}}>
      <Link href="/subjects" style={{color:"blue"}}>← Back to Subjects</Link>
      <h1 style={{marginTop:12}}>{(subject as any).name}</h1>
      <p>{topics.length} topics - CAPS</p>
      {topics.map((t: any) => (
        <Link key={t.id} href={`/lesson/${t.id}`} style={{display:"block", border:"1px solid #ddd", borderRadius:12, padding:16, marginTop:12, textDecoration:"none", color:"black"}}>
          <b>{t.topic || t.title || t.name || t.id}</b><br/>
          <small>{t.examWeight || t.weight || ""}</small>
        </Link>
      ))}
    </div>
  )
}
