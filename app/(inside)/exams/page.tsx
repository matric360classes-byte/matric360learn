"use client";
import { useRouter } from "next/navigation";

export default function ExamsPage(){
  const router = useRouter();

  const Card = ({icon,title,desc,beta,color}:{icon:string,title:string,desc:string,beta?:boolean,color:string}) => (
    <div style={{background:color,border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"16px",position:"relative",cursor:"pointer"}}>
      {beta && <span style={{position:"absolute",top:10,right:10,fontSize:10,background:"rgba(255,140,0,0.2)",color:"#ffb26e",border:"1px solid rgba(255,140,0,0.3)",padding:"2px 8px",borderRadius:999}}>BETA</span>}
      <div style={{fontSize:22}}>{icon}</div>
      <div style={{fontWeight:800,marginTop:10,fontSize:16}}>{title}</div>
      <div style={{fontSize:12,color:"#9ca3af",marginTop:6,lineHeight:1.4}}>{desc}</div>
    </div>
  );

  return(
    <div style={{padding:"8px 8px 90px"}}>
      <div style={{fontSize:11,letterSpacing:1.5,color:"#818cf8",fontWeight:700}}>GRADE 12 · MATRIC360</div>
      <div style={{fontSize:28,fontWeight:900,marginTop:6}}>Exam Preparation Hub</div>
      <div style={{fontSize:13,color:"#9ca3af",marginTop:6,lineHeight:1.4}}>One tap to start. Train under exam conditions, fix weak spots, track readiness.</div>

      {/* Start Practice - RECOMMENDED */}
      <div onClick={()=>router.push("/subjects")} style={{marginTop:16,background:"linear-gradient(135deg,#8fa8ff,#b9a6ff)",borderRadius:22,padding:"18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
        <div style={{width:52,height:52,background:"rgba(255,255,255,0.9)",borderRadius:16,display:"grid",placeItems:"center",fontSize:22}}>✨</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontWeight:800,fontSize:17,color:"#1e1b4b"}}>Start Practice</span>
            <span style={{fontSize:10,background:"rgba(255,255,255,0.7)",color:"#4f46e5",padding:"2px 8px",borderRadius:999,fontWeight:700}}>RECOMMENDED</span>
          </div>
          <div style={{fontSize:12,color:"#2a2a4a",marginTop:4,opacity:0.8}}>Choose your subject, topic, difficulty and number of questions.</div>
        </div>
        <div style={{fontSize:20,color:"#1e1b4b"}}>→</div>
      </div>

      <div style={{fontSize:12,color:"#9ca3af",marginTop:12}}>Not sure where to start? Begin with Practice.</div>

      <div style={{fontSize:11,letterSpacing:2,color:"#9ca3af",fontWeight:700,marginTop:22,marginBottom:10}}>MORE EXAM TOOLS</div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card icon="⚡" title="Daily Sprint" desc="5 questions. 5 minutes. Every day." color="#2a1f2f" beta />
        <Card icon="🎯" title="Weak Areas" desc="Practice the topics holding you back, automatically." color="#2e1f2f" beta />
        <Card icon="📝" title="Past Papers" desc="Real NSC & Prep papers with memos and video solutions." color="#1e2340" beta />
        <Card icon="🏆" title="Mock Exams" desc="Full exam simulation. Timer, marks, no peeking." color="#1a2e2a" beta />
        <Card icon="🎯" title="Exam Readiness" desc="See how prepared you are for the final CAPS exam." color="#1a2e35" beta />
        <Card icon="🔄" title="Retry Incorrect" desc="Turn your mistakes into strengths." color="#241f3a" beta />
      </div>
    </div>
  );
}
