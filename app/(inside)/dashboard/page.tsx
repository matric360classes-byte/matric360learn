"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage(){
  const [name,setName]=useState("Mike Sibanda");
  const router=useRouter();
  useEffect(()=>{
    const n=localStorage.getItem("matric360_name");
    if(n) setName(n);
  },[]);

  const goMaths = ()=> router.push("/subjects/mathematics");
  const goPhysics = ()=> router.push("/subjects/physical-sciences");
  const goContinue = ()=> {
    const last = localStorage.getItem("last_studied_unit") || "/subjects/mathematics";
    router.push(last);
  };

  return(
    <div style={{padding:"8px 4px 90px"}}>
      <div style={{margin:"10px 0 18px 4px"}}>
        <div style={{fontSize:14,color:"#9ca3af"}}>Welcome back</div>
        <div style={{fontSize:24,fontWeight:900,marginTop:2}}>{name}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        <div style={{background:"#181a29",border:"1px solid #252a44",borderRadius:16,padding:"14px"}}>
          <div style={{fontSize:12,color:"#9ca3af"}}>Streak</div>
          <div style={{fontSize:22,fontWeight:800,marginTop:8}}>1<span style={{fontSize:13,color:"#9ca3af"}}> d</span></div>
        </div>
        <div style={{background:"#181a29",border:"1px solid #252a44",borderRadius:16,padding:"14px"}}>
          <div style={{fontSize:12,color:"#9ca3af"}}>XP</div>
          <div style={{fontSize:22,fontWeight:800,marginTop:8}}>15945</div>
        </div>
        <div style={{background:"#181a29",border:"1px solid #252a44",borderRadius:16,padding:"14px"}}>
          <div style={{fontSize:12,color:"#9ca3af"}}>Progress</div>
          <div style={{fontSize:22,fontWeight:800,marginTop:8}}>48%</div>
        </div>
      </div>

      <div style={{background:"#181a29",border:"1px solid #252a44",borderRadius:18,padding:"16px",marginBottom:16}}>
        <div style={{fontWeight:700,marginBottom:12}}>Daily goal</div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
          <div><b style={{fontSize:16}}>0</b> <span style={{color:"#9ca3af"}}>/ 100 XP today</span></div>
          <div style={{color:"#9ca3af"}}>0%</div>
        </div>
        <div style={{height:8,background:"#232946",borderRadius:999,marginTop:10}}><div style={{width:"2%",height:"100%",background:"#6366f1"}}></div></div>
      </div>

      {/* CONTINUE LEARNING = RECENTLY STUDIED - CLICKABLE */}
      <div onClick={goContinue} style={{background:"linear-gradient(180deg,#1c1f3a,#171a2e)",border:"1px solid #4f46e5",borderRadius:18,padding:"16px",marginBottom:18,cursor:"pointer"}}>
        <div style={{fontSize:11,color:"#818cf8",marginBottom:8}}>CONTINUE LEARNING • RECENTLY STUDIED</div>
        <div style={{fontWeight:800}}>Arithmetic Sequences</div>
        <div style={{fontSize:13,color:"#9ca3af",marginTop:4}}>Node A - Exam Hook - Concepts</div>
        <div style={{marginTop:12,color:"#818cf8",fontWeight:700,fontSize:14}}>Resume &gt;</div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <div style={{fontWeight:700,color:"#c7c7d1"}}>Your subjects</div>
        <button onClick={()=>router.push("/subjects")} style={{color:"#818cf8",background:"transparent",border:0,fontSize:13,cursor:"pointer"}}>See all</button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {/* Mathematics CLICKABLE */}
        <div onClick={goMaths} style={{background:"#181a29",border:"1px solid #252a44",borderRadius:18,padding:"16px",cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:12}}><div style={{width:40,height:40,borderRadius:999,background:"#2a2d4a",display:"grid",placeItems:"center"}}>M</div><div><div style={{fontWeight:800}}>Mathematics</div><div style={{fontSize:12,color:"#9ca3af"}}>16 units in progress</div></div></div>
            <div style={{fontSize:13,color:"#9ca3af"}}>59%</div>
          </div>
          <div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:12}}><div style={{width:"59%",height:"100%",background:"#818cf8"}}></div></div>
        </div>

        {/* Physical Sciences CLICKABLE */}
        <div onClick={goPhysics} style={{background:"#181a29",border:"1px solid #252a44",borderRadius:18,padding:"16px",cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:12}}><div style={{width:40,height:40,borderRadius:999,background:"#2a2d4a",display:"grid",placeItems:"center"}}>P</div><div><div style={{fontWeight:800}}>Physical Sciences</div><div style={{fontSize:12,color:"#9ca3af"}}>12 units</div></div></div>
            <div style={{fontSize:13,color:"#9ca3af"}}>26%</div>
          </div>
          <div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:12}}><div style={{width:"26%",height:"100%",background:"#818cf8"}}></div></div>
        </div>
      </div>
    </div>
  );
}
