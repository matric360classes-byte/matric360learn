"use client"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Renders $...$ and \(...\) as real math
function MathText({ text }: { text: string }) {
  if (!text) return null
  // Normalize \( \) -> $ $
  let t = text.replace(/\\\(/g, '$').replace(/\\\)/g, '$')
  // Fix old broken plain text on the fly if DB not fixed yet
  t = t.replace(/f\^\(-1\)\(x\)/g, 'f^{-1}(x)')
      .replace(/f\^\(-1\)/g, 'f^{-1}')
      .replace(/∛\s*([a-zA-Z0-9()]+)/g, '\\sqrt[3]{$1}')
  const parts = t.split('$')
  return (
    <span>
      {parts.map((part, i) => {
        if (i % 2 === 1 && part.trim()) {
          try { return <InlineMath key={i} math={part} /> }
          catch { return <span key={i} style={{color:'#ff8'}}>${part}$</span> }
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

export default function PracticePage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [subject, setSubject] = useState("All")
  const [count, setCount] = useState(10)

  async function newSession() {
    setLoading(true)
    // FIX 1: pull ALL 3351, not 500
    let query = supabase.from("questions").select("*").eq("review_status","approved").limit(4000)
    if (subject!== "All") query = query.eq("subject", subject)
    const { data } = await query
    const shuffled = (data || []).sort(() => 0.5 - Math.random()).slice(0, count)
    setQuestions(shuffled)
    setLoading(false)
  }

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Practice — Exam Hub</h1>
      <p style={{ opacity: 0.6, marginTop: 4 }}>{questions.length? `${questions.length} loaded` : '3351'} Questions • Random every session</p>

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", background: "#111", padding: 16, borderRadius: 12 }}>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{ background: "#222", color: "white", padding: "10px 14px", borderRadius: 8 }}>
          <option value="All">All Subjects</option>
          <option value="Mathematics">Mathematics Only</option>
          <option value="Physical Sciences">Physical Sciences Only</option>
        </select>
        <select value={count} onChange={e=>setCount(Number(e.target.value))} style={{ background: "#222", color: "white", padding: "10px 14px", borderRadius: 8 }}>
          <option value={5}>5 Questions</option><option value={10}>10 Questions</option><option value={20}>20 Questions</option><option value={50}>50 Questions</option>
        </select>
        <button onClick={newSession} style={{ background: "#7c7cff", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: "bold" }}>
          {loading? "Generating..." : "New Session - Random Set"}
        </button>
      </div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((q, i) => (
          <div key={q.id} style={{ background: "#111", padding: 20, borderRadius: 12, border: "1px solid #222" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 11, flexWrap:"wrap" }}>
              <span style={{ background: "#222", padding: "4px 10px", borderRadius: 12 }}>Q{i+1}</span>
              <span style={{ background: q.subject === "Mathematics"? "#1a4d1a" : "#1a1a4d", padding: "4px 10px", borderRadius: 12 }}>{q.subject}</span>
              <span style={{ background: "#222", padding: "4px 10px", borderRadius: 12, opacity: 0.7 }}>{q.topic_path || q.topic}</span>
              <span style={{ background: "#333", padding: "4px 10px", borderRadius: 12 }}>{q.difficulty || q.difficulty_label}</span>
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.6 }}><MathText text={q.question_text} /></div>
            {q.options && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {Array.isArray(q.options)
                 ? q.options.map((v:any,idx:number)=><div key={idx} style={{ background: "#1a1a1a", padding: "8px 12px", borderRadius: 8 }}><MathText text={`${String.fromCharCode(65+idx)}. ${v}`} /></div>)
                  : Object.entries(q.options).map(([k][v]: any) => <div key={k} style={{ background: "#1a1a1a", padding: "8px 12px", borderRadius: 8 }}><MathText text={`${k}. ${v as string}`} /></div>)
                }
              </div>
            )}
            {q.explanation && <div style={{marginTop:12, padding:12, background:"#0f1a0f", borderRadius:8, fontSize:13, opacity:0.8}}><b>Memo: </b><MathText text={q.explanation} /></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
