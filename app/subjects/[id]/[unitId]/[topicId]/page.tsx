import { SUBJECTS_DATA } from "../../../../../lib/subjects";
import Link from "next/link";

function findData(sid:string, uid:string, tid:string){
  const subj=(SUBJECTS_DATA as any)[sid];
  if(!subj) return {unit:null, topic:null, subject:null};
  for(const sec of subj.sections){
    for(const u of sec.units){
      if(u.id===uid){
        const topic = (u.topics||[]).find((t:any)=>t.id===tid);
        return {unit:u, topic: topic||{id:tid, title:tid.replace(/-/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase())}, subject:subj};
      }
    }
  }
  return {unit:null, topic:null, subject:null};
}

export default function Page({ params }: any){
  const { id, unitId, topicId } = params;
  const { unit, topic, subject } = findData(id, unitId, topicId);
  if(!unit ||!topic) return <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>Not found</div>;

  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", paddingBottom:100}}>
      {/* Header */}
      <div style={{padding:"16px 20px 0"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <Link href={`/subjects/${id}/${unitId}`} style={{color:"#9ca3af", fontSize:14, textDecoration:"none"}}>{"<"} {unit.title}</Link>
          <span style={{fontSize:11, padding:"4px 10px", borderRadius:8, background:"#1e293b", color:"#818cf8", border:"1px solid #334155"}}>PUBLISHED</span>
        </div>
        <div style={{marginTop:14, fontSize:13, color:"#6b7280"}}>Subjects &gt; {subject?.name} &gt; <span style={{color:"white"}}>{unit.title}</span></div>
        <h1 style={{fontSize:28, fontWeight:800, marginTop:12, lineHeight:1.2}}>{topic.title}</h1>
        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <span style={{fontSize:11, padding:"5px 10px", borderRadius:20, background:"#1e1b4b", color:"#a5b4fc"}}>Paper 1</span>
          <span style={{fontSize:11, padding:"5px 10px", borderRadius:20, background:"#1f1f23", color:"#9ca3af", border:"1px solid #27272a"}}>Paper 1 — {unit.title}</span>
          <span style={{fontSize:11, padding:"5px 10px", borderRadius:20, background:"#422006", color:"#fbbf24"}}>30% of paper</span>
          <span style={{fontSize:11, padding:"5px 10px", borderRadius:20, background:"#1f1f23", color:"#9ca3af"}}>Difficulty 3/5</span>
        </div>
      </div>

      {/* Video Player */}
      <div style={{margin:"16px", background:"#000", borderRadius:20, overflow:"hidden", border:"1px solid #27272a"}}>
        <div style={{aspectRatio:"16/9", background:"#0a0a0a", display:"flex", flexDirection:"column", position:"relative"}}>
          <div style={{padding:"14px 14px 0", display:"flex", gap:10, alignItems:"center"}}>
            <div style={{width:36, height:36, borderRadius:18, background:"#111", border:"1px solid #27272a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14}}>◍</div>
            <div>
              <div style={{fontWeight:800, fontSize:13, letterSpacing:0.5}}>{unit.title.toUpperCase()}-{topic.title.toUpperCase().slice(0,18)}</div>
              <div style={{fontSize:10, color:"#9ca3af", marginTop:2}}>MATRIC360 LESSONS</div>
            </div>
          </div>
          <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center"}}>
            <div style={{width:68, height:48, background:"#ff0000", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>
              <div style={{width:0, height:0, borderLeft:"16px solid white", borderTop:"10px solid transparent", borderBottom:"10px solid transparent", marginLeft:4}}></div>
            </div>
          </div>
          <div style={{padding:"0 14px 10px", display:"flex", justifyContent:"space-between", fontSize:11, color:"#71717a"}}>
            <span style={{display:"flex", gap:6, alignItems:"center"}}>⧉</span>
            <span style={{display:"flex", gap:4, alignItems:"center"}}>Watch on <span style={{color:"white", fontWeight:700}}>▶ YouTube</span></span>
          </div>
          <div style={{position:"absolute", bottom:10, right:10, fontSize:9, background:"#111", padding:"3px 7px", borderRadius:5, color:"#52525b", border:"1px solid #222"}}>Matric360</div>
        </div>
      </div>

      <div style={{padding:"0 16px", fontSize:11, color:"#6b7280", lineHeight:1.4}}>Content is licensed to your Matric360 account. Sharing, downloading or recording is prohibited.</div>

      {/* Nodes A-E */}
      <div style={{padding:"16px", display:"flex", flexDirection:"column", gap:12, marginTop:4}}>
        {[
          {k:"A", sub:"Exam Hook", title:"Exam Hook"},
          {k:"B", sub:"Learn The Concept", title:"Learn The Concept"},
          {k:"C", sub:"Worked Example", title:"Worked Example"},
          {k:"D", sub:"Examiner Traps", title:"Examiner Traps"},
          {k:"E", sub:"Exam Challenge", title:"Exam Challenge"},
        ].map((n)=>(
          <div key={n.k} style={{background:"#18181b", borderRadius:20, padding:"16px", border:"1px solid #232326", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div style={{display:"flex", gap:14, alignItems:"center"}}>
              <div style={{width:44, height:44, borderRadius:22, background:"#1e1e32", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#818cf8", fontSize:18, border:"1px solid #2a2a4a"}}>{n.k}</div>
              <div>
                <div style={{fontSize:11, color:"#9ca3af"}}>Node {n.k} · {n.sub}</div>
                <div style={{fontWeight:700, fontSize:17, marginTop:2}}>{n.title}</div>
              </div>
            </div>
            <div style={{display:"flex", gap:10, alignItems:"center"}}>
              <span style={{width:26, height:26, borderRadius:13, border:"2px solid #22c55e", color:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800}}>✓</span>
              <span style={{fontSize:11, padding:"6px 10px", borderRadius:20, background:"#1e1e32", color:"#818cf8", border:"1px solid #2a2a4a"}}>⚡ Quick Edit</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
