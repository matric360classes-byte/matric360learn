"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function DashboardPage(){
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(!user){
        router.push("/login")
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if(loading){
    return <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>Loading...</div>
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
        <h1 style={{fontWeight:900,fontSize:24}}>Matric360 Learn</h1>
        <button onClick={handleLogout} style={{background:"#1a1d2f",border:"1px solid #252a44",color:"white",padding:"8px 16px",borderRadius:8,cursor:"pointer"}}>Logout</button>
      </div>
      
      <div style={{marginTop:30,background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:20}}>
        <h2 style={{fontSize:18,fontWeight:700}}>Welcome, {user?.user_metadata?.full_name || user?.email}</h2>
        <p style={{color:"#94a3b8",fontSize:13,marginTop:6}}>{user?.email}</p>
        <p style={{color:"#22c55e",fontSize:12,marginTop:10}}>✓ Auth working! You are inside dashboard.</p>
      </div>

      <div style={{marginTop:20,display:"grid",gap:12}}>
        <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:16}}>
          <h3 style={{fontWeight:700}}>📚 My Subjects</h3>
          <p style={{color:"#64748b",fontSize:12,marginTop:4}}>Your learning content will be here</p>
        </div>
        <Link href="/pricing" style={{background:"#fbbf24",color:"black",padding:16,borderRadius:12,textAlign:"center",fontWeight:800,textDecoration:"none"}}>Upgrade to Premium →</Link>
      </div>
    </div>
  )
}
