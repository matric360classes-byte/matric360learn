"use client"
import { useState } from 'react'

export default function MathBatch() {
  const [running, setRunning] = useState(false)
  const config = { model: 'google/gemini-2.5-pro', timeout: 180, concurrency: 1, delay: 10, costPerTopic: 0.0475, hardCap: 2.00 }
  return (
    <div className="bg-[#0f1115] text-white p-4 rounded-xl border border-gray-800">
      <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Math Batch — Overnight Factory</h2><span className={`px-3 py-1 rounded-full text-xs ${running?'bg-green-900':'bg-gray-800'}`}>{running?'● Running':'Idle'}</span></div>
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-[#1a1d24] p-3 rounded">Model: {config.model}</div>
        <div className="bg-[#1a1d24] p-3 rounded">Timeout: {config.timeout}s</div>
        <div className="bg-[#1a1d24] p-3 rounded">Concurrency: {config.concurrency}</div>
        <div className="bg-[#1a1d24] p-3 rounded">Delay: {config.delay}s</div>
        <div className="bg-[#1a1d24] p-3 rounded">Cost/topic: ${config.costPerTopic}</div>
        <div className="bg-[#1a1d24] p-3 rounded">Hard Cap: ${config.hardCap}</div>
      </div>
      <div className="bg-[#1a1d24] p-3 rounded mb-4 flex justify-between text-sm"><span>Cost used: $1.42 / $2.00</span><span>Topics: 30/40</span><span>Quality: 82-89 ≥80</span></div>
      <button onClick={()=>setRunning(!running)} className="w-full bg-blue-600 p-3 rounded font-bold">{running?'Pause':'▶ Run Batch (10 topics)'}</button>
      <div className="mt-3 text-xs text-gray-500">Source: [✓] CAPS KB [✓] MTG [✓] Learner [✓] Marker [✓] Master PDFs | Output: lesson_previews draft/needs_review</div>
    </div>
  )
}
