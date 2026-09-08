"use client"
import { useState } from 'react'

export default function KBCoverage() {
  const [topics] = useState([
    { code: 'M-P1-ALG-01', topic: 'Algebra Equations ±25', mtg: true, learner: true, marker: true, master: true, marks: 25, source: 'algebra...final + MTG Unit2 p37-41' },
    { code: 'M-P1-PAT-03', topic: 'Quadratic Tn=3n²+4n-2', mtg: true, learner: true, marker: true, master: true, marks: 25, source: 'sequencesseries + MTG p47 5;18;37;62;93' },
    { code: 'M-P1-FIN-03', topic: 'Sinking Fund Jabulani', mtg: true, learner: true, marker: true, master: false, marks: 15, source: 'Learner p48 Q22 + Marker Q7 14.14%' },
    { code: 'M-P1-FUN-03', topic: 'Inverses f=2x+6→½x-3 ±√', mtg: true, learner: true, marker: true, master: true, marks: 35, source: 'inverse...final + MTG p81-82 + Marker Q8.3.2-3 poorly' },
  ])
  return (
    <div className="bg-[#0f1115] text-white p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-1">KB Coverage — CAPS 173 topics</h2>
      <div className="grid gap-2 mt-4">
        {topics.map(t => (
          <div key={t.code} className="flex justify-between bg-[#1a1d24] p-3 rounded-lg border border-gray-800">
            <div><div className="font-mono text-sm">{t.code} {t.topic}</div><div className="text-xs text-gray-500">{t.source}</div></div>
            <div className="flex gap-2 items-center">
              <span className={`w-3 h-3 rounded-full ${t.mtg?'bg-green-500':'bg-red-500'}`}/><span className={`w-3 h-3 rounded-full ${t.learner?'bg-green-500':'bg-red-500'}`}/><span className={`w-3 h-3 rounded-full ${t.marker?'bg-green-500':'bg-red-500'}`}/><span className={`w-3 h-3 rounded-full ${t.master?'bg-green-500':'bg-red-500'}`}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
