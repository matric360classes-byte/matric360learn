"use client";
import { useState } from "react";
import Link from "next/link";

export default function Studio() {
  const [file, setFile] = useState<File|null>(null);
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("12");
  const [log, setLog] = useState("");

  const upload = async () => {
    if(!file){ setLog("Pick a PDF first"); return; }
    setLog("Uploading PDF to source-pdfs...");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("subject", subject);
    fd.append("grade", grade);
    const res = await fetch("/api/factory/upload", { method: "POST", body: fd });
    const data = await res.json();
    if(!res.ok){ setLog("Error: " + (data.error||"upload failed")); return; }
    setLog(`✅ Saved: ${data.path}\nBuilding Nodes A-E + Exam questions...`);
    const gen = await fetch("/api/factory/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdf_path: data.path, subject, grade })
    });
    const out = await gen.json();
    if(!gen.ok){ setLog("Generate error: " + out.error); return; }
    setLog(`✅ DONE — ${out.lessons} lessons built (Node A-E) + ${out.questions} exam questions\nGo to /admin — your counts will jump LIVE.\nGo to /subjects — lessons appear on ALL Nodes.`);
  };

  return (
    <div style={{ background: "#0F0F12", minHeight: "100vh", color: "white", padding: "20px", fontFamily: "system-ui", paddingBottom: "90px" }}>
      <Link href="/admin" style={{ color: "#8A8EA6", textDecoration: "none" }}>← Back to Factory</Link>
      <h1 style={{ marginTop: "20px", fontSize: "26px" }}>Content Studio — PDF to Lesson Factory</h1>
      <p style={{ color: "#8A8EA6" }}>Upload CAPS PDF → auto-builds lessons for Node A-E + Practice Exams (LIVE to DB)</p>

      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{ padding: "10px", borderRadius: "12px", background: "#1E1E26", color: "white", border: "1px solid #2A2A35" }}>
          <option>Mathematics</option><option>Physical Sciences</option><option>Life Sciences</option><option>Accounting</option><option>Geography</option><option>Business Studies</option>
        </select>
        <select value={grade} onChange={e=>setGrade(e.target.value)} style={{ padding: "10px", borderRadius: "12px", background: "#1E1E26", color: "white", border: "1px solid #2A2A35" }}>
          <option>12</option><option>11</option><option>10</option>
        </select>
      </div>

      <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)} style={{ marginTop: "20px", display: "block", color: "#8A8EA6" }} />
      <button onClick={upload} style={{ background: "#7C7CFF", color: "black", padding: "16px 24px", borderRadius: "16px", marginTop: "16px", fontWeight: "800", border: "none" }}>Build Lessons from PDF</button>
      <pre style={{ marginTop: "20px", background: "#1E1E26", padding: "16px", borderRadius: "16px", whiteSpace: "pre-wrap", border: "1px solid #2A2A35" }}>{log || "Log will appear here..."}</pre>
    </div>
  );
}
