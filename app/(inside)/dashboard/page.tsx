"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage(){
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(!user){
        router.push("/login")
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  },[])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if(loading){
    return <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>Loading...</div>
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student"

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white"}}>
      <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1e233a"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>☰</span>
          <span style={{fontWeight:900,fontSize:18}}>Matric360</span>
        </div>
        <span style={{color:"#22c55e",fontSize:12}}>● Online</span>
      </div>

      <div style={{padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h1 style={{fontWeight:900,fontSize:26}}>Matric360 Learn</h1>
          <button onClick={handleLogout} style={{background:"#1e233a",color:"white",border:"none",padding:"10px 18px",borderRadius:12,fontSize:13,cursor:"pointer"}}>Logout</button>
        </div>

        <div style={{marginTop:24,background:"#151a2d",borderRadius:20,padding:20,border:"1px solid #1e233a"}}>
          <h2 style={{fontWeight:800,fontSize:18}}>Welcome, {displayName}</h2>
          <p style={{color:"#94a3b8",fontSize:13,marginTop:6}}>{user?.email}</p>
        </div>

        <div style={{marginTop:16,background:"#151a2d",borderRadius:20,padding:20,border:"1px solid #1e233a"}}>
          <h3 style={{fontWeight:700,fontSize:16}}>📚 My Subjects</h3>
          <p style={{color:"#64748b",fontSize:13,marginTop:8}}>Your learning content will be here</p>
        </div>

        <button style={{marginTop:16,background:"#fbbf24",color:"black",border:"none",padding:16,borderRadius:14,fontWeight:800,width:"100%",fontSize:15,cursor:"pointer"}}>
          Upgrade to Premium →
        </button>
      </div>
    </div>
  )
}
