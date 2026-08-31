"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const router = useRouter();
  const [mode,setMode]=useState<"login"|"signup">("login");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);

  const handleEmailAuth = () => {
    if(mode==="signup" &&!name.trim()){ alert("Enter your full name"); return; }
    if(!email ||!pass){ alert("Enter email and password"); return; }
    setLoading(true);

    // Get final name
    let finalName = name.trim();
    if(mode==="login"){
      finalName = localStorage.getItem("matric360_name") || email.split("@")[0];
    }

    localStorage.setItem("matric360_user", JSON.stringify({
      name: finalName,
      email,
      provider:"email",
      loginAt: Date.now()
    }));
    localStorage.setItem("matric360_name", finalName);

    setTimeout(()=> router.push("/dashboard"), 600);
  };

  const handleGoogle = () => {
    setLoading(true);
    // REAL GOOGLE will return displayName automatically
    // For demo, Google account name = Mike Sibanda (like your screenshot)
    // Later with Supabase: supabase.auth.user().user_metadata.full_name
    const googleName = "Mike Sibanda"; // <-- this comes from Google profile

    localStorage.setItem("matric360_user", JSON.stringify({
      name: googleName,
      email:"mike.sibanda@gmail.com",
      provider:"google",
      loginAt: Date.now()
    }));
    localStorage.setItem("matric360_name", googleName);
    router.push("/dashboard");
  };

  return(
    <div style={{background:"#0e0e14",minHeight:"100vh",color:"white",padding:"24px 20px"}}>
      <Link href="/" style={{color:"#8b8da3",textDecoration:"none",fontSize:14,display:"flex",justifyContent:"center",marginTop:60,marginBottom:40}}>← Matric360</Link>

      <div style={{maxWidth:360,margin:"0 auto"}}>
        <h1 style={{fontSize:26,fontWeight:800,margin:0}}>{mode==="login"?"Welcome back":"Create account"}</h1>
        <p style={{color:"#8b8da3",fontSize:14,marginTop:8,marginBottom:24}}>{mode==="login"?"Sign in to continue studying.":"Start learning in 30 seconds."}</p>

        {/* Toggle */}
        <div style={{display:"flex",background:"#15151f",borderRadius:999,padding:4,marginBottom:16}}>
          <button onClick={()=>setMode("login")} style={{flex:1,padding:"8px",borderRadius:999,border:"none",background:mode==="login"?"#1e293b":"transparent",color:mode==="login"?"white":"#6b6d85",fontWeight:700,fontSize:13}}>Login</button>
          <button onClick={()=>setMode("signup")} style={{flex:1,padding:"8px",borderRadius:999,border:"none",background:mode==="signup"?"#7c6cff":"transparent",color:mode==="signup"?"white":"#6b6d85",fontWeight:700,fontSize:13}}>Sign Up</button>
        </div>

        <button onClick={handleGoogle} style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px",color:"white",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer"}}>
          <span style={{background:"white",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#EA4335"}}>G</span> Continue with Google
        </button>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}><div style={{height:1,flex:1,background:"#2a2c3d"}}></div><div style={{fontSize:12,color:"#6b6d85"}}>or</div><div style={{height:1,flex:1,background:"#2a2c3d"}}></div></div>

        {mode==="signup" && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name - e.g Mike Sibanda" style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px 16px",color:"white",outline:"none",boxSizing:"border-box",marginBottom:12}}/>
        )}

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px 16px",color:"white",outline:"none",boxSizing:"border-box"}}/>

        <div style={{position:"relative",marginTop:12}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type={show?"text":"password"} style={{width:"100%",background:"transparent",border:"1px solid #2a2c3d",borderRadius:12,padding:"14px 16px",paddingRight:44,color:"white",outline:"none",boxSizing:"border-box"}}/>
          <button onClick={()=>setShow(!show)} type="button" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#8b8da3"}}>{show?"🙈":"👁️"}</button>
        </div>

        <button onClick={handleEmailAuth} disabled={loading} style={{width:"100%",background:"#7c6cff",color:"white",border:"none",borderRadius:14,padding:"15px",fontWeight:700,marginTop:16,cursor:"pointer"}}>
          {loading?"Please wait...": mode==="login"?"Sign in":"Create account"}
        </button>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
          <Link href="/forgot-password" style={{color:"#8b8da3",fontSize:12,textDecoration:"none"}}>Forgot password?</Link>
          <button onClick={()=>setMode(mode==="login"?"signup":"login")} style={{background:"none",border:"none",color:"#c2c3d6",fontSize:12,cursor:"pointer"}}>{mode==="login"?"Create account":"Sign in"}</button>
        </div>
      </div>
    </div>
  )
}
