"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function FactoryFlatPage(){
  const [topics,setTopics]=useState<any[]>([]);
  const [pdfs,setPdfs]=useState<any[]>([]);
  const [selectedTopics,setSelectedTopics]=useState<string[]>([]);
  const [selectedPdfs,setSelectedPdfs]=useState<string[]>([]);
  const [subjectFilter,setSubjectFilter]=useState<'ALL'|'MATH'|'PHYS'>('ALL');
  const [running,setRunning]=useState(false);

  useEffect(()=>{(async()=>{
    // FETCH BOTH MATH + PHYS
    const { data: tData } = await supabase
      .from("topic_knowledge")
      .select("id, caps_code, topic_name, subject, grade")
      .or("caps_code.ilike.MATH%,caps_code.ilike.PHYS%,subject.ilike.%math%,subject.ilike.%phys%")
      .limit(100);
    setTopics(tData||[]);

    // FETCH PDFs - try pdf_sources table, fallback to storage
    const { data: pData } = await supabase.from("pdf_sources").select("id, file_name, storage_path").limit(50);
    if(pData && pData.length>0){
      setPdfs(pData.map(p=>p.file_name||p.storage_path));
    } else {
      // fallback if you use storage bucket called 'pdfs'
      const { data: sData } = await supabase.storage.from("pdfs").list();
      setPdfs((sData||[]).map((f:any)=>f.name));
    }
  })()},[]);

  const filteredTopics = topics.filter(t=>{
    if(subjectFilter==='ALL') return true;
    if(subjectFilter==='MATH') return t.caps_code?.startsWith('MATH') || t.subject?.toLowerCase().includes('math');
    if(subjectFilter==='PHYS') return t.caps_code?.startsWith('PHYS') || t.subject?.toLowerCase().includes('phys');
    return true;
  });

  const estCost = selectedTopics.length * selectedPdfs.length * 0.0475;

  const generate = async()=>{
    if(selectedTopics.length===0 || selectedPdfs.length===0) return alert("Select 1+ topics and 1+ PDFs");
    setRunning(true);
    try{
      const payload = {
        topic_ids: selectedTopics,
        pdf_files: selectedPdfs,
        provider: "Matric360 AI Gateway",
        model: "google/gemini-2.5-pro"
      };
      const res = await fetch("/api/factory/batch",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const j = await res.json();
      alert(`Queued: ${j.queued} | Failed: ${j.failed||0}\nEST $${j.total_estimated_cost||estCost}`);
    }catch(e:any){ alert("Failed: "+e.message); }
    setRunning(false);
  };

  return (
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", padding:16, fontFamily:"system-ui"}}>
      <h1 style={{fontSize:22, fontWeight:800}}>Math Batch - Flat + Bulk PDFs</h1>
      
      <div style={{marginTop:16}}>
        <b>Step 1: Bulk Source PDFs ({pdfs.length} found)</b>
        <div style={{display:"flex", flexWrap:"wrap", gap:8, marginTop:8}}>
          {pdfs.map((p:string)=><label key={p} style={{background:"#1c1c24", padding:"6px 10px", borderRadius:10, fontSize:12, border: selectedPdfs.includes(p)?"1px solid #8b7cf8":"1px solid #222"}}>
            <input type="checkbox" checked={selectedPdfs.includes(p)} onChange={e=>{
              if(e.target.checked) setSelectedPdfs([...selectedPdfs,p]);
              else setSelectedPdfs(selectedPdfs.filter(x=>x!==p));
            }} /> {p}
          </label>)}
        </div>
      </div>

      <div style={{marginTop:20}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <b>Step 2: Maths Topics Only ({filteredTopics.length} found / {topics.length} total)</b>
          <div style={{display:"flex", gap:6}}>
            <button onClick={()=>setSubjectFilter('ALL')} style={{background:subjectFilter==='ALL'?'#8b7cf8':'#1c1c24', color:subjectFilter==='ALL'?'black':'white', padding:"4px 10px", borderRadius:10, border:"none", fontSize:12, fontWeight:700}}>ALL</button>
            <button onClick={()=>setSubjectFilter('MATH')} style={{background:subjectFilter==='MATH'?'#8b7cf8':'#1c1c24', color:subjectFilter==='MATH'?'black':'white', padding:"4px 10px", borderRadius:10, border:"none", fontSize:12, fontWeight:700}}>Pure Maths</button>
            <button onClick={()=>setSubjectFilter('PHYS')} style={{background:subjectFilter==='PHYS'?'#8b7cf8':'#1c1c24', color:subjectFilter==='PHYS'?'black':'white', padding:"4px 10px", borderRadius:10, border:"none", fontSize:12, fontWeight:700}}>Physical Sciences</button>
          </div>
        </div>

        <div style={{marginTop:10, display:"flex", flexDirection:"column", gap:6, maxHeight:400, overflow:"auto", background:"#121218", padding:10, borderRadius:12}}>
          {filteredTopics.map((t:any)=><label key={t.id} style={{display:"flex", gap:8, background:"#1c1c24", padding:"8px 10px", borderRadius:10, fontSize:13, border: selectedTopics.includes(t.id)?"1px solid #8b7cf8":"1px solid #222"}}>
            <input type="checkbox" checked={selectedTopics.includes(t.id)} onChange={e=>{
              if(e.target.checked) setSelectedTopics([...selectedTopics,t.id]);
              else setSelectedTopics(selectedTopics.filter(x=>x!==t.id));
            }} />
            <span>{t.topic_name} - Grade {t.grade} - {t.grade?.toString().startsWith('10')?'G10':t.grade?.toString().startsWith('11')?'G11':'G12'} | {t.caps_code} | {t.id.slice(0,8)}</span>
          </label>)}
        </div>
      </div>

      <div style={{position:"sticky", bottom:0, marginTop:16, background:"#1c1c24", padding:"12px 16px", borderRadius:16, display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid #333"}}>
        <b style={{fontSize:13}}>TOPICS {selectedTopics.length} | PDFs {selectedPdfs.length} | EST ${estCost.toFixed(4)}</b>
        <button disabled={running||selectedTopics.length===0} onClick={generate} style={{background: running?"#333":"white", color:"black", fontWeight:800, padding:"10px 18px", borderRadius:20, border:"none"}}>
          {running?"QUEUING...":"Generate Nodes A-E"}
        </button>
      </div>
    </div>
  );
}
