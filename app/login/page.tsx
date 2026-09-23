"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage(){
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleLogin=()=>{
    if(!email.includes("@")){ setError("Enter valid email"); return }
    if(password.length<6){ setError("Password must be at least 6 chars"); return }

    setLoading(true)
    setError("")

    // Save real user
    const realName = email.split("@")[0] || "Learner"
    localStorage.setItem("matric360_name", realName)
    localStorage.setItem("matric360_email", email)

    // Add to all users list so Admin sees him
    const all = JSON.parse(localStorage.getItem("matric360_all_users") || "[]")
    if(!all.find((u:any)=>u.email===email)){
      all.push({
        id: Date.now().toString(),
        name: realName,
        email: email,
        phone: "+27 XX XXX XXXX",
        role: "Student",
        plan_name: "FREE",
        plan_price: 0,
        billing_cycle: "monthly",
        subscription_status: "Active",
        created_at: new Date().toLocaleDateString(),
        last_login: new Date().toLocaleDateString()
      })
      localStorage.setItem("matric360_all_users", JSON.stringify(all))
    }

    // TODO: Replace with Supabase later:
    // const {error} = await supabase.auth.signInWithPassword({email,password})

    router.push("/dashboard")
  }

  const handleGoogle=()=>{
    // For now fake Google, later: supabase.auth.signInWithOAuth({provider:'google'})
    const gEmail = "google.user@gmail.com"
    const gName = "Google User"
    localStorage.setItem("matric360_name", gName)
    localStorage.setItem("matric360_email", gEmail)
    const all = JSON.parse(localStorage.getItem("matric360_all_users") || "[]")
    all.push({
      id: Date.now().toString(),
      name: gName, email: gEmail, phone: "+27 XX XXX XXXX",
      role:"Student", plan_name:"FREE", plan_price:0, billing_cycle:"monthly",
      subscription_status:"Active", created_at:new Date().toLocaleDateString(), last_login:new Date().toLocaleDateString()
    })
    localStorage.setItem("matric360_all_users", JSON.stringify(all))
    router.push("/dashboard")
  }

  return(
    <div style={{minHeight:"100vh",background:"#0a0d1a",color:"white",padding:20,display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <h1 style={{fontWeight:900,fontSize:28}}>Welcome back</h1>
      <p style={{color:"#94a3b8",fontSize:13,marginTop:6}}>Login to continue</p>

      <button onClick={handleGoogle} style={{marginTop:20,background:"white",color:"black",padding:14,borderRadius:12,border:"none",fontWeight:700,width:"100%",cursor:"pointer"}}>Continue with Google</button>
      <div style={{textAlign:"center",color:"#64748b",fontSize:12,margin:"16px 0"}}>or</div>

      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",marginBottom:10}}/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6)" type="password" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white"}}/>
      {error && <div style={{background:"#ef444420",color:"#ef4444",padding:10,borderRadius:10,fontSize:12,marginTop:10}}>{error}</div>}

      <button onClick={handleLogin} disabled={loading} style={{marginTop:14,background:"#fbbf24",color:"black",padding:14,borderRadius:12,border:"none",fontWeight:800,width:"100%",cursor:"pointer"}}>
        {loading?"Signing in...":"Sign In"}
      </button>

      <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"#94a3b8"}}>
        No account? <Link href="/signup" style={{color:"#fbbf24",fontWeight:700}}>Sign up</Link>
      </div>
    </div>
  )
}
