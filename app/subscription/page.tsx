"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SubscriptionPage(){
  const [annual,setAnnual]=useState(false)
  const [currentPlan,setCurrentPlan]=useState<any>(null)
  const router = useRouter()

  const LIVE_COUNT = 2 // Change this to 3,4,5 when you add subjects

  const plans=[
    {n:"FREE", p:0, subjects:0, desc:"R0 /forever • CAPS lessons • 1 quiz per unit"},
    {n:"1 Subject", p:149, subjects:1},
    {n:"2 Subjects", p:249, subjects:2, pop:true},
    {n:"3 Subjects", p:300, subjects:3},
    {n:"4 Subjects", p:350, subjects:4},
    {n:"5 Subjects", p:400, subjects:5},
    {n:"6+ Subjects", p:450, subjects:6, best:true},
  ]

  useEffect(()=>{
    const saved = localStorage.getItem("matric360_plan")
    if(saved){ try{ setCurrentPlan(JSON.parse(saved)) }catch{} }
  },[])

  const handleUpgrade = (pl:any)=>{
    let effectivePlan = pl
    let effectiveSubjects = pl.subjects

    // CAP LOGIC: If they choose 3+ but only 2 LIVE, give them 2 LIVE now
    if(pl.subjects > LIVE_COUNT){
      effectiveSubjects = LIVE_COUNT
      effectivePlan = plans.find(x=>x.subjects===LIVE_COUNT) || pl
      if(!confirm(`Only ${LIVE_COUNT} subjects are LIVE right now (Mathematics + Physical Sciences).\n\nYou clicked ${pl.n} but you'll be upgraded to ${LIVE_COUNT} Subjects for now at R${annual? effectivePlan.p*10 : effectivePlan.p}. You'll get the rest free when we launch them.\n\nContinue?`)){
        return
      }
    }

    const price = effectivePlan.p===0? 0 : annual? effectivePlan.p*10 : effectivePlan.p
    const data={
      plan_name: effectivePlan.n,
      original_requested: pl.n,
      plan_price: price,
      monthly_price: effectivePlan.p,
      billing_cycle: annual?"annual":"monthly",
      subjects_count: effectiveSubjects,
      max_premium_subjects: effectiveSubjects,
      subscription_status: effectivePlan.p===0?"free":"active",
      subscription_start: new Date().toISOString().split('T')[0],
    }
    localStorage.setItem("matric360_plan", JSON.stringify(data))
    setCurrentPlan(data)

    if(effectivePlan.p===0){
      router.push("/dashboard")
    } else {
      router.push(`/checkout?plan=${effectiveSubjects}&billing=${annual?"annual":"monthly"}&price=${price}&label=${encodeURIComponent(effectivePlan.n)}`)
    }
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:"20px",paddingBottom:90}}>
      <h1 style={{fontWeight:900,fontSize:24}}>Subscription</h1>
      <p style={{color:"#94a3b8",fontSize:13,marginTop:4}}>
        Current plan: <b style={{color:"white"}}>{currentPlan? `${currentPlan.plan_name} • R${currentPlan.plan_price} ${currentPlan.billing_cycle==="annual"?"/year":"/mo"}` : "FREE"}</b>
        <span style={{marginLeft:8,background:"#1e233a",padding:"3px 8px",borderRadius:999,fontSize:10}}>{LIVE_COUNT} LIVE NOW</span>
      </p>

      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginTop:20}}>
        <span style={{fontSize:12,color:!annual?"white":"#64748b"}}>Monthly</span>
        <button onClick={()=>setAnnual(!annual)} style={{width:44,height:22,borderRadius:999,border:"none",background:annual?"#fbbf24":"#2a2d4a",position:"relative",cursor:"pointer"}}>
          <div style={{width:16,height:16,background:"white",borderRadius:999,position:"absolute",top:3,left:annual?24:3,transition:"0.2s"}}></div>
        </button>
        <span style={{fontSize:12,color:annual?"white":"#64748b"}}>Annual</span>
        <span style={{background:"#fbbf24",color:"black",fontSize:9,fontWeight:800,padding:"3px 6px",borderRadius:999}}>2 MONTHS FREE</span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:20}}>
        {plans.map(pl=>{
          const isOverLive = pl.subjects > LIVE_COUNT
          const effective = isOverLive? plans.find(x=>x.subjects===LIVE_COUNT)! : pl
          const price = pl.p===0? 0 : annual? effective.p*10 : effective.p
          const isCurrent = currentPlan?.plan_name===effective.n &&!isOverLive && currentPlan?.billing_cycle===(annual?"annual":"monthly")

          return(
            <div key={pl.n} style={{background:"#15172a",border:"1px solid #232a44",borderRadius:18,padding:16,position:"relative",opacity:isOverLive?0.6:1}}>
              {pl.pop&&!isOverLive&&<div style={{position:"absolute",top:-9,right:12,background:"#fbbf24",color:"black",fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:999}}>POPULAR</div>}
              {pl.best&&<div style={{position:"absolute",top:-9,right:12,background:"#10b981",color:"white",fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:999}}>BEST VALUE</div>}
              {isOverLive&&<div style={{position:"absolute",top:-9,right:12,background:"#334155",color:"white",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:999}}>ONLY {LIVE_COUNT} LIVE</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:15}}>{pl.n} {isOverLive&&<span style={{fontSize:11,color:"#fbbf24"}}>→ Pays for {LIVE_COUNT}</span>}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
                    {pl.p===0? pl.desc : isOverLive? `Only ${LIVE_COUNT} LIVE now • You pay for ${LIVE_COUNT} • Rest free later` : annual? `Pay R${price} lump sum for 12 months • Save R${pl.p*2}` : `R${price}/month`}
                  </div>
                </div>
                <div style={{fontWeight:900,fontSize:17}}>R{price}<span style={{fontSize:10,color:"#94a3b8"}}>{pl.p===0?"":annual?" /year":" /mo"}</span></div>
              </div>
              {isCurrent? <div style={{marginTop:12,background:"#10b98120",color:"#10b981",padding:"10px",borderRadius:999,textAlign:"center",fontWeight:800,fontSize:13}}>✓ Current Plan</div> :
              <button onClick={()=>handleUpgrade(pl)} style={{width:"100%",marginTop:12,background:pl.pop&&!isOverLive?"#fbbf24":"#1e293b",color:pl.pop&&!isOverLive?"black":"white",padding:"12px",borderRadius:999,fontWeight:800,fontSize:13,border:"none",cursor:"pointer"}}>
                {pl.p===0?"Downgrade": isOverLive? `Upgrade to ${LIVE_COUNT} Subjects - R${price} (Only LIVE)` : `Upgrade to ${pl.n} - R${price}`}
              </button>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
