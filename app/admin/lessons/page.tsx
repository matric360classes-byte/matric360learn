"use client";
import { useState } from "react";
import Link from "next/link";
import { LESSONS, SUBJECTS } from "../../../lib/lessons";

export default function AdminLessonsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? LESSONS : LESSONS.filter(l => l.subjectId === filter);
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin - {filtered.length} Topics LIVE</h1>
      <div style={{ margin: "10px 0" }}>
        <button onClick={() => setFilter("all")}>All ({LESSONS.length})</button>
        {SUBJECTS.map((s:any) => (
          <button key={s.id} onClick={() => setFilter(s.id)} style={{ marginLeft: 8 }}>
            {s.name}
          </button>
        ))}
      </div>
      <ul>
        {filtered.map((l:any) => (
          <li key={l.id}>{l.subjectName} - {l.title} [{l.status}]</li>
        ))}
      </ul>
      <Link href="/admin">Back to Admin</Link>
    </div>
  );
}
