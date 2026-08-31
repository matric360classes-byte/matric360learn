"use client";
import Link from "next/link";

export default function Landing(){
  return(
    <div style={{background:"#0a0a12",minHeight:"100vh",color:"#fff"}}>
      {/* Header */}
      <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1c1c28"}}>
        <div style={{fontWeight:900,letterSpacing:1}}>MATRIC360LEARN</div>
        <Link href="/subjects" style={{background:"#fff",color:"#000",padding:"8px 16px",borderRadius:999,fontSize:12,fontWeight:800,textDecoration:"none"}}>Start Learning</Link>
      </div>

      {/* Hero */}
      <div style={{padding:"40px 20px 20px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"inline-flex",background:"#1c1c28",border:"1px solid #2a2a3a",borderRadius:999,padding:"6px 12px",fontSize:10,letterSpacing:2,color:"#8a8a9a",fontWeight:800}}>GRADE 12 • CAPS ALIGNED • DBE EXAM FOCUSED</div>
        <h1 style={{fontSize:36,lineHeight:1.05,fontWeight:900,marginTop:16,letterSpacing:-1}}>
          Pass Maths & Science<br/>
          <span style={{color:"#6b7280"}}>In One Place.</span>
        </h1>
        <div style={{marginTop:12,color:"#a1a1b5",fontSize:14,lineHeight:1.6,maxWidth:500}}>
          135 exam-focused lessons. 45-minute average video lessons. 
          Built for Grade 12 final exam — formulas, worked examples, common mistakes, exam tips.
        </div>
        <div style={{marginTop:20,display:"flex",gap:10,flexWrap:"wrap"}}>
          <Link href="/subjects" style={{background:"#fff",color:"#000",padding:"14px 22px",borderRadius:999,fontWeight:900,fontSize:14,textDecoration:"none"}}>Start Learning — Free</Link>
          <Link href="/admin/videos" style={{background:"#1c1c28",border:"1px solid #2a2a3a",color:"#fff",padding:"14px 22px",borderRadius:999,fontWeight:800,fontSize:14,textDecoration:"none"}}>Add My Videos</Link>
        </div>

        {/* Stats */}
        <div style={{marginTop:28,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <div style={{background:"#1c1c28",borderRadius:16,padding:16,border:"1px solid #2a2a3a"}}>
            <div style={{fontSize:22,fontWeight:900}}>13</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:2,letterSpacing:1,fontWeight:700}}>MATHS UNITS</div>
            <div style={{fontSize:10,color:"#8a8a9a",marginTop:4}}>Algebra to Probability</div>
          </div>
          <div style={{background:"#1c1c28",borderRadius:16,padding:16,border:"1px solid #2a2a3a"}}>
            <div style={{fontSize:22,fontWeight:900}}>14</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:2,letterSpacing:1,fontWeight:700}}>SCIENCE UNITS</div>
            <div style={{fontSize:10,color:"#8a8a9a",marginTop:4}}>8 Physics + 6 Chemistry</div>
          </div>
          <div style={{background:"#1c1c28",borderRadius:16,padding:16,border:"1px solid #2a2a3a"}}>
            <div style={{fontSize:22,fontWeight:900}}>135</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:2,letterSpacing:1,fontWeight:700}}>LESSONS</div>
            <div style={{fontSize:10,color:"#8a8a9a",marginTop:4}}>A-E + Video</div>
          </div>
        </div>

        {/* How it works */}
        <div style={{marginTop:32}}>
          <div style={{fontSize:11,letterSpacing:2,color:"#6b7280",fontWeight:800}}>HOW EACH LESSON WORKS — 5 NODES</div>
          <div style={{marginTop:12,display:"grid",gap:10}}>
            {[
              {k:"A",t:"Concept Explained",d:"Understand before solving — full explanation in simple language"},
              {k:"B",t:"Formulas & Laws",d:"What to write for marks — formula, substitution, units"},
              {k:"C",t:"Worked Example",d:"DBE past paper style — step-by-step with method marks"},
              {k:"D",t:"Common Mistakes",d:"Where learners lose marks — calculator, units, signs"},
              {k:"E",t:"Exam Tip",d:"Time, marks, what examiner wants — how to get full marks"},
            ].map(n=>(
              <div key={n.k} style={{background:"#1c1c28",borderRadius:12,padding:14,display:"flex",gap:12,border:"1px solid #222233"}}>
                <div style={{width:28,height:28,borderRadius:8,background:"#0a0a12",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,border:"1px solid #2a2a3a"}}>{n.k}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:800}}>{n.t}</div>
                  <div style={{fontSize:11,color:"#8a8a9a",marginTop:2}}>{n.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginTop:32,paddingBottom:30,textAlign:"center",color:"#3a3a4a",fontSize:11}}>
          Locked v156 • Maths + Science • 45min average • 80min max • Unlisted videos supported
        </div>
      </div>
    </div>
  );
}
