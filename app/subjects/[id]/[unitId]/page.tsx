import { SUBJECTS_DATA } from "@/lib/subjects";
import Link from "next/link";

export default function UnitPage({ params }: { params: { id: string, unitId: string } }) {
  const subject = SUBJECTS_DATA[params.id];
  const unit = subject?.sections.flatMap((s:any)=>s.units).find((u:any)=>u.id===params.unitId);
  if(!unit) return <div style={{padding:20,color:"white"}}>Unit not found</div>;
  return (
    <div style={{background:"#0b0b12", minHeight:"100vh", color:"#fff"}}>
      <header style={{padding:14, borderBottom:"1px solid #1e1e2a"}}><Link href={`/subjects/${params.id}`}>‹ {unit.title}</Link></header>
      <div style={{padding:16, display:"grid", gap:10}}>
        {unit.topics.map((t:string,i:number)=>(
          <Link key={i} href={`/subjects/${params.id}/${params.unitId}/${t.toLowerCase().replace(/\s+/g,'-')}`} style={{background:"#15151f", border:"1px solid #2a2a3a", borderRadius:12, padding:16, display:"flex", justifyContent:"space-between"}}>
            <span>📘 {t}</span><span>›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
