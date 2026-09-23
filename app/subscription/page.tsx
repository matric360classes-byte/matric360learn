"use client"
import { useState } from "react"
import Link from "next/link"

export default function SubscriptionPage(){
  const [annual,setAnnual]=useState(false)
  
  const plans=[
    {n:"FREE",p:0, desc:"R0 /forever • CAPS lessons • 1 quiz per unit"},
    {n:"1 Subject",p:149},
    {n:"2 Subjects",p:249,pop:true},
    {n:"3 Subjects",p:300},
    {n:"4 Subjects",p:350},
    {n:"5 Subjects",p:400},
    {n:"6+ Subjects",p:450,best:true},
  ]

  // TODO: replace with real current plan from Supabase / localStorage
  const currentPlan = "FREE" 

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:"20px"}}>
      <h1 style={{fontWeight:900,fontSize:24}}>Subscription</h1>
      <p style={{color:"#94a3b8",fontSize:13,marginTop:4}}>Current plan: <b style={{color:"white"}}>{currentPlan}</b></p>

      {/* Toggle */}
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginTop:20}}>
        <span style={{fontSize:12,color:!annual?"white":"#64748b"}}>Monthly</span>
        <button onClick={()=>setAnnual(!annual)} style={{width:44,height:22,borderRadius:999,border:"none",background:annual?"#fbbf24":"#2a2d4a",position:"relative"}}>
          <div style={{width:16,height:16,background:"white",borderRadius:999,position:"absolute",top:3,left:annual?24:3}}></div>
        </button>
        <span style={{fontSize:12,color:annual?"white":"#64748b"}}>Annual</span>
        <span style={{background:"#fbbf24",color:"black",fontSize:9,fontWeight:800,padding:"3px 6px",borderRadius:999}}>2 MONTHS FREE</span>
      </div>

      {/* Plans */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:20}}>
        {plans.map(pl=>{
          const price = pl.p===0 ? 0 : annual ? pl.p*10 : pl.p
          const isCurrent = currentPlan===pl.n
          return(
            <div key={pl.n} style={{background:"#15172a",border:isCurrent?"1px solid #10b981":"1px solid #2a2d4a",borderRadius:16,padding:16,position:"relative"}}>
              {pl.pop&&<div style={{position:"absolute",top:-8,right:10,background:"#fbbf24",color:"black",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:999}}>POPULAR</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700}}>{pl.n}</div>
                  {pl.desc ? <div style={{fontSize:11,color:"#94a3b8"}}>{pl.desc}</div> : <div style={{fontSize:11,color:"#94a3b8"}}>{annual ? `Pay R${price} lump sum for 12 months` : `R${price}/month`}</div>}
                </div>
                <div style={{fontWeight:900,textAlign:"right"}}>R{price}<span style={{fontSize:10,color:"#94a3b8"}}>{pl.p===0?"":annual?" /year":" /mo"}</span></div>
              </div>
              {isCurrent ? (
                <div style={{marginTop:12,background:"#10b98120",color:"#10b981",padding:"10px",borderRadius:999,textAlign:"center",fontWeight:800,fontSize:13}}>✓ Current Plan</div>
              ) : (
                <Link href={`/checkout?plan=${encodeURIComponent(pl.n)}&billing=${annual?"annual":"monthly"}&price=${price}`} style={{display:"block",marginTop:12,background:pl.pop?"#fbbf24":"#1e293b",color:pl.pop?"black":"white",padding:"10px",borderRadius:999,textAlign:"center",fontWeight:800,fontSize:13,textDecoration:"none"}}>{pl.p===0?"Downgrade":"Upgrade to "+pl.n}</Link>
              )}
            </div>
          )
        })}
      </div>

      <div style={{textAlign:"center",fontSize:11,color:"#94a3b8",marginTop:12}}>Annual = Pay 10 months, get 12. Saves 2 months.</div>
    </div>
  )
}
