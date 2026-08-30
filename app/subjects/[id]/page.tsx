"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../lib/subjects";

export default function UnitsPage() {
  const params = useParams();
  const id = params.id as string;
  const subject = (SUBJECTS_DATA as any)[id];

  if (!subject) return <div style={{padding:20}}>Subject not found</div>;

  const allUnits = subject.sections.flatMap((s:any) => s.units.map((u:any) => ({...u, sectionTitle: s.title})));

  return (
    <div style={{padding:20, maxWidth:900, margin:"0 auto"}}>
      <Link href="/">← Home</Link>
      <h1 style={{fontSize:28, fontWeight:800, marginTop:12}}>{subject.name}</h1>
      <p>{subject.desc}</p>

      <div style={{display:"grid", gap:16, marginTop:20}}>
        {allUnits.map((unit:any) => (
          <Link key={unit.id} href={`/subjects/${id}/${unit.id}`}
            style={{border:"1px solid #ddd", borderRadius:12, padding:16, display:"block", background:"#fff"}}>
            <div style={{fontSize:12, opacity:0.6, fontWeight:700}}>{unit.unit} • {unit.sectionTitle}</div>
            <div style={{fontSize:18, fontWeight:700, marginTop:4}}>{unit.title}</div>
            <div style={{fontSize:13, opacity:0.7, marginTop:6}}>{unit.topics?.length || unit.subTopics?.length || 0} topics</div>
            <div style={{marginTop:8, fontSize:13, color:"#2563eb"}}>Open →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
