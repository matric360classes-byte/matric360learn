import { SUBJECTS_DATA } from "../../../../../lib/subjects";
import { getLesson } from "../../../../../lib/lessons";
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
  const lesson = getLesson(topicId);
  if(!unit ||!topic) return <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>Not found</div>;

  const yt = lesson?.youtubeId || "k1R7xQ1PBO0";

  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", paddingBottom:100}}>
      <div style={{padding:"16px 20px 0"}}>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <Link href={`/subjects/${id}/${unitId}`} style={{color:"#9ca3af", fontSize:14, textDecoration:"none"}}>{"<"} {unit.title}</Link>
          <span style={{fontSize:11, padding:"4px 10px", borderRadius:8, background:"#1e293b", color:"#818cf8", border:"1px solid #334155"}}>PUBLISHED</span>
        </div>
        <div style={{marginTop:14, fontSize:13, color:"#6b7280"}}>Subjects &gt; {subject?.name} &gt; <span style={{color:"white"}}>{unit.title}</span></div>
        <h1 style={{fontSize:28, fontWeight:800, marginTop:12}}>{topic.title}</h1>
      </div>

      {/* REAL YOUTUBE */}
      <div style={{margin:"16px", background:"#000", borderRadius:20, overflow:"hidden", border:"1px solid #27272a"}}>
        <div style={{aspectRatio:"16/9"}}>
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${yt}?rel=0`} title={topic.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{width:"100%", height:"100%", aspectRatio:"16/9"}}></iframe>
        </div>
      </div>
      <div style={{padding:"0 16px", fontSize:11, color:"#6b7280"}}>{lesson? "Real lesson loaded" : "Placeholder - Add YouTube ID in lib/lessons.ts"} • Sharing prohibited.</div>

      <div style={{padding:"16px", display:"flex", flexDirection:"column", gap:12, marginTop:4}}>
        {[
          {k:"A", sub:"Exam Hook"},
          {k:"B", sub:"Learn The Concept"},
          {k:"C", sub:"Worked Example"},
          {k:"D", sub:"Examiner Traps"},
          {k:"E", sub:"Exam Challenge"},
        ].map((n)=>{
          const data = lesson?.nodes?.[n.k];
          return (
            <div key={n.k} style={{background:"#18181b", borderRadius:20, padding:"16px", border:"1px solid #232326"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div style={{display:"flex", gap:14, alignItems:"center"}}>
                  <div style={{width:44, height:44, borderRadius:22, background:"#1e1e32", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#818cf8", fontSize:18, border:"1px solid #2a2a4a"}}>{n.k}</div>
                  <div><div style={{fontSize:11, color:"#9ca3af"}}>Node {n.k} · {n.sub}</div><div style={{fontWeight:700, fontSize:17, marginTop:2}}>{data?.title || n.sub}</div></div>
                </div>
                <span style={{width:26, height:26, borderRadius:13, border:"2px solid #22c55e", color:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12}}>✓</span>
              </div>
              {data?.content && <div style={{marginTop:12, fontSize:13, color:"#d4d4d8", background:"#0f0f13", padding:12, borderRadius:12, border:"1px solid #1f1f23", lineHeight:1.5}}>{data.content}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
