"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignupPage(){
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const router=useRouter();
  const handleCreate=()=>{
    localStorage.setItem("matric360_name", fullName || "Learner");
    localStorage.setItem("matric360_email", email);
    router.push("/dashboard");
  };
  return(<div style={{minHeight:"100vh",background:"#0a0d1a",color:"white",display:"flex",justifyContent:"center",padding:40}}><div style={{width:480}}><h1 style={{fontSize:30,fontWeight:900}}>Create your account</h1><input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Enter your full name" style={{width:"100%",padding:14,borderRadius:14,marginTop:20,background:"#15172a",border:"1px solid #2a2d4a",color:"white"}}/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",padding:14,borderRadius:14,marginTop:12,background:"#15172a",border:"1px solid #2a2d4a",color:"white"}}/><button onClick={handleCreate} style={{width:"100%",marginTop:16,padding:14,borderRadius:14,background:"#93c5fd",border:"none",fontWeight:800}}>Create account</button></div></div>)
}
