"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage(){
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleLogin=async()=>{
    setError("")
    if(!email.includes("@")){ setError("Enter valid email"); return }
    if(password.length<6){ setError("Password must be at least 6 chars"); return }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if(error){ setError(error.message); return }
    router.push("/dashboard")
  }

  const handleGoogle=async()=>{
    setError("")
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:{
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { prompt: 'select_account' } // Forces Gmail chooser
      }
    })
    if(error) setError(error.message)
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
