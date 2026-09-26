"use client";
import { useRouter } from "next/navigation";

export default function ExamsHubPage(){
  const router = useRouter();
  return(
    <div style={{padding:"12px 12px 90px", background:"#0a0a12", minHeight:"100vh", color:"white"}}>
      <div style={{fontSize:11,letterSpacing:2,color:"#818cf8",fontWeight:700}}>GRADE 12 · MATRIC360</div>
      <div style={{fontSize:28,fontWeight:900,marginTop:6}}>Exam Preparation Hub</div>
      <div style={{fontSize:13,color:"#9ca3af",marginTop:6,lineHeight:1.4}}>One tap to start. Train under exam conditions, fix weak spots, track readiness.</div>

      {/* START PRACTICE - THIS WIRES TO PIC 2 */}
      <div onClick={()=>router.push("/exams/practice")} style={{marginTop:18,background:"linear-gradient(135deg,#8fa8ff,#b9a6ff)",borderRadius:22,padding:"18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",boxShadow:"0 8px 24px rgba(143,168,255,0.3)"}}>
        <div style={{width:52,height:52,background:"rgba(255,255,255,0.9)",borderRadius:16,display:"grid",placeItems:"center",fontSize:22}}>✨</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontWeight:800,fontSize:17,color:"#1e1b4b"}}>Start Practice</span>
            <span style={{fontSize:10,background:"rgba(255,255,255,0.7)",color:"#4f46e5",padding:"2px 8px",borderRadius:999,fontWeight:700}}>RECOMMENDED</span>
          </div>
          <div style={{fontSize:12,color:"#2a2a4a",marginTop:4}}>Choose your subject, topic, difficulty and number of questions.</div>
        </div>
        <div style={{fontSize:22,color:"#1e1b4b"}}>→</div>
      </div>

      <div style={{fontSize:12,color:"#9ca3af",marginTop:14}}>Not sure where to start? Begin with Practice.</div>
      <div style={{fontSize:11,letterSpacing:2,color:"#9ca3af",fontWeight:700,marginTop:24,marginBottom:12}}>MORE EXAM TOOLS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          {icon:"⚡",title:"Daily Sprint",desc:"5 questions. 5 minutes. Every day."},
          {icon:"🎯",title:"Weak Areas",desc:"Practice the topics holding you back, automatically."},
          {icon:"📝",title:"Past Papers",desc:"Real NSC & Prep papers with memos and video solutions."},
          {icon:"🏆",title:"Mock Exams",desc:"Full exam simulation. Timer, marks, no peeking."},
          {icon:"🎯",title:"Exam Readiness",desc:"See how prepared you are for the final CAPS exam."},
          {icon:"🔄",title:"Retry Incorrect",desc:"Turn your mistakes into strengths."},
        ].map(c=>(
          <div key={c.title} style={{background:"#1a1a24",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:16,position:"relative"}}>
            <span style={{position:"absolute",top:10,right:10,fontSize:9,background:"rgba(255,140,0,0.2)",color:"#ffb26e",border:"1px solid rgba(255,140,0,0.3)",padding:"2px 8px",borderRadius:999}}>BETA</span>
            <div style={{fontSize:22}}>{c.icon}</div>
            <div style={{fontWeight:800,marginTop:10}}>{c.title}</div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:6,lineHeight:1.4}}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
