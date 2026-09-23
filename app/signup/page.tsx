"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage(){
  const router=useRouter()
  const [form,setForm]=useState({name:"",email:"",phone:"",password:""})
  const [error,setError]=useState("")
  const [loading,setLoading]=useState(false)

  const handleSignup=()=>{
    if(!form.name || !form.email || !form.phone || !form.password){ setError("Fill in all fields"); return }
    if(!form.email.includes("@")){ setError("Enter valid email"); return }
    if(form.password.length<6){ setError("Password min 6 chars"); return }

    setLoading(true)

    localStorage.setItem("matric360_name", form.name)
    localStorage.setItem("matric360_email", form.email)
    localStorage.setItem("matric360_plan", JSON.stringify({plan_name:"FREE",plan_price:0,billing_cycle:"monthly",subjects_count:0,subscription_status:"Active"}))

    const all = JSON.parse(localStorage.getItem("matric360_all_users") || "[]")
    all.push({
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      role:"Student",
      plan_name:"FREE",
      plan_price:0,
      billing_cycle:"monthly",
      subscription_status:"Active",
      created_at:new Date().toLocaleDateString(),
      last_login:new Date().toLocaleDateString(),
      subjects_count:0
    })
    localStorage.setItem("matric360_all_users", JSON.stringify(all))

    router.push("/dashboard")
  }

  const handleGoogle=()=>{
    const gName="Google User"; const gEmail="google.user@gmail.com"
    localStorage.setItem("matric360_name", gName)
    localStorage.setItem("matric360_email", gEmail)
    const all = JSON.parse(localStorage.getItem("matric360_all_users") || "[]")
    all.push({
      id: Date.now().toString(),
      name:gName, email:gEmail, phone:"+27 XX XXX XXXX",
      role:"Student", plan_name:"FREE", plan_price:0, billing_cycle:"monthly",
      subscription_status:"Active", created_at:new Date().toLocaleDateString(), last_login:new Date().toLocaleDateString()
    })
    localStorage.setItem("matric360_all_users", JSON.stringify(all))
    router.push("/dashboard")
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>
      <h1 style={{fontWeight:900,fontSize:28,marginTop:20}}>Create account</h1>
      <p style={{color:"#94a3b8",fontSize:13,marginTop:6}}>Join learners on Matric360</p>

      <button onClick={handleGoogle} style={{marginTop:20,background:"white",color:"black",padding:14,borderRadius:12,border:"none",fontWeight:700,width:"100%",cursor:"pointer"}}>Continue with Google</button>
      <div style={{textAlign:"center",color:"#64748b",fontSize:12,margin:"16px 0"}}>or</div>

      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" type="email" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone e.g. 073 118 8782" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password (min 6)" type="password" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",width:"100%",boxSizing:"border-box"}}/>
      
      {error && <div style={{background:"#ef444420",color:"#ef4444",padding:10,borderRadius:10,fontSize:12,marginTop:10}}>{error}</div>}

      <button onClick={handleSignup} disabled={loading} style={{marginTop:14,background:"#fbbf24",color:"black",padding:14,borderRadius:12,border:"none",fontWeight:800,width:"100%",cursor:"pointer"}}>
        {loading?"Creating...":"Create account"}
      </button>

      <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"#94a3b8"}}>
        Have account? <Link href="/login" style={{color:"#fbbf24",fontWeight:700}}>Sign in</Link>
      </div>
    </div>
  )
}
