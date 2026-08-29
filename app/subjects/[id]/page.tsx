import { subjects } from "@/lib/data/subjects";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const subject = subjects.find(s => s.id === params.id);
  if (!subject) return <div style={{padding:20}}>Subject not found. <Link href="/subjects">Back</Link></div>;
  
  return (
    <div style={{padding:20, maxWidth:800, margin:"0 auto"}}>
      <Link href="/subjects" style={{color:"blue"}}>← All Subjects</Link>
      <h1 style={{fontSize:32, fontWeight:"bold", marginTop:10}}>{subject.name}</h1>
      <div style={{marginTop:20, display:"grid", gap:12}}>
        {(subject.units || []).map((unit:any) => (
          <Link key={unit.id} href={`/subjects/${subject.id}/${unit.id}`} style={{padding:16, border:"1px solid #ddd", borderRadius:12, display:"block"}}>
            <b>{unit.name}</b>
            <div style={{fontSize:13, color:"#666"}}>{(unit.topics||[]).length} topics</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
