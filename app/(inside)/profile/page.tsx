"use client";
import { useEffect, useState } from "react";

export default function ProfilePage(){
  const [email,setEmail]=useState("megaluno28@gmail.com");
  const [phone,setPhone]=useState("+27729888561");
  const [updates,setUpdates]=useState(true);
  const [parentCode,setParentCode]=useState("");
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    const e = localStorage.getItem("matric360_email");
    const p = localStorage.getItem("matric360_phone");
    const u = localStorage.getItem("matric360_updates");
    if(e) setEmail(e);
    if(p) setPhone(p);
    if(u) setUpdates(u==="true");
  },[]);

  const saveContact = ()=>{
    localStorage.setItem("matric360_email", email);
    localStorage.setItem("matric360_phone", phone);
    localStorage.setItem("matric360_updates", String(updates));
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  const genCode = ()=>{
    const c = "M360-" + Math.random().toString(36).substring(2,7).toUpperCase();
    setParentCode(c);
    localStorage.setItem("parent_code", c);
  };

  const Item = ({label}:{label:string})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 16px",borderTop:"1px solid #252a44",cursor:"pointer"}}>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <span style={{color:"#7c7cff"}}>✉️</span>
        <span style={{fontWeight:600}}>{label}</span>
      </div>
      <span style={{color:"#9ca3af"}}>{">"}</span>
    </div>
  );

  return(
    <div style={{padding:"8px 8px 90px"}}>
      {/* Contact details - exactly like photo */}
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"18px"}}>
        <div style={{fontWeight:800,display:"flex",gap:8,alignItems:"center",marginBottom:14}}>
          <span style={{color:"#facc15"}}>💬</span> Contact details
        </div>

        <div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Email</div>
        <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",background:"#131527",border:"1px solid #2a2d4a",borderRadius:12,padding:"12px",color:"white",marginBottom:14}} />

        <div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>Contact / WhatsApp number</div>
        <div style={{display:"flex",background:"#131527",border:"1px solid #2a2d4a",borderRadius:12,overflow:"hidden",marginBottom:6}}>
          <div style={{padding:"12px",background:"#1e213a",display:"flex",alignItems:"center",gap:4,fontSize:13}}>🇿🇦 +27</div>
          <input value={phone} onChange={e=>setPhone(e.target.value)} style={{flex:1,background:"transparent",border:0,padding:"12px",color:"white"}} />
        </div>
        <div style={{fontSize:11,color:"#9ca3af",marginBottom:10}}>On file: +27 72 988 8561</div>
        <div style={{fontSize:11,color:"#9ca3af",lineHeight:1.4,marginBottom:12}}>We use this number only for account support and private contact from Matric360 admins when needed.</div>

        <label style={{display:"flex",gap:8,alignItems:"center",fontSize:13,marginBottom:16,cursor:"pointer"}}>
          <input type="checkbox" checked={updates} onChange={e=>setUpdates(e.target.checked)} style={{width:18,height:18}} />
          Send me occasional product updates and offers by email.
        </label>

        <button onClick={saveContact} style={{width:"100%",background:"#7c7cff",color:"black",fontWeight:700,border:0,borderRadius:12,padding:"14px",cursor:"pointer"}}>
          {saved ? "✓ Saved!" : "Save contact details"}
        </button>
      </div>

      {/* Share with parent */}
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"18px",marginTop:14}}>
        <div style={{fontWeight:800,display:"flex",gap:8}}><span style={{color:"#7c7cff"}}>👥</span> Share with a parent</div>
        <div style={{fontSize:12,color:"#9ca3af",marginTop:6,lineHeight:1.4}}>Generate a one-time code your parent can enter to follow your progress. The code expires in 24 hours.</div>
        {parentCode && <div style={{marginTop:12,background:"#131527",border:"1px dashed #7c7cff",borderRadius:10,padding:"10px",textAlign:"center",fontWeight:800,letterSpacing:1}}>{parentCode}</div>}
        <button onClick={genCode} style={{marginTop:12,background:"#7c7cff",color:"black",fontWeight:700,border:0,borderRadius:999,padding:"12px 18px",cursor:"pointer"}}>Generate parent code</button>
      </div>

      {/* Help links */}
      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,marginTop:14,overflow:"hidden"}}>
        <div style={{padding:"18px 16px",display:"flex",justifyContent:"space-between",cursor:"pointer"}}>
          <div style={{display:"flex",gap:12}}><span>❓</span><span style={{fontWeight:600}}>Help / How to Use App</span></div><span style={{color:"#9ca3af"}}>{">"}</span>
        </div>
        <div style={{padding:"18px 16px",display:"flex",justifyContent:"space-between",borderTop:"1px solid #252a44",cursor:"pointer"}}>
          <div style={{display:"flex",gap:12}}><span>✉️</span><span style={{fontWeight:600}}>Send Feedback</span></div><span style={{color:"#9ca3af"}}>{">"}</span>
        </div>
        <div style={{padding:"18px 16px",display:"flex",justifyContent:"space-between",borderTop:"1px solid #252a44",cursor:"pointer"}}>
          <div style={{display:"flex",gap:12}}><span>✉️</span><span style={{fontWeight:600}}>Contact Support</span></div><span style={{color:"#9ca3af"}}>{">"}</span>
        </div>
      </div>

      <button onClick={()=>{localStorage.clear(); location.href="/login"}} style={{width:"100%",marginTop:14,background:"transparent",border:"1px solid #2a2d4a",borderRadius:12,padding:"14px",color:"#ff6b6b",fontWeight:700,cursor:"pointer"}}>↪ Log out</button>
    </div>
  );
}
