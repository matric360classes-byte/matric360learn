"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SubscriptionPage(){
  const [annual,setAnnual]=useState(false)
  const [currentPlan,setCurrentPlan]=useState<any>(null)
  const router = useRouter()

  const plans=[
    {n:"FREE",p:0, subjects:0, desc:"R0 /forever • CAPS lessons • 1 quiz per unit"},
    {n:"1 Subject",p:149, subjects:1},
    {n:"2 Subjects",p:249, subjects:2, pop:true},
    {n:"3 Subjects",p:300, subjects:3},
    {n:"4 Subjects",p:350, subjects:4},
    {n:"5 Subjects",p:400, subjects:5},
    {n:"6+ Subjects",p:450, subjects:6, best:true},
  ]

  useEffect(()=>{
    const saved = localStorage.getItem("matric360_plan")
    if(saved){
      try{ setCurrentPlan(JSON.parse(saved)) }catch{}
    }
  },[])

  const handleUpgrade = (pl:any)=>{
    const price = pl.p===0? 0 : annual? pl.p*10 : pl.p
    const data={
      plan_name: pl.n,
      plan_price: price,
      monthly_price: pl.p,
      billing_cycle: annual?"annual":"monthly",
      subjects_count: pl.subjects || 0,
      subscription_status: pl.p===0?"free":"active",
      subscription_start: new Date().toISOString().split('T')[0],
    }
    localStorage.setItem("matric360_plan", JSON.stringify(data))
    setCurrentPlan(data)
    // TODO: await supabase.from('profiles').update(data).eq('id', user.id)

    if(pl.p===0){
      router.push("/dashboard")
    } else {
      router.push(`/checkout?plan=${encodeURIComponent(pl.n)}&billing=${annual?"annual":"monthly"}&price=${price}`)
    }
  }

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:"20px",paddingBottom:90}}>
      <h1 style={{fontWeight:900,fontSize:24}}>Subscription</h1>
      <p style={{color:"#94a3b8",fontSize:13,marginTop:4}}>
        Current plan: <b style={{color:"white"}}>
          {currentPlan? `${currentPlan.plan_name} • R${currentPlan.plan_price} ${currentPlan.billing_cycle==="annual"?"/year":"/mo"}` : "FREE"}
        </b>
      </p>

      {/* Toggle */}
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginTop:20}}>
        <span style={{fontSize:12,color:!annual?"white":"#64748b"}}>Monthly</span>
        <button onClick={()=>setAnnual(!annual)} style={{width:44,height:22,borderRadius:999,border:"none",background:annual?"#fbbf24":"#2a2d4a",position:"relative",cursor:"pointer"}}>
          <div style={{width:16,height:16,background:"white",borderRadius:999,position:"absolute",top:3,left:annual?24:3,transition:"0.2s"}}></div>
        </button>
        <span style={{fontSize:12,color:annual?"white":"#64748b"}}>Annual</span>
        <span style={{background:"#fbbf24",color:"black",fontSize:9,fontWeight:800,padding:"3px 6px",borderRadius:999}}>2 MONTHS FREE</span>
      </div>

      {/* Plans */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:20}}>
        {plans.map(pl=>{
          const price = pl.p===0? 0 : annual? pl.p*10 : pl.p
          const isCurrent = currentPlan?.plan_name===pl.n && currentPlan?.billing_cycle===(annual?"annual":"monthly")
          return(
            <div key={pl.n} style={{background:"#15172a",border:isCurrent?"1px solid #10b981":"1px solid #2a2d4a",borderRadius:16,padding:16,position:"relative"}}>
              {pl.pop&&<div style={{position:"absolute",top:-8,right:10,background:"#fbbf24",color:"black",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:999}}>POPULAR</div>}
              {pl.best&&<div style={{position:"absolute",top:-8,right:10,background:"#10b981",color:"white",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:999}}>BEST VALUE</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700}}>{pl.n}</div>
                  {pl.desc? <div style={{fontSize:11,color:"#94a3b8"}}>{pl.desc}</div> :
                  <div style={{fontSize:11,color:"#94a3b8"}}>
                    {annual? `Pay R${price} lump sum for 12 months` : `R${price}/month`}
                    {annual && pl.p>0 && <span style={{color:"#10b981"}}> • Save R{pl.p*2}</span>}
                  </div>}
                </div>
                <div style={{fontWeight:900,textAlign:"right"}}>R{price}<span style={{fontSize:10,color:"#94a3b8"}}>{pl.p===0?"":annual?" /year":" /mo"}</span></div>
              </div>
              {isCurrent? (
                <div style={{marginTop:12,background:"#10b98120",color:"#10b981",padding:"10px",borderRadius:999,textAlign:"center",fontWeight:800,fontSize:13}}>✓ Current Plan - {annual?"Annual":"Monthly"}</div>
              ) : (
                <button onClick={()=>handleUpgrade(pl)} style={{display:"block",width:"100%",marginTop:12,background:pl.pop?"#fbbf24":"#1e293b",color:pl.pop?"black":"white",padding:"10px",borderRadius:999,textAlign:"center",fontWeight:800,fontSize:13,border:"none",cursor:"pointer"}}>
                  {pl.p===0?"Downgrade":"Upgrade to "+pl.n+" - R"+price}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div style={{textAlign:"center",fontSize:11,color:"#94a3b8",marginTop:12}}>Annual = Pay 10 months, get 12. Saves 2 months. Lump sum: R1490, R2490, R3000, R3500, R4000, R4500</div>
    </div>
  )
}
