"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [show,setShow]=useState(false);
  const [stay,setStay]=useState(true);
  const [loading,setLoading]=useState(false);

  const signIn = () => {
    if(!email || !pass){ alert("Enter email and password"); return; }
    setLoading(true);
    localStorage.setItem("matric360_user", JSON.stringify({email, stay, at: Date.now()}));
    setTimeout(()=> router.push("/dashboard"), 600);
  };

  const google = () => {
    localStorage.setItem("matric360_user", JSON.stringify({email:"google@gmail.com", provider:"google"}));
    router.push("/dashboard");
  };

  return(
    <div style={{background:"#0e0e14",minHeight:"100vh",color:"white",padding:"24px 20px"}}>
      {/* Top */}
      <Link href="/" style={{color:"#8b8da3",textDecoration:"none",fontSize:14,display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginTop:60,marginBottom:40}}>
        ← Matric360
      </Link>

      <div style={{maxWidth:360,margin:"0 auto"}}>
        <h1 style={{fontSize:26,fontWeight:800,margin:0}}>Welcome back</h1>
        <p style={{color:"#8b8da3",fontSize:14,marginTop:8,marginBottom:24}}>Sign in to continue studying.</p>

        {/* Google */}
        <button onClick={google} style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px",color:"white",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer"}}>
          <span style={{background:"white",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#EA4335",fontSize:16}}>G</span>
          Continue with Google
        </button>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}>
          <div style={{height:1,flex:1,background:"#2a2c3d"}}></div>
          <div style={{fontSize:12,color:"#6b6d85"}}>or</div>
          <div style={{height:1,flex:1,background:"#2a2c3d"}}></div>
        </div>

        {/* Email */}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px 16px",color:"white",outline:"none",fontSize:14,boxSizing:"border-box"}}/>

        {/* Password */}
        <div style={{position:"relative",marginTop:12}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type={show?"text":"password"} style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px 16px",paddingRight:44,color:"white",outline:"none",fontSize:14,boxSizing:"border-box"}}/>
          <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#8b8da3",cursor:"pointer"}}>
            {show? "🙈" : "👁️"}
          </button>
        </div>

        {/* Stay signed in */}
        <label style={{display:"flex",alignItems:"center",gap:8,marginTop:14,cursor:"pointer"}}>
          <input type="checkbox" checked={stay} onChange={e=>setStay(e.target.checked)} style={{width:16,height:16,accentColor:"#7c6cff",borderRadius:4}}/>
          <span style={{fontSize:12,color:"#8b8da3"}}>Stay signed in on this device</span>
        </label>

        {/* Sign in */}
        <button onClick={signIn} disabled={loading} style={{width:"100%",background:"#7c6cff",color:"white",border:"none",borderRadius:14,padding:"15px",fontWeight:700,fontSize:15,cursor:"pointer",marginTop:16}}>
          {loading?"Signing in...":"Sign in"}
        </button>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
          <Link href="/forgot-password" style={{color:"#8b8da3",fontSize:12,textDecoration:"none"}}>Forgot password?</Link>
          <Link href="/signup" style={{color:"#c2c3d6",fontSize:12,textDecoration:"none"}}>Create account</Link>
        </div>
      </div>
    </div>
  )
}
