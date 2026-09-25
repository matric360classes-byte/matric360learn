"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, Suspense } from "react"

const ALL_SUBJECTS = [
  { slug: "mathematics", name: "Mathematics", status: "LIVE" },
  { slug: "physical-sciences", name: "Physical Sciences", status: "LIVE" },
  { slug: "life-sciences", name: "Life Sciences", status: "COMING_SOON" },
  { slug: "geography", name: "Geography", status: "COMING_SOON" },
  { slug: "accounting", name: "Accounting", status: "COMING_SOON" },
  { slug: "business", name: "Business Studies", status: "COMING_SOON" },
]

const PLANS: any = {
  "1": { label: "1 Subject", monthly: 149, annual: 1490 },
  "2": { label: "2 Subjects", monthly: 249, annual: 2490 },
  "3": { label: "3 Subjects", monthly: 300, annual: 3000 },
  "4": { label: "4 Subjects", monthly: 350, annual: 3500 },
  "5": { label: "5 Subjects", monthly: 400, annual: 4000 },
  "6+": { label: "6+ Subjects", monthly: 450, annual: 4500 },
}

function CheckoutContent(){
  const searchParams = useSearchParams()
  const router = useRouter()
  const planKey = searchParams.get("plan") || "2"
  const billing = searchParams.get("billing") || "monthly"
  const plan = PLANS[planKey] || PLANS["2"]
  const price = billing === "annual"? plan.annual : plan.monthly
  const maxSelect = planKey === "6+"? 6 : parseInt(planKey)

  const [selected, setSelected] = useState<string[]>(["mathematics", "physical-sciences"].slice(0, maxSelect))

  const toggle = (slug: string) => {
    if(selected.includes(slug)){
      setSelected(selected.filter(s=>s!==slug))
    } else {
      if(selected.length >= maxSelect) {
        alert(`Your ${plan.label} plan allows only ${maxSelect} subjects. Remove one first.`)
        return
      }
      setSelected([...selected, slug])
    }
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:"20px 20px 100px 20px"}}>
      <button onClick={()=>router.back()} style={{background:"#1e233a",border:"none",color:"white",padding:"8px 14px",borderRadius:10}}>← Back</button>

      <h1 style={{fontWeight:900,fontSize:24,marginTop:20}}>Checkout</h1>
      <div style={{marginTop:12,background:"#151a2d",border:"1px solid #1e233a",borderRadius:16,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800}}>{plan.label} - {billing}</div>
            <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>{maxSelect} subjects • {billing==="annual"? "Pay 10 get 12" : "Monthly billing"}</div>
          </div>
          <div style={{fontWeight:900,fontSize:20}}>R{price}<span style={{fontSize:12,color:"#94a3b8"}}>/{billing==="annual"?"year":"mo"}</span></div>
        </div>
      </div>

      <h3 style={{marginTop:22,fontWeight:800}}>Choose your {maxSelect} subjects</h3>
      <p style={{fontSize:12,color:"#94a3b8",marginTop:4}}>{selected.length}/{maxSelect} selected • You can change later</p>

      <div style={{display:"grid",gap:10,marginTop:12}}>
        {ALL_SUBJECTS.map(sub=>{
          const isSelected = selected.includes(sub.slug)
          const isLive = sub.status === "LIVE"
          return(
            <div key={sub.slug} onClick={()=>toggle(sub.slug)}
              style={{
                background: isSelected? "#1e233a" : "#151a2d",
                border: isSelected? "2px solid #fbbf24" : "1px solid #1e233a",
                borderRadius:14,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",opacity:!isLive? 0.7 : 1
              }}>
              <div>
                <div style={{fontWeight:700,display:"flex",gap:8,alignItems:"center"}}>
                  {sub.name} {isLive? <span style={{fontSize:10,background:"#22c55e",color:"black",padding:"2px 6px",borderRadius:6,fontWeight:900}}>LIVE</span> : <span style={{fontSize:10,background:"#334155",padding:"2px 6px",borderRadius:6}}>SOON</span>}
                </div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{isLive? "Full access" : `Unlocks when live • counts toward ${maxSelect}`}</div>
              </div>
              <div style={{width:22,height:22,borderRadius:99,border:"2px solid #fbbf24",background:isSelected? "#fbbf24" : "transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"black",fontWeight:900}}>{isSelected? "✓" : ""}</div>
            </div>
          )
        })}
      </div>

      <div style={{marginTop:20,background:"#1e233a",borderRadius:14,padding:14}}>
        <div style={{fontSize:12,color:"#94a3b8"}}>Summary</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><span>{plan.label} ({billing})</span><span>R{price}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:12,color:"#94a3b8"}}><span>Subjects: {selected.join(", ") || "None"}</span></div>
        <div style={{height:1,background:"#2a324f",margin:"12px 0"}}></div>
        <div style={{display:"flex",justifyContent:"space-between",fontWeight:900}}><span>Total today</span><span>R{price}</span></div>
      </div>

      <button onClick={()=>alert(`Next: Connect Paystack/PayFast here\nPlan: ${plan.label}\nBilling: ${billing}\nSubjects: ${selected.join(", ")}\nAmount: R${price}`)}
        disabled={selected.length===0}
        style={{marginTop:16,width:"100%",background: selected.length===0? "#334155" : "#fbbf24",color:"black",border:"none",padding:16,borderRadius:14,fontWeight:900,fontSize:15}}>
        Pay R{price} → Unlock
      </button>

      <p style={{fontSize:11,color:"#64748b",textAlign:"center",marginTop:10}}>Free mode: 2 subjects with limited quizzes. Premium unlocks all lessons + exams. You can stay FREE for some subjects and PREMIUM for others — just pick which ones above.</p>
    </div>
  )
}

export default function CheckoutPage(){
  return <Suspense fallback={<div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>Loading...</div>}><CheckoutContent/></Suspense>
}
