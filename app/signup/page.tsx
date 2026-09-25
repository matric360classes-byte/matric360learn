"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage(){
  const router = useRouter()
  const supabase = createClient()
  const [form,setForm]=useState({name:"",email:"",password:""})
  const [error,setError]=useState("")
  const [loading,setLoading]=useState(false)
  const [success,setSuccess]=useState(false)

  const handleSignup=async()=>{
    if(!form.name || !form.email || !form.password){ setError("Fill all fields"); return }
    if(form.password.length < 6){ setError("Password must be 6+ characters"); return }
    setLoading(true)
    setError("")
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options:{
        data:{ full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
      }
    })
    setLoading(false)
    if(error){ setError(error.message); return }
    if(data.user){
      if(data.session){
        router.push("/dashboard")
      } else {
        setSuccess(true)
      }
    }
  }

  const handleGoogle=async()=>{
    const { error } = await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{ redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`, queryParams:{ prompt:'select_account' } }
    })
    if(error) setError(error.message)
  }

  if(success){
    return(
      <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <h1 style={{fontWeight:900,fontSize:24}}>Check your email 📧</h1>
        <p style={{color:"#94a3b8",marginTop:10,textAlign:"center"}}>We sent a confirmation link to {form.email}. Click it to activate account.</p>
        <Link href="/login" style={{marginTop:20,background:"#fbbf24",color:"black",padding:14,borderRadius:12,fontWeight:800,textDecoration:"none",width:"100%",textAlign:"center"}}>Go to Login</Link>
      </div>
    )
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>
      <h1 style={{fontWeight:900,fontSize:28,marginTop:20}}>Create account</h1>
      <p style={{color:"#94a3b8",fontSize:13,marginTop:6}}>Join Matric360 Learn</p>
      <button onClick={handleGoogle} style={{marginTop:20,background:"white",color:"black",padding:14,borderRadius:12,border:"none",fontWeight:700,width:"100%",cursor:"pointer"}}>Continue with Google</button>
      <div style={{textAlign:"center",color:"#64748b",fontSize:12,margin:"16px 0"}}>or with email</div>
      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" type="email" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",width:"100%",boxSizing:"border-box",marginBottom:10}}/>
      <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password (6+ chars)" type="password" style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"white",width:"100%",boxSizing:"border-box"}}/>
      {error && <div style={{background:"#ef444420",color:"#ef4444",padding:10,borderRadius:10,fontSize:12,marginTop:10}}>{error}</div>}
      <button onClick={handleSignup} disabled={loading} style={{marginTop:14,background:"#fbbf24",color:"black",padding:14,borderRadius:12,border:"none",fontWeight:800,width:"100%",cursor:"pointer"}}>{loading?"Creating...":"Create account"}</button>
      <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"#94a3b8"}}>Have account? <Link href="/login" style={{color:"#fbbf24",fontWeight:700}}>Sign in</Link></div>
    </div>
  )
}
