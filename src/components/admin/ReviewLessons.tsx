"use client"
export default function ReviewLessons() {
  const lessons = [
    { code: 'M-P1-ALG-01', topic: 'Algebra ±25', quality: 87, msaca: true, cost: 0.0475 },
    { code: 'M-P1-PAT-03', topic: 'Quadratic Tn=3n²+4n-2', quality: 88, msaca: true, cost: 0.0475 },
    { code: 'M-P1-FIN-03', topic: 'Sinking Fund Jabulani', quality: 86, msaca: true, cost: 0.0475 },
  ]
  return (
    <div className="bg-[#0f1115] text-white p-4 rounded-xl">
      <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">⚡ Review Lessons — Publishing Queue</h2><button className="bg-green-600 px-4 py-2 rounded text-sm font-bold">Approve All ≥80</button></div>
      <div className="grid gap-2">
        {lessons.map(l=>(
          <div key={l.code} className="flex justify-between items-center bg-[#1a1d24] p-3 rounded border border-gray-800">
            <div><div className="font-mono text-sm">{l.code} {l.topic} <span className="ml-2 px-2 py-0.5 rounded text-xs bg-green-900 text-green-300">{l.quality}</span></div><div className="text-xs text-gray-500">M/S/A/CA {l.msaca?'✅':'❌'} | ${l.cost}</div></div>
            <div className="flex gap-2"><button className="text-xs bg-gray-800 px-3 py-1 rounded">View Nodes</button><button className="text-xs bg-blue-600 px-3 py-1 rounded">Approve</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
