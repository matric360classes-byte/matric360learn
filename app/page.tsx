"use client";
import { useState } from "react";
import { SUBJECTS_DATA } from "@/lib/subjects";

export default function SPage() {
  const [subjectKey, setSubjectKey] = useState("mathematics");
  const [unitId, setUnitId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);

  const subject = (SUBJECTS_DATA as any)[subjectKey];
  if(!subject) return <div className="p-6">No subject</div>;
  const section = subject.sections[0];
  const units = section.units || [];

  const activeUnit = units.find((u:any)=>u.id===unitId);
  const activeTopic = activeUnit?.subTopics?.find((t:any)=>t.id===topicId) || units.find((u:any)=>u.id===topicId);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-2">{subject.name} - Level 2 OK</h1>

      {/* SUBJECT SWITCH */}
      <div className="flex gap-2 mb-4">
        <button onClick={()=>{setSubjectKey("mathematics"); setUnitId(null); setTopicId(null)}} className={`px-3 py-2 rounded ${subjectKey==="mathematics"?"bg-white text-black":"bg-zinc-800"}`}>Mathematics</button>
        <button onClick={()=>{setSubjectKey("physicalSciences"); setUnitId(null); setTopicId(null)}} className={`px-3 py-2 rounded ${subjectKey==="physicalSciences"?"bg-white text-black":"bg-zinc-800"}`}>Physical Sciences</button>
      </div>

      {!unitId && (
        <div className="grid gap-3">
          {units.map((u:any)=>(
            <button key={u.id} onClick={()=>setUnitId(u.id)} className="text-left bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="font-bold">{u.unit} • {u.title}</div>
              <div className="text-sm text-zinc-400">{u.subTopics?.length||0} topics</div>
            </button>
          ))}
        </div>
      )}

      {unitId &&!topicId && activeUnit && (
        <div>
          <button onClick={()=>setUnitId(null)} className="mb-3 text-sm underline">← Back to Units</button>
          <h2 className="font-bold text-xl mb-3">{activeUnit.title} - Level 3</h2>
          <div className="grid gap-2">
            {(activeUnit.subTopics||[]).map((t:any)=>(
              <button key={t.id} onClick={()=>setTopicId(t.id)} className="text-left bg-zinc-900 p-4 rounded-xl">
                ▶ {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {topicId && (
        <div>
          <button onClick={()=>setTopicId(null)} className="mb-3 text-sm underline">← Back</button>
          <h2 className="font-bold text-xl mb-3">Level 4: {(activeTopic||activeUnit)?.title}</h2>
          <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center">
            <iframe className="w-full h-full rounded-xl" src={`https://www.youtube.com/embed/${(activeTopic||activeUnit)?.youtubeId}`} allowFullScreen />
          </div>
          <p className="mt-3 text-zinc-400">YouTube ID: {(activeTopic||activeUnit)?.youtubeId}</p>
        </div>
      )}
    </div>
  );
}
