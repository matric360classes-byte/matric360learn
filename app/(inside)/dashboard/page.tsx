"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const SUBJECTS = [
  {
    name: "Mathematics",
    shortName: "MATHS",
    icon: "∑",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    slug: "mathematics",
    lessons: "28 Lessons"
  },
  {
    name: "Physical Sciences",
    shortName: "PHYSICS",
    icon: "⚛",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    slug: "physical-sciences",
    lessons: "32 Lessons"
  },
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

      <div style={{marginTop:22}}>
        <h3 style={{fontWeight:900,fontSize:18,color:"white",marginBottom:14}}>📚 My Subjects</h3>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {SUBJECTS.map((s)=>(
            <div key={s.slug} onClick={()=>router.push(`/subjects/${s.slug}`)}
              style={{
                background:"#151a2d",
                border:"2px solid #232a44",
                borderRadius:20,
                padding:18,
                cursor:"pointer",
                display:"flex",
                alignItems:"center",
                gap:16,
                boxShadow:"0 8px 20px rgba(0,0,0,0.25)"
              }}>
              <div style={{
                width:64,
                height:64,
                borderRadius:16,
                background:s.gradient,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:32,
                fontWeight:900,
                color:"white",
                flexShrink:0,
                boxShadow:"0 4px 12px rgba(0,0,0,0.3)"
              }}>{s.icon}</div>

              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:1,color:"#64748b"}}>{s.shortName}</div>
                <div style={{fontSize:18,fontWeight:900,color:"white",marginTop:2,lineHeight:1.1}}>{s.name}</div>
                <div style={{fontSize:12,color:"#94a3b8",marginTop:4,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:6,height:6,borderRadius:99,background:"#22c55e",display:"inline-block"}}></span>
                  {s.lessons} • Ready
                </div>
              </div>

              <div style={{width:36,height:36,borderRadius:99,background:"#1e233a",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:16}}>→</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=>router.push("/pricing")} style={{marginTop:22,background:"#fbbf24",color:"black",border:"none",padding:16,borderRadius:14,fontWeight:900,width:"100%",fontSize:15,cursor:"pointer"}}>
        Upgrade to Premium →
      </button>
    </div>
  )
}
