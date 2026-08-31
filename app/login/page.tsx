"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);

  const handleLogin = () => {
    if(!email || !pass){ alert("Enter email and password"); return; }
    setLoading(true);
    // Simple demo login - replace with Supabase/Auth later
    localStorage.setItem("matric360_user", JSON.stringify({email, loginAt: Date.now()}));
    setTimeout(()=>{
      router.push("/dashboard"); // where student goes after login
    },800);
  };

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#15172a",border:"1px solid #2a2d4a",borderRadius:24,padding:24,width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontWeight:900,fontSize:22}}>Matric<span style={{color:"#38bdf8"}}>3</span><span style={{color:"#fbbf24"}}>60</span></div>
          <div style={{color:"#94a3b8",fontSize:13,marginTop:6}}>Welcome back! Login to continue learning</div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" type="email" style={{width:"100%",background:"#0f111f",border:"1px solid #2a2d4a",borderRadius:12,padding:"12px 14px",color:"white",outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>PASSWORD</div>
            <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" type="password" style={{width:"100%",background:"#0f111f",border:"1px solid #2a2d4a",borderRadius:12,padding:"12px 14px",color:"white",outline:"none"}}/>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{background:"#fbbf24",color:"black",border:"none",borderRadius:12,padding:"12px",fontWeight:800,cursor:"pointer",marginTop:4}}>
            {loading?"Logging in...":"Login"}
          </button>

          <div style={{textAlign:"center",fontSize:12,color:"#64748b"}}>
            <Link href="/forgot-password" style={{color:"#38bdf8",textDecoration:"none"}}>Forgot password?</Link>
          </div>

          <div style={{height:1,background:"#2a2d4a",margin:"4px 0"}}></div>

          <div style={{textAlign:"center",fontSize:12,color:"#94a3b8"}}>
            No account? <Link href="/signup" style={{color:"#fbbf24",fontWeight:700,textDecoration:"none"}}>Start Free</Link>
          </div>
          <div style={{textAlign:"center"}}>
            <Link href="/" style={{color:"#475569",fontSize:11,textDecoration:"none"}}>← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
