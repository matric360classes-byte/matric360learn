"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage(){
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [show,setShow]=useState(false);
  const [stay,setStay]=useState(true);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  const handleLogin = async () => {
    setLoading(true); setMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if(error){ setMsg(error.message); setLoading(false); return; }
    const realName = data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || email.split('@')[0];
    localStorage.setItem("matric360_name", realName);
    localStorage.setItem("matric360_google_name", realName);
    localStorage.setItem("matric360_email", email);
    localStorage.setItem("matric360_user", JSON.stringify(data.user));
    router.push("/dashboard");
  };

  const googleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/dashboard" } });
  };

  return(
    <div style={{minHeight:"100vh",background:"#0a0d1a",display:"flex",justifyContent:"center",padding:"40px 20px",color:"white"}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{textAlign:"center",color:"#475569",marginBottom:24,fontSize:13}}>— Matric360</div>
        <h1 style={{fontSize:34,fontWeight:900}}>Welcome back</h1>
        <p style={{color:"#64748b",marginTop:6,fontSize:14}}>Sign in to continue studying.</p>

        <button onClick={googleLogin} style={{width:"100%",marginTop:24,background:"#1a1c32",border:"1px solid #2a2d4a",padding:14,borderRadius:16,color:"white",fontWeight:700,display:"flex",justifyContent:"center",gap:8,cursor:"pointer"}}>
          <span style={{color:"#ef4444",fontWeight:900}}>G</span> Continue with Google
        </button>

        <div style={{textAlign:"center",color:"#475569",fontSize:12,margin:"18px 0"}}>or</div>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="megaluno28@gmail.com" style={{width:"100%",padding:"14px 16px",borderRadius:14,border:"1px solid #2a2d4a",background:"white",color:"black",marginBottom:12}}/>
        <div style={{position:"relative",marginBottom:12}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} type={show?"text":"password"} placeholder="Password" style={{width:"100%",padding:"14px 16px",borderRadius:14,border:"1px solid #2a2d4a",background:"white",color:"black"}}/>
          <span onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:14,cursor:"pointer"}}>👁️</span>
        </div>

        <label style={{display:"flex",gap:8,alignItems:"center",fontSize:13,color:"#94a3b8"}}><input type="checkbox" checked={stay} onChange={e=>setStay(e.target.checked)}/> Stay signed in on this device</label>

        {msg && <div style={{marginTop:10,color:"#fbbf24",fontSize:13}}>{msg}</div>}

        <button onClick={handleLogin} disabled={loading} style={{width:"100%",marginTop:18,background:"#93c5fd",color:"#0f172a",padding:14,borderRadius:16,fontWeight:800,border:"none",cursor:"pointer"}}>{loading?"Signing in...":"Sign in"}</button>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:16,fontSize:13,color:"#94a3b8"}}>
          <Link href="/forgot-password" style={{color:"#94a3b8",textDecoration:"none"}}>Forgot password?</Link>
          <Link href="/signup" style={{color:"#94a3b8",textDecoration:"none"}}>Create account</Link>
        </div>
      </div>
    </div>
  )
}
