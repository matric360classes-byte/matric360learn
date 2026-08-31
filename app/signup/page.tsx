"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [show,setShow]=useState(false);
  return(
    <div style={{background:"#0e0e14",minHeight:"100vh",color:"white",padding:"24px 20px"}}>
      <Link href="/" style={{color:"#8b8da3",textDecoration:"none",fontSize:14,display:"flex",justifyContent:"center",marginTop:60,marginBottom:40}}>← Matric360</Link>
      <div style={{maxWidth:360,margin:"0 auto"}}>
        <h1 style={{fontSize:26,fontWeight:800,margin:0}}>Create account</h1>
        <p style={{color:"#8b8da3",fontSize:14,marginTop:8,marginBottom:24}}>Start learning in 30 seconds.</p>
        <button onClick={()=>{localStorage.setItem("matric360_user",JSON.stringify({email:"google@gmail.com",provider:"google"})); router.push("/dashboard")}} style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px",color:"white",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer"}}>
          <span style={{background:"white",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#EA4335"}}>G</span> Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}><div style={{height:1,flex:1,background:"#2a2c3d"}}></div><div style={{fontSize:12,color:"#6b6d85"}}>or</div><div style={{height:1,flex:1,background:"#2a2c3d"}}></div></div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px 16px",color:"white",outline:"none",boxSizing:"border-box"}}/>
        <div style={{position:"relative",marginTop:12}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type={show?"text":"password"} style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px 16px",paddingRight:44,color:"white",outline:"none",boxSizing:"border-box"}}/>
          <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#8b8da3"}}>{show?"🙈":"👁️"}</button>
        </div>
        <button onClick={()=>{localStorage.setItem("matric360_user",JSON.stringify({email})); router.push("/dashboard")}} style={{width:"100%",background:"#7c6cff",color:"white",border:"none",borderRadius:14,padding:"15px",fontWeight:700,marginTop:16}}>Create account</button>
        <div style={{textAlign:"center",marginTop:14}}><Link href="/login" style={{color:"#8b8da3",fontSize:12,textDecoration:"none"}}>Already have account? Sign in</Link></div>
      </div>
    </div>
  )
}
