"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function AdminPage() {
  const [total, setTotal] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(true);

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from("topic_knowledge").select("id", { count: "exact", head: true });
      setTotal(count || 0);
    })();
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui" }}>
      {/* HEADER */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#0f0f14"}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{width:44,height:44,background:"#1e1e28",borderRadius:12,border:"none",color:"white",fontSize:20}}>☰</button>
          <h2 style={{margin:0, fontSize:18}}>Matric360</h2>
        </div>
        <div style={{display:"flex", gap:8}}>
          <span style={{background:"#1e1e28", padding:"6px 12px", borderRadius:20, fontSize:12}}>🛡️ Content</span>
          <span style={{background:"#1e1e28", padding:"6px 12px", borderRadius:20, fontSize:12, color:"#22c55e"}}>📶 Online</span>
        </div>
      </div>

      <div style={{display:"flex"}}>
        {/* SIDEBAR - Shows when hamburger clicked - YOUR SEQUENCE */}
        {menuOpen && (
          <div style={{width:"280px", background:"#15151e", minHeight:"90vh", padding:16, borderRadius:"0 20px 20px 0"}}>
            <div onClick={()=>setGenOpen(!genOpen)} style={{display:"flex", justifyContent:"space-between", fontWeight:"bold", padding:"10px 0", cursor:"pointer"}}>
              <span>🛠️ Generation Tools</span><span>{genOpen ? "∨" : ">"}</span>
            </div>
            {genOpen && (
              <div style={{marginLeft:12, borderLeft:"1px solid #222", paddingLeft:12, display:"flex", flexDirection:"column", gap:8}}>
                <div style={{background:"#8b7cf8", color:"black", padding:"10px 18px", borderRadius:24, fontWeight:"bold", width:"fit-content"}}>Factory</div>
                <div style={{color:"#8a8a9a", padding:"8px"}}>Direct Generate</div>
                <div style={{color:"#8a8a9a", padding:"8px"}}>Curriculum AI</div>
                <div style={{color:"#8a8a9a", padding:"8px"}}>Upgrade Lessons</div>
                <div style={{color:"#8a8a9a", padding:"8px"}}>Content Repair</div>
                <div style={{color:"#8a8a9a", padding:"8px"}}>Math Regen</div>
                <div style={{color:"#8a8a9a", padding:"8px"}}>Math Batch</div>
                <div style={{color:"#8a8a9a", padding:"8px"}}>Publishing Queue</div>
              </div>
            )}
            <div style={{marginTop:20, display:"flex", justifyContent:"space-between", color:"#8a8a9a", padding:"8px 0"}}><span>📘 Knowledge Base</span><span>›</span></div>
            <div style={{color:"#8a8a9a", padding:"8px 0"}}>🎥 Videos</div>
            <div style={{display:"flex", justifyContent:"space-between", color:"#8a8a9a", padding:"8px 0"}}><span>📋 Exam Hub</span><span>›</span></div>
            <div style={{marginTop:10, display:"flex", justifyContent:"space-between", color:"#8a8a9a", padding:"8px 0"}}><span>🧪 Beta & QA</span><span>›</span></div>
            <div style={{color:"#8a8a9a", padding:"8px 0"}}>👥 Users</div>
          </div>
        )}

        {/* MAIN CONTENT - Content Admin First */}
        <div style={{flex:1, padding:16}}>
          <div style={{background:"#1a221a", border:"1px solid #2a3a2a", padding:14, borderRadius:20, marginBottom:20, fontSize:14}}>
            <span style={{color:"#22c55e", fontWeight:"bold"}}>Content Admin mode</span>
            <span style={{color:"#9ca3af"}}> — lessons, videos, CAPS and question bank. Payments, roles and system settings are restricted.</span>
          </div>

          <div style={{display:"flex", justifyContent:"space-between"}}>
            <div>
              <h1 style={{fontSize:28, fontWeight:"800", margin:0}}>CAPS Content Factory</h1>
              <p style={{color:"#9ca3af", fontSize:13, marginTop:6}}>Command center for Grade 12 curriculum production.</p>
            </div>
            <button style={{background:"#8b7cf8", color:"black", fontWeight:"800", padding:"10px 16px", borderRadius:16, border:"none", height:56}}>Open<br/>Content<br/>Studio</button>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20}}>
            {[
              ["📘","Total topics", total],
              ["✅","Published", 0],
              ["🕒","In review", 0],
              ["☰","Drafts", 0],
              ["⚠️","Needs changes", 0],
              ["✨","Missing CAPS meta", 0],
            ].map(([icon,label,val]:any)=>(
              <div key={label} style={{background:"#1c1c24", padding:18, borderRadius:22}}>
                <div>{icon}</div>
                <div style={{color:"#9ca3af", fontSize:12, marginTop:6}}>{label}</div>
                <div style={{fontSize:30, fontWeight:"800", marginTop:4}}>{val}</div>
              </div>
            ))}
          </div>
          <h3 style={{marginTop:24}}>Missing content</h3>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{position:"fixed", bottom:0, left:0, right:0, background:"#15151c", display:"flex", justifyContent:"space-around", padding:"8px 0 18px", borderTop:"1px solid #222", fontSize:11}}>
        <div style={{textAlign:"center"}}>🏠<br/>Dashboard</div>
        <div style={{textAlign:"center"}}>📖<br/>Subjects</div>
        <div style={{textAlign:"center"}}>📋<br/>Exams</div>
        <div style={{textAlign:"center"}}>📊<br/>Progress</div>
        <div style={{textAlign:"center"}}>👤<br/>Profile</div>
      </div>
    </div>
  );
}
