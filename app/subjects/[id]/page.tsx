import { SUBJECTS_DATA } from "@/lib/subjects";
import Link from "next/link";

export default function SubjectDetail({ params }: { params: { id: string } }) {
  const subject = SUBJECTS_DATA[params.id];
  if (!subject) return <div style={{padding:20,color:"white"}}>Subject not found</div>;

  return (
    <div style={{background:"#0b0b12", minHeight:"100vh", color:"#fff", paddingBottom:80}}>
      <header style={{padding:"14px 16px", borderBottom:"1px solid #1e1e2a", display:"flex", justifyContent:"space-between", position:"sticky", top:0, background:"#0b0b12"}}>
        <Link href="/" style={{fontWeight:800}}>‹ {subject.name}</Link>
        <span style={{border:"1px solid #333", borderRadius:20, padding:"4px 10px", fontSize:12}}>🛡️ Content • 📶 Online</span>
      </header>

      <div style={{padding:"16px"}}>
        {/* Purple Progress Card like screenshot */}
        <div style={{background:"#7c3aed", borderRadius:16, padding:16, marginBottom:20}}>
          <div style={{fontSize:13, opacity:0.8}}>Progress</div>
          <div style={{fontSize:28, fontWeight:800, marginTop:4}}>30%</div>
          <div style={{background:"rgba(0,0,0,0.3)", height:6, borderRadius:10, marginTop:10}}>
            <div style={{background:"#fff", width:"30%", height:6, borderRadius:10}} />
          </div>
        </div>

        {subject.sections.map((sec:any)=>(
          <div key={sec.title} style={{marginBottom:24}}>
            <div style={{fontSize:12, letterSpacing:1.2, color:"#888", fontWeight:700, marginBottom:12}}>{sec.title}</div>
            <div style={{display:"grid", gap:12}}>
              {sec.units.map((unit:any)=>(
                <Link key={unit.id} href={`/subjects/${params.id}/${unit.id}`} style={{background:"#15151f", border:"1px solid #2a2a3a", borderRadius:16, padding:16, display:"block"}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{fontWeight:700}}>{unit.title}</div>
                    <div style={{color:"#666"}}>›</div>
                  </div>
                  <div style={{color:"#666", fontSize:12, marginTop:8}}>{unit.topics.length} topics</div>
                  <div style={{background:"#0b0b12", height:4, borderRadius:10, marginTop:8}}>
                    <div style={{background:subject.color, width:`${unit.progress}%`, height:4, borderRadius:10}} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
