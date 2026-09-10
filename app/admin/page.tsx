"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function AdminPage() {
  const router = useRouter();
  const [total, setTotal] = useState(16);
  const [menuOpen, setMenuOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(true);

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from("topic_knowledge").select("id", { count: "exact", head: true });
      if (count) setTotal(count);
    })();
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui", paddingBottom:80 }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:14}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{width:44,height:44,background:"#1e1e28",borderRadius:12,border:"none",color:"white",fontSize:20}}>☰</button>
          <b>Matric360</b>
        </div>
        <div style={{display:"flex", gap:8}}>
          <span style={{background:"#1e1e28", padding:"6px 12px", borderRadius:20, fontSize:12}}>🛡️ Content</span>
          <span style={{background:"#1e1e28", padding:"6px 12px", borderRadius:20, fontSize:12, color:"#22c55e"}}>📶 Online</span>
        </div>
      </div>

      {menuOpen && (
        <>
          <div onClick={()=>setMenuOpen(false)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:10}}/>
          <div style={{position:"fixed", top:0, left:0, width:300, height:"100%", background:"#15151e", zIndex:11, padding:16, overflowY:"auto"}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
              <b>Menu</b><button onClick={()=>setMenuOpen(false)} style={{background:"#1e1e28", border:"none", color:"white", borderRadius:8, padding:"4px 10px"}}>✕</button>
            </div>
            <div onClick={()=>setGenOpen(!genOpen)} style={{display:"flex", justifyContent:"space-between", fontWeight:"bold", cursor:"pointer"}}><span>🛠️ Generation Tools</span><span>{genOpen ? "∨" : "›"}</span></div>
            {genOpen && (
              <div style={{marginLeft:10, borderLeft:"1px solid #222", paddingLeft:12, marginTop:8}}>
                <div style={{background:"#8b7cf8", color:"black", padding:"8px 16px", borderRadius:20, fontWeight:"bold", width:"fit-content"}}>Factory</div>
                {[
                  ["Direct Generate","/admin/generate"],
                  ["Curriculum AI","/admin/curriculum"],
                  ["Upgrade Lessons","/admin/upgrade"],
                  ["Content Repair","/admin/repair"],
                  ["Math Regen","/admin/math-regen"],
                  ["Math Batch","/admin/math-batch"],
                  ["Publishing Queue","/admin/publish"],
                ].map(([label,path])=>(
                  <div key={label} onClick={()=>{setMenuOpen(false); router.push(path)}} style={{padding:"10px 0", color:"#9ca3af", cursor:"pointer"}}>{label}</div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div style={{padding:16}}>
        <div style={{background:"#1a2a1a", border:"1px solid #2a3a2a", padding:14, borderRadius:16, marginBottom:20, fontSize:13}}>
          <span style={{color:"#22c55e", fontWeight:"bold"}}>Content Admin mode</span><span style={{color:"#9ca3af"}}> — lessons, videos, CAPS and question bank.</span>
        </div>

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
          <div><h1 style={{fontSize:26, fontWeight:"800", margin:0}}>CAPS Content Factory</h1><p style={{color:"#9ca3af", fontSize:12, marginTop:6}}>Command center for Grade 12 curriculum production.</p></div>
          {/* WIRED BUTTON */}
          <button onClick={()=>router.push("/admin/studio")} style={{background:"#8b7cf8", color:"black", fontWeight:"800", padding:"12px 18px", borderRadius:16, border:"none", lineHeight:1.1}}>Open<br/>Content<br/>Studio</button>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20}}>
          {[["📘","Total topics",total],["✅","Published",0],["🕒","In review",0],["☰","Drafts",0],["⚠️","Needs changes",0],["✨","Missing CAPS meta",0]].map(([i,l,v]:any)=>(
            <div key={l} style={{background:"#1c1c24", padding:16, borderRadius:20}}><div>{i}</div><div style={{color:"#9ca3af", fontSize:12, marginTop:4}}>{l}</div><div style={{fontSize:28, fontWeight:"800"}}>{v}</div></div>
          ))}
        </div>
        <h3 style={{marginTop:20}}>Missing content</h3>
      </div>

      <div style={{position:"fixed", bottom:0, left:0, right:0, background:"#15151c", display:"flex", justifyContent:"space-around", padding:"10px 0 18px", borderTop:"1px solid #222"}}>
        {[
          ["🏠","Dashboard","/"],
          ["📖","Subjects","/subjects"],
          ["📋","Exams","/exams"],
          ["📊","Progress","/progress"],
          ["👤","Profile","/profile"],
        ].map(([icon,label,path])=>(
          <button key={label} onClick={()=>router.push(path)} style={{background:"none", border:"none", color:"#9ca3af", textAlign:"center"}}>{icon}<br/><span style={{fontSize:11}}>{label}</span></button>
        ))}
      </div>
    </div>
  );
}
