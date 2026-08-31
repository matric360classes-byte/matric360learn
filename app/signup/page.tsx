"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#15172a",border:"1px solid #2a2d4a",borderRadius:24,padding:24,width:"100%",maxWidth:380}}>
        <div style={{fontWeight:900,fontSize:22,textAlign:"center"}}>Create your free account</div>
        <div style={{color:"#94a3b8",fontSize:12,textAlign:"center",marginTop:6}}>Start learning in 30 seconds</div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",background:"#0f111f",border:"1px solid #2a2d4a",borderRadius:12,padding:"12px 14px",color:"white",marginTop:16}}/>
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" style={{width:"100%",background:"#0f111f",border:"1px solid #2a2d4a",borderRadius:12,padding:"12px 14px",color:"white",marginTop:10}}/>
        <button onClick={()=>{localStorage.setItem("matric360_user",JSON.stringify({email})); router.push("/dashboard")}} style={{width:"100%",background:"#fbbf24",color:"black",border:"none",borderRadius:12,padding:"12px",fontWeight:800,marginTop:16}}>Start Free →</button>
        <div style={{textAlign:"center",fontSize:12,color:"#94a3b8",marginTop:12}}>Have account? <Link href="/login" style={{color:"#38bdf8",textDecoration:"none"}}>Login</Link></div>
      </div>
    </div>
  )
}
