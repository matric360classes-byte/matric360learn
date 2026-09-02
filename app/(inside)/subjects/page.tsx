"use client";
import { useRouter } from "next/navigation";

export default function SubjectsPage(){
  const router = useRouter();

  return(
    <div style={{padding:"8px 4px 90px"}}>
      <h1 style={{fontSize:26,fontWeight:900,margin:"12px 0 16px 4px"}}>Subjects</h1>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Mathematics */}
        <div 
          onClick={()=>router.push("/subjects/mathematics")}
          style={{background:"#1a1f35",border:"1px solid #2a324f",borderRadius:18,padding:"20px 18px",cursor:"pointer"}}>
          <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Mathematics</div>
          <div style={{fontSize:14,color:"#a1a1b5",lineHeight:"1.4"}}>CAPS-aligned exam practice, worked solutions and progress tracking.</div>
        </div>

        {/* Physical Sciences */}
        <div 
          onClick={()=>router.push("/subjects/physical-sciences")}
          style={{background:"#1a1f35",border:"1px solid #2a324f",borderRadius:18,padding:"20px 18px",cursor:"pointer"}}>
          <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Physical Sciences</div>
          <div style={{fontSize:14,color:"#a1a1b5",lineHeight:"1.4"}}>CAPS Grade 12 Physical Sciences — Physics and Chemistry combined.</div>
        </div>
      </div>
    </div>
  );
}
