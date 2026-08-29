import { SUBJECTS_DATA } from "@/lib/subjects";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const subject: any = (SUBJECTS_DATA as any)[params.id];
  if (!subject) return <div style={{padding:24, color:"#fff"}}>Subject {params.id} not found</div>;
  return (
    <div style={{background:"#0b0b12", minHeight:"100vh", color:"#fff"}}>
      <div style={{padding:14, borderBottom:"1px solid #1e1e2a"}}>
        <Link href="/" style={{fontWeight:700}}>‹ Home</Link> <span style={{marginLeft:12}}>{subject.name}</span>
      </div>
      <div style={{padding:16}}>
        <div style={{background:"#7c3aed", borderRadius:16, padding:16, marginBottom:20}}>
          <div style={{fontSize:12, opacity:.8}}>Progress</div>
          <div style={{fontSize:28, fontWeight:800}}>30%</div>
          <div style={{background:"rgba(0,0,0,.3)", height:6, borderRadius:10, marginTop:10}}>
            <div style={{width:"30%", height:6, background:"#fff", borderRadius:10}}/>
          </div>
        </div>
        {subject.sections.map((sec:any)=>(
          <div key={sec.title} style={{marginBottom:24}}>
            <div style={{fontSize:11, color:"#888", fontWeight:700, letterSpacing:1, marginBottom:10}}>{sec.title}</div>
            <div style={{display:"grid", gap:12}}>
              {sec.units.map((u:any)=>(
                <Link key={u.id} href={`/subjects/${params.id}/${u.id}`} style={{background:"#15151f", border:"1px solid #2a2a3a", borderRadius:16, padding:16, display:"block"}}>
                  <div style={{display:"flex", justifyContent:"space-between"}}><b>{u.title}</b><span>›</span></div>
                  <div style={{color:"#666", fontSize:12, marginTop:6}}>{u.topics.length} topics</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
