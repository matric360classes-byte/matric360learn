import { SUBJECTS_DATA } from "../../../lib/subjects";
import Link from "next/link";

export default function Page({ params }: any) {
  const id = params?.id || "physical-sciences";
  const subject: any = (SUBJECTS_DATA as any)[id];

  if (!subject) {
    return (
      <div style={{padding:20}}>
        <Link href="/subjects" style={{color:"blue"}}>← Back</Link>
        <p>Not found: {id}</p>
        <p>Available: {Object.keys(SUBJECTS_DATA).join(", ")}</p>
      </div>
    );
  }

  return (
    <div style={{padding:20}}>
      <Link href="/subjects" style={{color:"blue"}}>← All Subjects</Link>
      <h1 style={{fontSize:28, fontWeight:"bold", marginTop:10}}>{subject.name}</h1>
      <p style={{color:"#666"}}>{subject.desc}</p>

      {subject.sections?.map((s:any, i:number)=>(
        <div key={i} style={{marginTop:20}}>
          <h2 style={{padding:8, background:"#f3f4f6", borderRadius:8, fontWeight:"bold"}}>{s.title}</h2>
          {s.units?.map((u:any)=>(
            <div key={u.id} style={{marginTop:8, padding:12, border:"1px solid #ddd", borderRadius:8, background:"white"}}>
              <b>{u.title}</b>
              <div style={{fontSize:12, color:"#666"}}>{u.topics?.length || 0} topics</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
