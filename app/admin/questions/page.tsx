"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function QuestionsHub() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [subject, setSubject] = useState("All")
  const [page, setPage] = useState(0)
  const pageSize = 50

  async function load() {
    setLoading(true)
    let query = supabase.from("questions").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(page * pageSize, (page + 1) * pageSize - 1)

    if (subject !== "All") query = query.eq("subject", subject)
    if (search) query = query.ilike("question_text", `%${search}%`)

    const { data } = await query
    setQuestions(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [page, subject])

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>
          {questions.length > 0 ? `${page * pageSize + questions.length} questions` : "Question Bank"} • Mathematics + Physical Sciences
        </h1>
        <button style={{ background: "white", color: "black", padding: "8px 16px", borderRadius: 8, fontWeight: "bold" }}>+ New question</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          style={{ background: "#111", border: "1px solid #333", padding: 10, borderRadius: 8, width: 300, color: "white" }}
        />
        <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ background: "#111", color: "white", padding: 10, borderRadius: 8 }}>
          <option value="All">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physical Sciences">Physical Sciences</option>
        </select>
        <button onClick={load} style={{ background: "#7c7cff", padding: "10px 16px", borderRadius: 8 }}>Search</button>
        <span style={{ opacity: 0.6, paddingTop: 10 }}>Page {page + 1} • {pageSize} per page • NO TERM ✅</span>
      </div>

      <div style={{ marginTop: 20, background: "#111", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px 100px", padding: 12, background: "#222", fontWeight: "bold", fontSize: 12, opacity: 0.7 }}>
          <div>QUESTION</div><div>TOPIC PATH (NO TERM)</div><div>SUBJECT</div><div>DIFFICULTY</div><div>ACTION</div>
        </div>
        {loading ? <div style={{ padding: 20 }}>Loading {subject} questions...</div> :
          questions.map((q) => (
            <div key={q.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px 100px", padding: 12, borderBottom: "1px solid #222", fontSize: 13 }}>
              <div style={{ paddingRight: 12 }}>{q.question_text?.slice(0, 120)}...</div>
              <div style={{ opacity: 0.7 }}>{q.topic_path || `${q.subject} > ${q.unit} > ${q.topic}`}</div>
              <div><span style={{ background: q.subject === "Mathematics" ? "#1a4d1a" : "#1a1a4d", padding: "2px 8px", borderRadius: 12, fontSize: 11 }}>{q.subject}</span></div>
              <div>{q.difficulty_label || q.difficulty_l}</div>
              <div style={{ color: "#7c7cff", cursor: "pointer" }}>Edit</div>
            </div>
          ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
        <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))} style={{ background: "#222", padding: "8px 16px", borderRadius: 8 }}>Prev</button>
        <span style={{ padding: "8px 16px", background: "#111", borderRadius: 8 }}>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} style={{ background: "#222", padding: "8px 16px", borderRadius: 8 }}>Next</button>
      </div>
    </div>
  )
}
