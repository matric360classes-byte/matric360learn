"use client";
import Link from "next/link";

export default function SubjectsListPage(){
  return(
    <div style={{background:"#0e0e14",minHeight:"100vh",color:"white",paddingBottom:90}}>
      <header style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",borderBottom:"1px solid #1a1a26",background:"#0e0e14",position:"sticky",top:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"#15151f",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</div>
          <div style={{fontWeight:800,display:"flex",gap:8}}><div style={{width:28,height:28,background:"#7c6cff",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>M</div> Matric360</div>
        </div>
        <div style={{fontSize:12,background:"#15151f",borderRadius:999,padding:"6px 12px",color:"#22c55e"}}>● Online</div>
      </header>

      <div style={{padding:16,maxWidth:480,margin:"0 auto"}}>
        <h1 style={{fontSize:28,fontWeight:900}}>Subjects</h1>
        <div style={{color:"#8b8da3",fontSize:13,marginTop:6}}>Your 2 locked subjects with all units and nodes</div>

        <Link href="/subjects/mathematics" style={{textDecoration:"none",display:"block",marginTop:20}}>
          <div style={{background:"#15151f",border:"1px solid #2a2a4a",borderRadius:20,padding:20}}>
            <div style={{fontWeight:800,fontSize:18,color:"white"}}>Mathematics</div>
            <div style={{color:"#8b8da3",fontSize:13,marginTop:8}}>13 Units • Nodes A/B/C • YouTube placeholders • Worked examples</div>
            <div style={{marginTop:12,color:"#8b8cff",fontWeight:700,fontSize:13}}>Open →</div>
          </div>
        </Link>

        <Link href="/subjects/physical-sciences" style={{textDecoration:"none",display:"block",marginTop:12}}>
          <div style={{background:"#15151f",border:"1px solid #2a2a4a",borderRadius:20,padding:20}}>
            <div style={{fontWeight:800,fontSize:18,color:"white"}}>Physical Sciences</div>
            <div style={{color:"#8b8da3",fontSize:13,marginTop:8}}>12 Units • Physics + Chemistry • Checklist + Formulas</div>
            <div style={{marginTop:12,color:"#8b8cff",fontWeight:700,fontSize:13}}>Open →</div>
          </div>
        </Link>
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#11111a",borderTop:"1px solid #1e1e2e",display:"flex",justifyContent:"space-around",padding:"8px 0 10px"}}>
        <Link href="/dashboard" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>⌂</div><div style={{fontSize:11}}>Dashboard</div></Link>
        <div style={{textAlign:"center",color:"#8b8cff"}}><div style={{fontSize:22}}>📖</div><div style={{fontSize:11,fontWeight:700}}>Subjects</div></div>
        <Link href="/exams" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>📋</div><div style={{fontSize:11}}>Exams</div></Link>
        <Link href="/progress" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>📊</div><div style={{fontSize:11}}>Progress</div></Link>
        <Link href="/profile" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>👤</div><div style={{fontSize:11}}>Profile</div></Link>
      </div>
    </div>
  )
}
