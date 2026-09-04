import { SUBJECTS, LESSONS } from "../../../../lib/lessons";
import Link from "next/link";

export default function Page({ params }: { params: { subjectId: string } }) {
  const subjectId = decodeURIComponent(params.subjectId).toUpperCase();
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const topics = LESSONS.filter(l => l.subjectId === subjectId);

  if (!subject) return <div style={{padding:24}}>Subject {subjectId} not found</div>;

  return (
    <div style={{padding:24, maxWidth:800, margin:"0 auto"}}>
      <Link href="/subjects" style={{color:"blue"}}>← Back</Link>
      <h1 style={{marginTop:12}}>{subject.name}</h1>
      <p>{topics.length} topics</p>
      {topics.map(t => (
        <Link key={t.id} href={`/lesson/${t.id}`} style={{display:"block", border:"1px solid #ddd", borderRadius:12, padding:16, marginTop:12, textDecoration:"none", color:"black"}}>
          <b>{t.topic}</b> - {t.examWeight}
        </Link>
      ))}
    </div>
  )
}
