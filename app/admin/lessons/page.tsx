"use client";
import { useState } from "react";
import { SUBJECTS_DATA } from "../../../lib/subjects";

function getYoutubeId(url:string){
  if(!url) return "";
  if(url.length===11 && !url.includes("/") ) return url; // already ID
  try{
    const u=new URL(url);
    if(u.searchParams.get("v")) return u.searchParams.get("v")||"";
    const parts=u.pathname.split("/").filter(Boolean);
    return parts.pop()||"";
  }catch{ return url; }
}

export default function VideoEngine(){
  const all=Object.values(SUBJECTS_DATA as any).flatMap((s:any)=>s.sections.flatMap((sec:any)=>sec.units.map((u:any)=>({subjectId:s.id,subjectName:s.name,section:sec.title,unit:u}))));
  const [links,setLinks]=useState<Record<string,string>>({});
  const [copied,setCopied]=useState(false);

  const generateFile=()=>{
    let out="// COPY this to lib/subjects.ts — youtubeId updated with your unlisted links\n";
    out+=JSON.stringify(SUBJECTS_DATA,null,2);
    // simple replace
    Object.entries(links).forEach(([topicId,url])=>{
      const id=getYoutubeId(url);
      if(id) out=out.replace(new RegExp(`"id": "${topicId}"[\\s\\S]*?"youtubeId": "[^"]+"`), `"id": "${topicId}"`+`... youtubeId: "${id}"`);
    });
    return out;
  };

  return(
    <div style={{background:"#0a0a12",minHeight:"100vh",color:"#fff",padding:16}}>
      <h1 style={{fontSize:22,fontWeight:900}}>YouTube Video Engine — Unlisted</h1>
      <div style={{fontSize:12,color:"#8a8a9a",marginTop:6}}>Add your YouTube unlisted links here • Average 45min • Supports 80min+ • No re-deploy needed later</div>

      <div style={{marginTop:16,background:"#1c1c28",borderRadius:12,padding:12,border:"1px solid #2a2a3a"}}>
        <div style={{fontSize:12,fontWeight:800}}>How to add video:</div>
        <div style={{fontSize:11,color:"#8a8a9a",marginTop:6,lineHeight:1.5}}>
                    1. Upload to YouTube as **Unlisted**<br/>
                    2. Copy link: e.g. https://youtu.be/abc123xyz or https://www.youtube.com/watch?v=abc123xyz<br/>
                    3. Paste below for that subtopic — Engine extracts ID automatically<br/>
                    4. Player will play 45min average, 80min max no problem
        </div>
      </div>

      {all.map((g:any)=>(
        <div key={g.unit.id} style={{marginTop:20}}>
          <div style={{fontSize:11,letterSpacing:1,color:"#6b7280",fontWeight:800}}>{g.subjectName} • {g.section} • {g.unit.unit} — {g.unit.title}</div>
          {g.unit.topics.map((t:any)=>(
            <div key={t.id} style={{marginTop:8,background:"#1c1c28",borderRadius:12,padding:12,display:"flex",gap:10,alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700}}>{t.title}</div>
                <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>Current: {t.youtubeId} • {links[t.id] ? `New: ${getYoutubeId(links[t.id])}` : "No new link"}</div>
                <input value={links[t.id]||""} onChange={e=>setLinks({...links,[t.id]:e.target.value})} placeholder="Paste YouTube unlisted link or ID here" style={{marginTop:8,width:"100%",background:"#0a0a12",border:"1px solid #2a2a3a",borderRadius:8,padding:8,color:"#fff",fontSize:11}}/>
              </div>
              <div style={{width:60,height:34,background:"#000",borderRadius:8,overflow:"hidden",flexShrink:0}}>
                <img src={`https://img.youtube.com/vi/${getYoutubeId(links[t.id]||t.youtubeId)}/mqdefault.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{marginTop:24,background:"#fff",borderRadius:16,padding:16}}>
        <div style={{color:"#000",fontWeight:900,fontSize:13}}>Your 45min Unlisted Videos — Ready?</div>
        <div style={{color:"#6b7280",fontSize:11,marginTop:4}}>After adding links, tell me and I will generate final lib/subjects.ts file with all your real IDs — 1 copy-paste and all videos live!</div>
        <button onClick={()=>{
          const text=Object.entries(links).map(([id,url])=>`${id} = ${getYoutubeId(url)}`).join("\n");
          navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000);
        }} style={{marginTop:10,width:"100%",background:"#000",color:"#fff",borderRadius:999,padding:12,fontWeight:800,border:0}}>{copied?"Copied IDs!":"Copy My YouTube IDs List"}</button>
      </div>
    </div>
  );
}
