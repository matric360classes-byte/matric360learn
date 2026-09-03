"use client";
import { useRouter } from "next/navigation";

export default function ProgressPage(){
  const router = useRouter();
  
  return(
    <div style={{padding:"8px 8px 90px"}}>
      <div style={{fontSize:26,fontWeight:900}}>Your progress</div>

      {/* Mastery-weighted */}
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"18px",marginTop:16}}>
        <div style={{fontSize:13,color:"#9ca3af"}}>Mastery-weighted progress</div>
        <div style={{fontSize:36,fontWeight:900,marginTop:6}}>29%</div>
        <div style={{height:8,background:"#2a2d4a",borderRadius:999,marginTop:12,overflow:"hidden"}}>
          <div style={{width:"29%",height:"100%",background:"#7c7cff"}}></div>
        </div>
        <div style={{fontSize:12,color:"#9ca3af",marginTop:10,lineHeight:1.4}}>Based on quiz scores and lesson mastery, not just lessons opened.</div>
      </div>

      {/* Curriculum */}
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"18px",marginTop:14}}>
        <div style={{fontSize:13,color:"#9ca3af"}}>Curriculum completion</div>
        <div style={{fontSize:36,fontWeight:900,marginTop:6}}>36%</div>
        <div style={{height:8,background:"#2a2d4a",borderRadius:999,marginTop:12,overflow:"hidden"}}>
          <div style={{width:"36%",height:"100%",background:"#6b7280"}}></div>
        </div>
        <div style={{fontSize:12,color:"#9ca3af",marginTop:10}}>755 of 2095 learning nodes complete</div>
      </div>

      <div style={{fontSize:14,fontWeight:700,color:"#9ca3af",marginTop:18,marginBottom:8}}>Mastery by subject</div>

      {/* Maths */}
      <div onClick={()=>router.push("/subjects/mathematics")} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:18,padding:"14px",marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",gap:8}}>
          <div style={{fontWeight:800,whiteSpace:"nowrap"}}>Mathematics</div>
          <div style={{fontSize:13,color:"#9ca3af"}}>You are 30% through Grade 12 Mathematics (based on mastery)</div>
        </div>
        <div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:12}}><div style={{width:"30%",height:"100%",background:"#7c7cff"}}></div></div>
      </div>

      {/* Physics */}
      <div onClick={()=>router.push("/subjects/physical-sciences")} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:18,padding:"14px",marginBottom:14,cursor:"pointer"}}>
        <div style={{display:"flex",gap:8}}>
          <div style={{fontWeight:800,whiteSpace:"nowrap"}}>Physical<br/>Sciences</div>
          <div style={{fontSize:13,color:"#9ca3af"}}>You are 28% through Grade 12 Physical Sciences (based on mastery)</div>
        </div>
        <div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:12}}><div style={{width:"28%",height:"100%",background:"#7c7cff"}}></div></div>
      </div>

      {/* Milestones */}
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"16px",marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:800,display:"flex",gap:8}}><span>🏅</span> Milestones</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>4 earned</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span style={{color:"#7c7cff"}}>📖</span> First lesson</div>
          <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span style={{color:"#ff7a45"}}>🔥</span> First streak</div>
          <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span style={{color:"#facc15"}}>⭐</span> First mastery</div>
          <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span style={{color:"#ff7a45"}}>🔥</span> 7-day streak</div>
        </div>
      </div>

      <div style={{fontSize:14,fontWeight:700,color:"#9ca3af",marginBottom:8}}>Recent quizzes</div>

      {[
        ["Practice session · 28/07/2026","6/31"],
        ["Practice session · 28/07/2026","16/20"],
        ["Practice session · 28/07/2026","8/20"],
        ["Practice session · 28/07/2026","16/20"],
        ["Practice session · 28/07/2026","4/20"],
      ].map(([l,r],i)=>(
        <div key={i} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:999,padding:"14px 16px",display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:13}}>{l}</div>
          <div style={{fontWeight:700,fontSize:14}}>{r}</div>
        </div>
      ))}
    </div>
  );
}
