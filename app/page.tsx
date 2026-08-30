"use client";
import { SUBJECTS_DATA } from "../../lib/subjects";

export default function Page() {
  const data:any = SUBJECTS_DATA;
  const math = data.mathematics;
  const units = math?.sections?.[0]?.units || [];

  return (
    <div style={{background:"black", color:"white", padding:"20px", minHeight:"100vh"}}>
      <h1 style={{fontSize:"24px", fontWeight:"bold"}}>Level 2 - Units</h1>
      <p style={{color:"gray"}}>Build: {new Date().toLocaleString()}</p>
      <div style={{marginTop:"20px", display:"grid", gap:"12px"}}>
        {units.map((u:any)=>(
          <div key={u.id} style={{background:"#222", padding:"16px", borderRadius:"12px"}}>
            <div style={{fontWeight:"bold"}}>{u.unit} - {u.title}</div>
            <div style={{fontSize:"12px", color:"#aaa"}}>{u.subTopics?.length} topics - ID: {u.id}</div>
          </div>
        ))}
      </div>
      <a href="/" style={{display:"block", marginTop:"20px", color:"cyan"}}>← Home</a>
    </div>
  );
}
