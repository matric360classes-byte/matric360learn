"use client";
import { useState } from "react";

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("12");
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState("");

  const handleBuild = async () => {
    if (!file) return alert("Choose PDF first");
    try {
      setStatus("Getting upload ticket...");
      setLogs("");

      // 1. Get signed upload URL (bypasses Vercel 4.5MB limit)
      const ticketRes = await fetch("/api/factory/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name })
      });
      const ticketData = await ticketRes.json();
      if (!ticketRes.ok) throw new Error(ticketData.error);
      
      const { signedUrl, path, token } = ticketData;
      setLogs(`Ticket OK: ${path}`);
      setStatus(`Uploading ${ (file.size/1024/1024).toFixed(1)}MB directly to Supabase...`);

      // 2. Upload BIG file directly to Supabase (phone -> Supabase, not through Vercel)
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "application/pdf" }
      });

      if (!uploadRes.ok) {
        const t = await uploadRes.text();
        throw new Error(`Direct upload failed: ${uploadRes.status} ${t}`);
      }

      setLogs(l => l + `\n✅ Uploaded: ${path}`);
      setStatus("Building lessons from PDF...");

      // 3. Build lessons from that path
      const buildRes = await fetch("/api/factory/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, subject, grade })
      });
      const buildData = await buildRes.json();
      if (!buildRes.ok) throw new Error(buildData.error);

      setStatus(`✅ DONE — ${buildData.count || 5} lessons built for ${subject} Grade ${grade}`);
      setLogs(l => l + `\n✅ DONE: ${JSON.stringify(buildData)}`);

    } catch (e:any) {
      setStatus(`❌ Error: ${e.message}`);
      setLogs(l => l + `\n❌ ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Matric360 Factory</h1>
      <p className="text-zinc-400 mb-6">Upload BIG PDFs (up to 50MB) - Direct to Supabase</p>

      <div className="space-y-4 bg-zinc-900 p-4 rounded-xl">
        <div>
          <label className="text-sm text-zinc-400">Subject</label>
          <select value={subject} onChange={e=>setSubject(e.target.value)} className="w-full mt-1 p-3 rounded bg-zinc-800">
            <option>Mathematics</option>
            <option>Physical Sciences</option>
            <option>Life Sciences</option>
            <option>Geography</option>
            <option>Accounting</option>
            <option>English</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-zinc-400">Grade</label>
          <select value={grade} onChange={e=>setGrade(e.target.value)} className="w-full mt-1 p-3 rounded bg-zinc-800">
            <option>12</option>
            <option>11</option>
            <option>10</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-zinc-400">PDF Textbook (Big files OK)</label>
          <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0] || null)} className="w-full mt-1 p-3 rounded bg-zinc-800" />
          {file && <p className="text-xs mt-2 text-green-400">{file.name} - {(file.size/1024/1024).toFixed(2)} MB</p>}
        </div>

        <button onClick={handleBuild} className="w-full bg-white text-black font-bold py-3 rounded-xl">
          Build Lessons from PDF
        </button>

        {status && <div className="p-3 rounded bg-zinc-800 text-sm">{status}</div>}
        {logs && <pre className="p-3 rounded bg-black text-xs whitespace-pre-wrap overflow-auto max-h-40">{logs}</pre>}
      </div>
    </div>
  );
}
