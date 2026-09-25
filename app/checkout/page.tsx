"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, Suspense, useEffect } from "react"

const ALL_SUBJECTS = [
  { slug: "mathematics", name: "Mathematics", status: "LIVE", icon: "📐" },
  { slug: "physical-sciences", name: "Physical Sciences", status: "LIVE", icon: "⚗️" },
  { slug: "life-sciences", name: "Life Sciences", status: "COMING_SOON", icon: "🧬" },
  { slug: "geography", name: "Geography", status: "COMING_SOON", icon: "🌍" },
  { slug: "accounting", name: "Accounting", status: "COMING_SOON", icon: "💰" },
]

function CheckoutContent(){
  const searchParams = useSearchParams()
  const router = useRouter()

  const planParam = searchParams.get("plan") || "2"
  const label = searchParams.get("label") || `${planParam} Subjects`
  const billing = searchParams.get("billing") || "monthly"
  const priceParam = searchParams.get("price") || "249"

  // planParam is now number: 1,2,3,4,5,6
  const maxSelect = planParam === "6" || planParam === "6+"? 6 : parseInt(planParam) || 2
  const price = parseInt(priceParam)

  const [selected, setSelected] = useState<string[]>([])

  useEffect(()=>{
    // auto-select LIVE subjects up to max
    const live = ALL_SUBJECTS.filter(s=>s.status==="LIVE").map(s=>s.slug).slice(0, maxSelect)
    setSelected(live)
  },[maxSelect])

  const toggle = (slug: string) => {
    if(selected.includes(slug)){
      setSelected(selected.filter(s=>s!==slug))
    } else {
      if(selected.length >= maxSelect) {
        alert(`Your ${label} plan allows only ${maxSelect} subjects.`)
        return
      }
      setSelected([...selected, slug])
    }
  }

  const handlePay = () => {
    // Save chosen subjects
    const saved = localStorage.getItem("matric360_plan")
    if(saved){
      const planData = JSON.parse(saved)
      planData.chosen_subjects = selected
      planData.max_premium_subjects = maxSelect
      localStorage.setItem("matric360_plan", JSON.stringify(planData))
    }
    alert(`PAYMENT INTEGRATION NEXT:\nPlan: ${label}\nBilling: ${billing}\nAmount: R${price}\nSubjects: ${selected.join(", ")}\n\nConnect PayStack / PayFast here.`)
    router.push("/dashboard")
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>
      <button onClick={()=>router.back()} style={{background:"#1e233a",border:"none",color:"white",padding:"8px 14px",borderRadius:10}}>← Back to Plans</button>
      <h1 style={{fontWeight:900,fontSize:24,marginTop:20}}>Checkout</h1>
      <div style={{marginTop:12,background:"#151a2d",border:"2px solid #232a44",borderRadius:16,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontWeight:800}}>{label} • {billing}</div><div style={{fontSize:12,color:"#94a3b8"}}>You can be FREE for other subjects and PREMIUM for these</div></div>
          <div style={{fontWeight:900,fontSize:20}}>R{price}</div>
        </div>
      </div>

      <h3 style={{marginTop:20,fontWeight:800}}>Step 1: Choose your {maxSelect} premium subject(s)</h3>
      <p style={{fontSize:12,color:"#94a3b8"}}>{selected.length}/{maxSelect} selected</p>

      <div style={{display:"grid",gap:10,marginTop:12}}>
        {ALL_SUBJECTS.map(sub=>{
          const isSelected = selected.includes(sub.slug)
          const isLive = sub.status==="LIVE"
          return(
            <div key={sub.slug} onClick={()=>toggle(sub.slug)} style={{background:isSelected?"#1e233a":"#151a2d",border:isSelected?"2px solid #fbbf24":"1px solid #1e233a",borderRadius:14,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#1e233a",display:"flex",alignItems:"center",justifyContent:"center"}}>{sub.icon}</div>
                <div><div style={{fontWeight:700}}>{sub.name} {isLive? <span style={{fontSize:9,background:"#22c55e",color:"black",padding:"2px 6px",borderRadius:6,marginLeft:6}}>LIVE</span> : <span style={{fontSize:9,background:"#334155",padding:"2px 6px",borderRadius:6,marginLeft:6}}>SOON</span>}</div><div style={{fontSize:11,color:"#64748b"}}>{isLive? "Full premium access" : "Will unlock when we launch it"}</div></div>
              </div>
              <div style={{width:22,height:22,borderRadius:99,border:"2px solid #fbbf24",background:isSelected?"#fbbf24":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"black"}}>{isSelected?"✓":""}</div>
            </div>
          )
        })}
      </div>

      <button onClick={handlePay} disabled={selected.length===0} style={{marginTop:20,width:"100%",background:selected.length===0?"#334155":"#fbbf24",color:"black",border:"none",padding:16,borderRadius:14,fontWeight:900}}>Pay R{price} → Unlock {selected.length} Subjects</button>
      <p style={{fontSize:11,color:"#64748b",textAlign:"center",marginTop:10}}>Free subjects stay free. Only chosen subjects become premium. You can upgrade later for more subjects.</p>
    </div>
  )
}

export default function CheckoutPage(){
  return <Suspense fallback={<div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>Loading checkout...</div>}><CheckoutContent/></Suspense>
}
