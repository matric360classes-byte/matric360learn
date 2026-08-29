import { SUBJECTS_DATA } from "@/lib/subjects";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const subject: any = (SUBJECTS_DATA as any)[params.id];
  if (!subject) {
    return (
      <div style={{padding:20}}>
        <h2>Subject not found: {params.id}</h2>
        <Link href="/subjects" style={{color:"blue"}}>← Back to subjects</Link>
      </div>
    );
  }
  return (
    <div style={{padding:20, maxWidth:800, margin:"0 auto"}}>
      <Link href="/subjects" style={{color:"blue"}}>← All Subjects</Link>
      <h1 style={{fontSize:32, fontWeight:"bold", marginTop:10}}>{subject.name}</h1>
      <p style={{color:"#666"}}>{subject.desc}</p>
      <div style={{marginTop:20}}>
        {subject.sections?.map((sec:any, idx:number) => (
          <div key={idx} style={{marginTop:24}}>
            <h2 style={{fontWeight:"bold", background:"#f3f4f6", padding:8, borderRadius:8}}>{sec.title}</h2>
            <div style={{display:"grid", gap:10, marginTop:10}}>
              {sec.units?.map((u:any) => (
                <div key={u.id} style={{padding:14, border:"1px solid #ddd", borderRadius:10}}>
                  <b>{u.title}</b>
                  <div style={{fontSize:12, color:"#666"}}>{u.topics?.length} topics • {u.progress}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
