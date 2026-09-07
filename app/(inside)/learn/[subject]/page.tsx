"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SubjectLearnPage(){
  const params = useParams() as any;
  const subject = decodeURIComponent(params.subject || "").toLowerCase();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&select=*&order=node_label.asc`, {
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      console.log("ALL ROWS FOR", subject, data);
      setRows(Array.isArray(data)?data:[]);
    }
    if(subject) load();
  },[subject]);

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white p-4 pb-24">
      <h1 className="capitalize font-bold">{subject} • {rows.length} rows in DB</h1>
      <p className="text-[11px] text-zinc-500 mb-4">If you see 252 rows for physical-sciences, your Nodes are back. Scroll down.</p>
      {rows.map((n:any)=>(
        <div key={n.id} className="bg-[#151720] border border-[#1f2230] rounded-[18px] p-4 mb-3">
          <p className="text-[10px] text-[#7c7cff] font-bold">{n.title} • NODE {n.node_label}</p>
          <p className="text-[14px] mt-2 whitespace-pre-wrap">{n.content || "(no content - check content column)"}</p>
          {n.exam_hook && <div className="mt-3 bg-yellow-200 text-black rounded-xl p-3 text-[13px]"><b>Hook:</b> {n.exam_hook}</div>}
        </div>
      ))}
      {rows.length===0 && <p className="text-red-400 mt-6">No rows for subject={subject}. Go to Supabase topic_knowledge and check what values are in subject column.</p>}
    </div>
  )
}
