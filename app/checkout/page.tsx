"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"

const BENEFITS = [
  "Full CAPS Mathematics and Physical Sciences",
  "Thousands of CAPS-style exam questions",
  "Complete lesson videos, step-by-step",
  "Instant AI explanations when you're stuck",
  "Unlimited practice, mock exams and past papers",
  "Daily Sprint, Weak Areas & Exam Readiness",
  "XP, streaks, mastery and progress tracking",
  "Cancel anytime, keep free access",
]

const LIVE_SUBJECTS = [
  { slug: "mathematics", name: "Mathematics" },
  { slug: "physical-sciences", name: "Physical Sciences" },
]

function CheckoutContent(){
  const params = useSearchParams()
  const router = useRouter()

  // Dynamic values from subscription page
  const planParam = params.get("plan") || "2" // 1,2,3,4,5,6
  const billing = params.get("billing") || "monthly" // monthly | annual
  const priceParam = params.get("price") || "249" // e.g. 149, 249, 1490, 2490
  const label = params.get("label") || `${planParam} Subjects`

  const planNumber = parseInt(planParam) || 2
  const price = parseInt(priceParam) || 0

  // LIVE CAP
  const LIVE_COUNT = 2
  const effectiveCount = Math.min(planNumber, LIVE_COUNT)
  const chosenSubjects = LIVE_SUBJECTS.slice(0, effectiveCount)

  const handlePay = () => {
    const data = {
      plan_name: label,
      plan_price: price,
      billing_cycle: billing,
      subjects_count: effectiveCount,
      max_premium_subjects: effectiveCount,
      chosen_subjects: chosenSubjects.map(s=>s.slug),
      subscription_status: "active",
      subscription_start: new Date().toISOString().split('T')[0]
    }
    localStorage.setItem("matric360_plan", JSON.stringify(data))
    alert(`PayStack next:\n${label} • R${price} ${billing}\nSubjects: ${chosenSubjects.map(s=>s.name).join(" + ")}\n\nConnect PayStack here`)
    router.push("/dashboard")
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:"20px 20px 100px 20px"}}>
      <button onClick={()=>router.push("/subscription")} style={{background:"#1e233a",border:"none",color:"white",padding:"8px 14px",borderRadius:10,fontSize:13}}>← Back to Plans</button>

      <h1 style={{fontWeight:900,fontSize:22,marginTop:20}}>What you're getting</h1>
      <p style={{color:"#94a3b8",fontSize:12,marginTop:6}}>
        {planNumber > LIVE_COUNT ? `You clicked ${planNumber} Subjects but only ${LIVE_COUNT} are LIVE, so you pay for ${LIVE_COUNT} now` : `You're unlocking ${label}`} • {billing}
      </p>

      <div style={{marginTop:18,background:"#15172a",border:"2px solid #232a44",borderRadius:20,padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:900,fontSize:18,display:"flex",alignItems:"center",gap:8}}>
              ✨ {effectiveCount} {effectiveCount===1? "Subject" : "Subjects"} Premium
            </div>
            <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>
              {chosenSubjects.map(s=>s.name).join(" + ")} • {billing==="annual"?"Annual • 2 months free":"Monthly"}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:900,fontSize:26}}>R{price}</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{billing==="annual"?"/year":"/month"}</div>
          </div>
        </div>

        <div style={{height:1,background:"#232a44",margin:"16px 0"}}></div>

        <div style={{fontWeight:800,fontSize:13,marginBottom:10}}>Includes:</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {BENEFITS.map(f=>(
            <div key={f} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:20,height:20,borderRadius:99,background:"#22c55e20",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:"#22c55e",fontSize:12,fontWeight:900}}>✓</span>
              </div>
              <span style={{fontSize:13,color:"#e2e8f0",lineHeight:1.4}}>{f}</span>
            </div>
          ))}
        </div>

        <button onClick={handlePay} style={{marginTop:20,width:"100%",background:"#fbbf24",color:"black",border:"none",padding:16,borderRadius:14,fontWeight:900,fontSize:15,cursor:"pointer"}}>
          Pay R{price} • Unlock {effectiveCount} {effectiveCount===1?"Subject":"Subjects"} →
        </button>

        <div style={{textAlign:"center",fontSize:11,color:"#64748b",marginTop:10}}>
          {billing==="annual"? `Lump sum R${price} for 12 months • Save R${effectiveCount===1?298:498}` : `R${price}/month • Cancel anytime`}
        </div>
      </div>

      <div style={{marginTop:12,background:"#1e233a",borderRadius:12,padding:12,fontSize:11,color:"#94a3b8",lineHeight:1.4}}>
        <b style={{color:"white"}}>Live cap logic active:</b><br/>
        - LIVE_COUNT = {LIVE_COUNT} (Mathematics + Physical Sciences)<br/>
        - You clicked {planNumber} but pay for {effectiveCount} now: R{price}<br/>
        - When we launch subject #{LIVE_COUNT+1}, your {planNumber}-subject plan will auto-include it up to {planNumber}
      </div>
    </div>
  )
}

export default function CheckoutPage(){
  return <Suspense fallback={<div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>Loading checkout...</div>}><CheckoutContent/></Suspense>
}
