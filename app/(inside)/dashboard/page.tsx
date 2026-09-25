"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// ONLY YOUR 2 SUBJECTS - change names here if different
const SUBJECTS = [
  { name: "Mathematics", icon: "📐", color: "#3b82f6", slug: "mathematics" },
  { name: "Physical Sciences", icon: "⚗️", color: "#8b5cf6", slug: "physical-sciences" },
]

export default function DashboardPage(){
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(!user){ router.push("/login"); return }
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
    <div style={{padding:"20px 20px 100px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{fontWeight:900,fontSize:26,color:"white"}}>Matric360 Learn</h1>
        <button onClick={handleLogout} style={{background:"#1e233a",color:"white",border:"none",padding:"10px 18px",borderRadius:12,fontSize:13,cursor:"pointer"}}>Logout</button>
      </div>

      <div style={{marginTop:24,background:"#151a2d",borderRadius:20,padding:20,border:"1px solid #1e233a"}}>
        <h2 style={{fontWeight:800,fontSize:18,color:"white"}}>Welcome, {displayName}</h2>
        <p style={{color:"#94a3b8",fontSize:13,marginTop:6}}>{user?.email}</p>
      </div>

      <div style={{marginTop:20}}>
        <h3 style={{fontWeight:800,fontSize:16,color:"white",marginBottom:12}}>📚 My Subjects (2)</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {SUBJECTS.map((s)=>(
            <div key={s.slug} onClick={()=>router.push(`/subjects/${s.slug}`)}
              style={{background:"#151a2d",border:"1px solid #1e233a",borderRadius:16,padding:16,cursor:"pointer"}}>
              <div style={{width:42,height:42,borderRadius:12,background:`${s.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div>
              <div style={{marginTop:12,fontWeight:700,fontSize:14,color:"white"}}>{s.name}</div>
              <div style={{marginTop:4,fontSize:11,color:"#64748b"}}>Available now</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=>router.push("/pricing")} style={{marginTop:20,background:"#fbbf24",color:"black",border:"none",padding:16,borderRadius:14,fontWeight:800,width:"100%",fontSize:15,cursor:"pointer"}}>
        Upgrade to Premium →
      </button>
    </div>
  )
}
