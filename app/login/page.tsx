"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage(){
  const [email,setEmail]=useState("");
  const router=useRouter();
  const handleLogin=()=>{
    const realName = email.split("@")[0] || "Learner";
    localStorage.setItem("matric360_name", realName);
    localStorage.setItem("matric360_email", email);
    router.push("/dashboard");
  };
  return(<div style={{minHeight:"100vh",background:"#0a0d1a",color:"white",display:"flex",justifyContent:"center",padding:40}}><div style={{width:440}}><h1 style={{fontSize:34,fontWeight:900}}>Welcome back</h1><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",padding:14,borderRadius:14,marginTop:20,color:"black"}}/><button onClick={handleLogin} style={{width:"100%",marginTop:16,padding:14,borderRadius:14,background:"#93c5fd",border:"none",fontWeight:800}}>Sign in</button></div></div>)
}
