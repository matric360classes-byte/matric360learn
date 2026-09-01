"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage(){
  const router = useRouter();
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [pass,setPass]=useState("");
  const [confirm,setConfirm]=useState("");
  const [show1,setShow1]=useState(false);
  const [show2,setShow2]=useState(false);
  const [agreeContact,setAgreeContact]=useState(false);
  const [agreeUpdates,setAgreeUpdates]=useState(false);
  const [stay,setStay]=useState(false);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  const handleSignup = async () => {
    if(!fullName ||!email ||!pass){ setMsg("Fill all fields"); return; }
    if(pass.length<6){ setMsg("Password min 6 chars"); return; }
    if(pass!==confirm){ setMsg("Passwords don't match"); return; }
    if(!agreeContact){ setMsg("You must agree to contact storage"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: fullName, phone: "+27"+phone } }
    });
    if(error){ setMsg(error.message); setLoading(false); return; }
    localStorage.setItem("matric360_name", fullName);
    localStorage.setItem("matric360_email", email);
    localStorage.setItem("matric360_phone", "+27"+phone);
    if(data.user) localStorage.setItem("matric360_user", JSON.stringify(data.user));
    router.push("/dashboard");
  };

  const googleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/dashboard" } });
  };

  return(
    <div style={{minHeight:"100vh",background:"#0a0d1a",display:"flex",justifyContent:"center",padding:"40px 20px",color:"white"}}>
      <div style={{width:"100%",maxWidth:480}}>
        <h1 style={{fontSize:30,fontWeight:900}}>Create your account</h1>
        <p style={{color:"#64748b",fontSize:14,marginTop:4}}>Free forever. Upgrade any time.</p>

        <button onClick={googleSignup} style={{width:"100%",marginTop:22,background:"#1a1c32",border:"1px solid #2a2d4a",padding:14,borderRadius:16,fontWeight:700,display:"flex",justifyContent:"center",gap:8,cursor:"pointer",color:"white"}}>
          <span style={{fontWeight:900,color:"#ef4444"}}>G</span> Continue with Google
        </button>

        <div style={{textAlign:"center",color:"#64748b",fontSize:13,margin:"18px 0"}}>or sign up with email</div>

        <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Enter your full name" style={{width:"100%",padding:"14px 16px",borderRadius:14,background:"#15172a",border:"1px solid #2a2d4a",color:"white",marginBottom:12}}/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",padding:"14px 16px",borderRadius:14,background:"#15172a",border:"1px solid #2a2d4a",color:"white",marginBottom:12}}/>

        <div style={{display:"flex",marginBottom:12,border:"1px solid #2a2d4a",borderRadius:14,overflow:"hidden",background:"#15172a"}}>
          <div style={{padding:"14px 12px",background:"#1e2035",color:"#94a3b8",fontSize:13,fontWeight:700,borderRight:"1px solid #2a2d4a"}}>ZA +27</div>
          <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} placeholder="Contact / WhatsApp number" style={{flex:1,padding:"14px 16px",background:"transparent",border:"none",color:"white"}}/>
        </div>

        <div style={{position:"relative",marginBottom:12}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} type={show1?"text":"password"} placeholder="Password (min 6 characters)" style={{width:"100%",padding:"14px 16px",borderRadius:14,background:"#15172a",border:"1px solid #2a2d4a",color:"white"}}/>
          <span onClick={()=>setShow1(!show1)} style={{position:"absolute",right:14,top:14,cursor:"pointer"}}>👁️</span>
        </div>
        <div style={{position:"relative",marginBottom:14}}>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type={show2?"text":"password"} placeholder="Confirm password" style={{width:"100%",padding:"14px 16px",borderRadius:14,background:"#15172a",border:"1px solid #2a2d4a",color:"white"}}/>
          <span onClick={()=>setShow2(!show2)} style={{position:"absolute",right:14,top:14,cursor:"pointer"}}>👁️</span>
        </div>

        <div style={{background:"#15172a",border:"1px solid #2a2d4a",borderRadius:14,padding:14,display:"flex",flexDirection:"column",gap:10}}>
          <label style={{display:"flex",gap:8,fontSize:12,color:"white"}}><input type="checkbox" checked={agreeContact} onChange={e=>setAgreeContact(e.target.checked)}/> I agree to Matric360 storing my contact details for account support and private admin contact when needed. <span style={{color:"#ef4444"}}>*</span></label>
          <label style={{display:"flex",gap:8,fontSize:12,color:"#94a3b8"}}><input type="checkbox" checked={agreeUpdates} onChange={e=>setAgreeUpdates(e.target.checked)}/> Send me occasional product updates and offers by email.</label>
        </div>

        <p style={{fontSize:11,color:"#94a3b8",marginTop:10,lineHeight:1.4}}>We use your contact / WhatsApp number only for account support and private contact from Matric360 admins when needed. You can update your details anytime in your profile.</p>

        <label style={{display:"flex",gap:8,alignItems:"center",fontSize:13,color:"#94a3b8",marginTop:12}}><input type="checkbox" checked={stay} onChange={e=>setStay(e.target.checked)}/> Stay signed in on this device</label>

        {msg && <div style={{marginTop:12,color:"#fbbf24",fontSize:13}}>{msg}</div>}

        <button onClick={handleSignup} disabled={!agreeContact || loading} style={{width:"100%",marginTop:14,background:agreeContact?"#93c5fd":"#334155",color:agreeContact?"#0f172a":"#94a3b8",padding:14,borderRadius:16,fontWeight:800,border:"none",cursor:agreeContact?"pointer":"not-allowed"}}>{loading?"Creating...":"Create account"}</button>

        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"#94a3b8"}}>Already have an account? <Link href="/login" style={{color:"white",fontWeight:700}}>Sign in</Link></div>
        <div style={{textAlign:"center",marginTop:8,fontSize:13,color:"#94a3b8"}}>Are you a parent? <Link href="/parent-signup" style={{color:"white",fontWeight:700}}>Create a parent account</Link></div>
      </div>
    </div>
  )
}
