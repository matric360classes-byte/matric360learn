"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../lib/subjects";

export default function UnitsPage(){
  const params = useParams();
  let id = (params?.id as string) || "mathematics";
  if(id==="physical-science") id="physical-sciences";
  if(id==="maths") id="mathematics";

  const allData = SUBJECTS_DATA as any;
  const subject = allData[id] || allData["mathematics"];

  if(!subject){
    return <div style={{padding:20, color:"#fff", background:"#0a0a12", minHeight:"100vh"}}>Subject not found: {id}</div>;
  }

  const sections = subject.sections || [{title: subject.name || "Units", units: subject.units || []}];
  const flatUnits = sections.flatMap((s:any)=> s.units || []);

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", padding:"14px 16px 90px", color:"#fff"}}>
      <div style={{fontSize:13, color:"#6a6a7a"}}>Subjects &gt; {subject.name}</div>
      <h1 style={{fontSize:32, fontWeight:900, marginTop:6}}>{subject.name}</h1>
      <p style={{color:"#8a8a9a", fontSize:14, marginTop:6}}>{subject.desc || ""}</p>

      {flatUnits.length===0 && <div style={{marginTop:20, color:"#888"}}>No units found — check lib/subjects.ts has sections/units</div>}

      <div style={{marginTop:18, display:"grid", gap:14}}>
        {sections.map((sec:any, si:number)=>(
          <div key={si}>
            {sections.length>1 && sec.title && (
              <div style={{background:"#15151f", border:"1px solid #222", borderRadius:16, padding:"12px 14px", marginBottom:12}}>
                <div style={{fontSize:10, color:"#777"}}>SECTION</div>
                <div style={{fontSize:18, fontWeight:800}}>{sec.title}</div>
              </div>
            )}
            <div style={{display:"grid", gap:12}}>
              {(sec.units || []).map((u:any)=>{
                const count = (u.topics || u.subTopics || []).length;
                return(
                  <Link key={u.id} href={`/subjects/${id}/${u.id}`} style={{textDecoration:"none"}}>
                    <div style={{background:"#1c1c28", border:"1px solid #2a2a3a", borderRadius:18, padding:16}}>
                      <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div>
                          <div style={{fontSize:10, color:"#777", fontWeight:700}}>{u.unit || `UNIT ${si+1}`}</div>
                          <div style={{fontSize:18, fontWeight:800, color:"#fff", marginTop:4}}>{u.title || u.id}</div>
                          <div style={{marginTop:8, fontSize:12, color:"#8a8a9a"}}>✓ Completed · {count} topics</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontWeight:800}}>100%</div>
                          <div style={{marginTop:8, background:"#2a2a4a", color:"#8b8bff", padding:"6px 12px", borderRadius:20, fontSize:12, fontWeight:700}}>Continue &gt;</div>
                        </div>
                      </div>
                      <div style={{marginTop:12, height:6, background:"#2a2a3a", borderRadius:10}}>
                        <div style={{width:"100%", height:"100%", background:"#7a7aff", borderRadius:10}}/>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
