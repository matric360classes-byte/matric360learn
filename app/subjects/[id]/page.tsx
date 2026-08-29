import { SUBJECTS_DATA } from "../../../lib/subjects";
import Link from "next/link";

export default function Page({ params }: any) {
  const id = params?.id;
  const subject: any = (SUBJECTS_DATA as any)[id];

  if (!subject) {
    return (
      <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>
        Not found: {id}. Available: {Object.keys(SUBJECTS_DATA).join(", ")}
      </div>
    );
  }

  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", paddingBottom:80}}>
      <div style={{padding:"20px 20px 0 20px"}}>
        <Link href="/subjects" style={{color:"#9ca3af", fontSize:14, textDecoration:"none"}}>{"<"} Subjects</Link>
        <div style={{marginTop:12, color:"#6b7280", fontSize:13}}>Subjects &gt; {subject.name}</div>
        <h1 style={{fontSize:32, fontWeight:800, marginTop:12}}>{subject.name}</h1>
        <p style={{color:"#9ca3af", fontSize:14, marginTop:8}}>{subject.desc}</p>
        <div style={{display:"flex", gap:8, marginTop:16, flexWrap:"wrap"}}>
          <span style={{padding:"7px 14px", borderRadius:20, background:"#6366f1", fontSize:12, fontWeight:600}}>All topics</span>
          <span style={{padding:"7px 14px", borderRadius:20, background:"#1f1f23", color:"#9ca3af", fontSize:12}}>In progress</span>
          <span style={{padding:"7px 14px", borderRadius:20, background:"#1f1f23", color:"#9ca3af", fontSize:12}}>Completed</span>
          <span style={{padding:"7px 14px", borderRadius:20, background:"#1f1f23", color:"#9ca3af", fontSize:12}}>Not started</span>
        </div>
      </div>

      {subject.sections?.map((sec:any, sIdx:number)=>(
        <div key={sIdx} style={{margin:"20px 16px", background:"#18181b", borderRadius:16, border:"1px solid #27272a"}}>
          <div style={{padding:"16px", borderBottom:"1px solid #27272a", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div style={{fontSize:10, color:"#71717a", letterSpacing:1, fontWeight:600}}>SECTION</div>
              <div style={{fontWeight:800, fontSize:20, marginTop:2}}>{sec.title}</div>
            </div>
            <div style={{color:"#71717a", fontSize:20}}>^</div>
          </div>

          <div style={{padding:12, display:"flex", flexDirection:"column", gap:12}}>
            {sec.units?.map((u:any)=>(
              <div key={u.id} style={{background:"#202023", borderRadius:18, padding:16, border:"1px solid #2a2a2e"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div style={{fontSize:11, color:"#71717a", letterSpacing:1, fontWeight:600}}>{u.unit}</div>
                  <div style={{fontWeight:700, fontSize:14}}>{u.progress}%</div>
                </div>
                <div style={{fontWeight:700, fontSize:18, marginTop:6, lineHeight:1.25}}>{u.title}</div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10}}>
                  <div style={{display:"flex", alignItems:"center", gap:7, fontSize:13, color:"#a1a1aa"}}>
                    <span style={{width:20, height:20, borderRadius:10, background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", color:"black", fontSize:12, fontWeight:800}}>✓</span>
                    Completed · {u.topics} topics
                  </div>
                  <div style={{background:"#2a2a4a", color:"#a5b4fc", padding:"7px 14px", borderRadius:20, fontSize:12, fontWeight:600}}>Continue &gt;</div>
                </div>
                <div style={{marginTop:12, height:6, background:"#27272a", borderRadius:10, overflow:"hidden"}}>
                  <div style={{width:`${u.progress}%`, height:"100%", background:"#818cf8", borderRadius:10}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
