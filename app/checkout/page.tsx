"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState, useEffect } from "react"

const FEATURES = [
  "Full CAPS Mathematics and Physical Sciences",
  "Thousands of CAPS-style exam questions",
  "Complete lesson videos, step-by-step",
  "Instant AI explanations when you're stuck",
  "Unlimited practice, mock exams and past papers",
  "Daily Sprint, Weak Areas & Exam Readiness",
  "XP, streaks, mastery and progress tracking",
]

function CheckoutContent(){
  const params = useSearchParams()
  const router = useRouter()
  const plan = params.get("plan") || "2"
  const billingParam = params.get("billing") || "monthly"
  const priceParam = params.get("price") || "249"
  const label = params.get("label") || `${plan} Subjects`

  const [billing, setBilling] = useState(billingParam)
  const priceMonthly = 249
  const priceAnnual = 2490
  const currentPrice = billing==="annual"? priceAnnual : priceMonthly
  const saving = billing==="annual"? 498 : 0

  const handlePay = (cycle:string) => {
    const p = cycle==="annual"? priceAnnual : priceMonthly
    const data = { plan_name: "2 Subjects", plan_price: p, billing_cycle: cycle, subjects_count: 2, max_premium_subjects: 2, chosen_subjects: ["mathematics","physical-sciences"], subscription_status: "active" }
    localStorage.setItem("matric360_plan", JSON.stringify(data))
    alert(`PayStack: R${p} ${cycle}\nSubjects: Maths + Physics\n(Full CAPS access)\n\nConnect your PayStack key here`)
    router.push("/dashboard")
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:"20px 20px 100px 20px"}}>
      <button onClick={()=>router.push("/subscription")} style={{background:"#1e233a",border:"none",color:"white",padding:"8px 14px",borderRadius:10,fontSize:13}}>← Plans</button>

      <h1 style={{fontWeight:900,fontSize:22,marginTop:20}}>You're unlocking</h1>
      <p style={{color:"#94a3b8",fontSize:12,marginTop:6}}>{label} • {plan} of 2 LIVE subjects • Can't pay for subjects that don't exist</p>

      {/* PREMIUM ANNUAL - BEST VALUE like screenshot */}
      <div style={{marginTop:18,background:"#15172a",border:"1px solid #2a2d4a",borderRadius:18,padding:16,position:"relative"}}>
        <div style={{position:"absolute",top:-10,right:12,background:"#fbbf24",color:"black",fontSize:10,fontWeight:900,padding:"4px 10px",borderRadius:999}}>BEST VALUE</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#fbbf24"}}>✨</span><span style={{fontWeight:800}}>Premium Annual</span></div>
        <div style={{marginTop:6}}><span style={{fontWeight:900,fontSize:26}}>R2,490</span><span style={{color:"#94a3b8",fontSize:12}}>/year</span></div>
        <div style={{fontSize:11,color:"#64748b"}}>≈ R207.50/month • Save R498/year • 2 months free</div>

        <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
          {FEATURES.map(f=>(
            <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:12}}>
              <span style={{color:"#22c55e",fontWeight:900}}>✓</span><span style={{color:"#cbd5e1"}}>{f}</span>
            </div>
          ))}
        </div>

        <button onClick={()=>handlePay("annual")} style={{marginTop:16,width:"100%",background:"#fbbf24",color:"black",border:"none",padding:14,borderRadius:999,fontWeight:900,fontSize:14}}>Renew Annually - R2,490</button>
      </div>

      {/* PREMIUM MONTHLY */}
      <div style={{marginTop:16,background:"#15172a",border:"1px solid #2a2d4a",borderRadius:18,padding:16}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#8b5cf6"}}>✦</span><span style={{fontWeight:800}}>Premium Monthly</span></div>
        <div style={{marginTop:6}}><span style={{fontWeight:900,fontSize:26}}>R249</span><span style={{color:"#94a3b8",fontSize:12}}>/month</span></div>

        <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
          {FEATURES.slice(0,5).map(f=>(
            <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:12}}>
              <span style={{color:"#22c55e",fontWeight:900}}>✓</span><span style={{color:"#cbd5e1"}}>{f}</span>
            </div>
          ))}
        </div>

        <button onClick={()=>handlePay("monthly")} style={{marginTop:16,width:"100%",background:"#8b8cff",color:"white",border:"none",padding:14,borderRadius:999,fontWeight:900,fontSize:14}}>Renew Monthly - R249</button>
      </div>

      <div style={{marginTop:14,background:"#1e293b",borderRadius:12,padding:12,fontSize:11,color:"#94a3b8",textAlign:"center"}}>
        You have 2 LIVE subjects now. If you chose 3+ Subjects, you only pay for 2 now.<br/>When we add Life Sciences, Geography etc, your plan auto includes them up to your limit.
      </div>
    </div>
  )
}

export default function CheckoutPage(){
  return <Suspense fallback={<div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>Loading...</div>}><CheckoutContent/></Suspense>
}
