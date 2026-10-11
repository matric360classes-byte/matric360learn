"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const reference = params.get("reference")
  const [status, setStatus] = useState("Verifying payment...")

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        setStatus("No reference found - payment pending")
        return
      }
      try {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        })
        const data = await res.json()
        if (data.success) {
          // Unlock premium for 30 DAYS
          const saved = localStorage.getItem("matric360_plan")
          if (saved) {
            const plan = JSON.parse(saved)
            plan.subscription_status = "active"
            plan.payment_reference = reference
            plan.subscription_start = new Date().toISOString()
            plan.subscription_expires = new Date(Date.now() + 30*24*60*60*1000).toISOString()
            plan.paystack_response = data.data
            localStorage.setItem("matric360_plan", JSON.stringify(plan))
          }
          setStatus("Payment successful! 🎉 30 days unlocked. Redirecting...")
          setTimeout(() => router.push("/dashboard"), 2000)
        } else {
          setStatus("Verification failed: " + JSON.stringify(data))
        }
      } catch (e: any) {
        setStatus("Error: " + e.message)
      }
    }
    verify()
  }, [reference, router])

  return (
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#15172a",border:"2px solid #232a44",borderRadius:20,padding:30,textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:40}}>⏳</div>
        <h1 style={{fontWeight:900,fontSize:20,marginTop:10}}>Payment Success</h1>
        <p style={{color:"#94a3b8",fontSize:13,marginTop:8}}>Reference: {reference}</p>
        <p style={{marginTop:16,fontWeight:700}}>{status}</p>
        <button onClick={()=>router.push("/dashboard")} style={{marginTop:20,width:"100%",background:"#fbbf24",color:"black",border:"none",padding:12,borderRadius:10,fontWeight:900}}>Go to Dashboard →</button>
      </div>
    </div>
  )
}

export default function SuccessPage(){
  return <Suspense fallback={<div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:20}}>Loading...</div>}><SuccessContent/></Suspense>
}
