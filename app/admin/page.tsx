"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcmkhe.supabase.co",
  "sb_secret_UlK_LoRsi6zy2EKFfqbwTg_7KnAqq9w"
);

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(true);
  const [kbOpen, setKbOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [bySubject, setBySubject] = useState<any>({});

  useEffect(() => {
    (async () => {
      const { count: total } = await supabase.from("topic_knowledge").select("id", { count: "exact", head: true });
      const { data: topics } = await supabase.from("topic_knowledge").select("*");
      const { data: lessons } = await supabase.from("lesson_previews").select("topic_id").then(r=>r).catch(()=>({data:[]})) as any;
const { data: questions } = await supabase.from("questions").select("topic_id").then(r=>r).catch(()=>({data:[]})) as any;
      const qMap: any = {};
      questions?.forEach((q: any) => { qMap[q.topic_id] = (qMap[q.topic_id] || 0) + 1; });
      const lessonSet = new Set(lessons?.map((l: any) => l.topic_id));
      const t = topics || [];
      const totalLive = total || t.length;
      setStats({
        total: totalLive,
        published: t.filter((x: any) => x.status === 'published' || x.is_published).length,
        inReview: t.filter((x: any) => x.status === 'in_review').length,
        drafts: t.filter((x: any) => x.status === 'draft').length,
        needsChanges: t.filter((x: any) => x.status === 'needs_changes').length,
        missingMeta: t.filter((x: any) =>!x.caps_code ||!x.subject).length,
        missingNodes: t.filter((x: any) =>!lessonSet.has(x.id)).length,
        lessThan3: t.filter((x: any) => (qMap[x.id] || 0) < 3).length,
        missingPaper: t.filter((x: any) =>!x.paper).length,
      });
      const grouped: any = {};
      t.forEach((row: any) => {
        const subj = row.subject || 'Unassigned';
        if (!grouped[subj]) grouped[subj] = { topics: 0, scaffolded: 0, qs: 0, inReview: 0 };
        grouped[subj].topics++;
        if (lessonSet.has(row.id)) grouped[subj].scaffolded++;
        if ((qMap[row.id] || 0) >= 3) grouped[subj].qs++;
        if (row.status === 'in_review') grouped[subj].inReview++;
      });
      setBySubject(grouped);
    })();
  }, []);

  const card = { background: "#1E1E26", borderRadius: "24px", padding: "20px", border: "1px solid #2A2A35" };

  return (
    <div style={{ background: "#0F0F12", minHeight: "100vh", color: "white", paddingBottom: "90px", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1E1E26" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#1E1E26", border: "1px solid #2A2A35", color: "white" }}>☰</button>
          <b>Matric360</b>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ padding: "6px 12px", borderRadius: "20px", background: "#1E1E26", border: "1px solid #2A2A35", fontSize: "13px" }}>🛡️ Content</span>
          <span style={{ padding: "6px 12px", borderRadius: "20px", background: "#1E1E26", border: "1px solid #2A2A35", fontSize: "13px", color: "#22C55E" }}>🛜 Online</span>
        </div>
      </div>

      <div style={{ margin: "16px", background: "#121F16", borderRadius: "24px", padding: "16px", border: "1px solid #1E3A2A", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.4" }}><span style={{ color: "#22C55E", fontWeight: "700" }}>Content Admin mode</span> — lessons, videos, CAPS and question bank. Payments, roles and system settings are restricted.</div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1E1E26", border: "1px solid #2A2A35", color: "white" }}>{menuOpen? "✕" : "☰"}</button>
      </div>

      {menuOpen && (
        <div style={{ margin: "0 16px", background: "#1E1E26", borderRadius: "24px", padding: "20px", border: "1px solid #2A2A35" }}>
          <div>⊞ Dashboard</div>
          <div onClick={() => setContentOpen(!contentOpen)} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontWeight: "700" }}>📄 Content <span>{contentOpen? "⌄" : "›"}</span></div>
          {contentOpen && <div style={{ marginLeft: "12px", borderLeft: "1px solid #2A2A35", paddingLeft: "16px", color: "#8A8EA6", lineHeight: "2.5" }}>Lesson Manager<br/>Live Lessons<br/>⚡ Review Lessons<br/>🩺 Content Health<br/>🧹 Content Cleanup<br/>Content Coverage<br/>Announcements</div>}
          <div onClick={() => setKbOpen(!kbOpen)} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontWeight: "700" }}>📖 Knowledge Base <span>{kbOpen? "⌄" : "›"}</span></div>
          {kbOpen && <div style={{ marginLeft: "12px", borderLeft: "1px solid #2A2A35", paddingLeft: "16px", color: "#8A8EA6", lineHeight: "2.5" }}>Knowledge Base<br/>CAPS KB<br/>Source PDFs<br/>KB Coverage</div>}
          <div style={{ padding: "14px 0" }}>🎥 Videos</div>
          <div onClick={() => setExamOpen(!examOpen)} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontWeight: "700" }}>📋 Exam Hub <span>{examOpen? "⌄" : "›"}</span></div>
          {examOpen && <div style={{ marginLeft: "12px", borderLeft: "1px solid #2A2A35", paddingLeft: "16px", color: "#8A8EA6", lineHeight: "2.5" }}>Questions<br/>Question Bank Audit<br/>Question Coverage</div>}
          <div onClick={() => setGenOpen(!genOpen)} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontWeight: "700" }}>🛠️ Generation Tools <span>{genOpen? "⌄" : "›"}</span></div>
          {genOpen && <div style={{ marginLeft: "12px", borderLeft: "1px solid #2A2A35", paddingLeft: "12px" }}><div style={{ background: "#7C7CFF", color: "black", borderRadius: "20px", padding: "10px 16px", fontWeight: "700", display: "inline-block" }}>Factory</div><div style={{ color: "#8A8EA6", lineHeight: "2.6", marginTop: "8px" }}>Direct Generate<br/>Curriculum AI<br/>Upgrade Lessons<br/>Content Repair<br/>Math Regen<br/>Math Batch<br/>Publishing Queue</div></div>}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", marginTop: "8px" }}>🧪 Beta & QA <span>›</span></div>
          <div style={{ padding: "8px 0" }}>👥 Users</div>
        </div>
      )}

      <div style={{ padding: "20px 16px 0 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div><h1 style={{ fontSize: "26px", fontWeight: "800", margin: 0 }}>CAPS Content Factory</h1><p style={{ color: "#8A8EA6", fontSize: "14px" }}>Command center for Grade 12 curriculum production.</p></div>
          <Link href="/admin/studio"><button style={{ background: "#7C7CFF", color: "black", border: "none", borderRadius: "16px", padding: "14px 18px", fontWeight: "700" }}>Open Content<br/>Studio</button></Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
          <div style={card}><div>📘</div><div style={{ color: "#8A8EA6", fontSize: "14px", marginTop: "8px" }}>Total topics</div><div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>{stats? stats.total : "..."}</div></div>
          <div style={card}><div>✅</div><div style={{ color: "#8A8EA6", fontSize: "14px", marginTop: "8px" }}>Published</div><div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>{stats? stats.published : "..."}</div></div>
          <div style={card}><div>🕐</div><div style={{ color: "#8A8EA6", fontSize: "14px", marginTop: "8px" }}>In review</div><div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>{stats? stats.inReview : "..."}</div></div>
          <div style={card}><div>☰</div><div style={{ color: "#8A8EA6", fontSize: "14px", marginTop: "8px" }}>Drafts</div><div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>{stats? stats.drafts : "..."}</div></div>
          <div style={card}><div>⚠️</div><div style={{ color: "#8A8EA6", fontSize: "14px", marginTop: "8px" }}>Needs changes</div><div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>{stats? stats.needsChanges : "..."}</div></div>
          <div style={card}><div>✨</div><div style={{ color: "#8A8EA6", fontSize: "14px", marginTop: "8px" }}>Missing CAPS meta</div><div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>{stats? stats.missingMeta : "..."}</div></div>
        </div>

        <h3 style={{ marginTop: "24px", fontSize: "18px" }}>Missing content</h3>
        <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
          <div style={card}><div style={{ color: "#8A8EA6" }}>Topics missing nodes A-E</div><div style={{ color: "#EF4444", fontSize: "32px", fontWeight: "800" }}>{stats? stats.missingNodes : "..."}</div></div>
          <div style={card}><div style={{ color: "#8A8EA6" }}>Topics with &lt;3 questions</div><div style={{ color: "#EF4444", fontSize: "32px", fontWeight: "800" }}>{stats? stats.lessThan3 : "..."}</div></div>
          <div style={card}><div style={{ color: "#8A8EA6" }}>Topics missing paper/section</div><div style={{ color: "#EF4444", fontSize: "32px", fontWeight: "800" }}>{stats? stats.missingPaper : "..."}</div></div>
        </div>

        <h3 style={{ marginTop: "24px", fontSize: "18px" }}>Completion by subject</h3>
        <div style={{ background: "#1E1E26", borderRadius: "24px", border: "1px solid #2A2A35", marginTop: "12px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr 0.9fr 0.5fr 0.6fr", padding: "12px 16px", fontSize: "12px", color: "#8A8EA6", fontWeight: "600" }}><span>SUBJECT</span><span>TOPICS</span><span>SCAFFOLDED</span><span>≥3 QS</span><span>IN REVIEW</span></div>
          {Object.entries(bySubject).map(([subj, v]: any) => (
            <div key={subj} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr 0.9fr 0.5fr 0.6fr", padding: "14px 16px", borderTop: "1px solid #2A2A35" }}>
              <b>{subj}</b><span style={{ textAlign: "center" }}>{v.topics}</span><span style={{ textAlign: "center" }}>{v.scaffolded}</span><span style={{ textAlign: "center" }}>{v.qs}</span><span style={{ textAlign: "center", color: "#FBBF24" }}>{v.inReview}</span>
            </div>
          ))}
          {Object.keys(bySubject).length === 0 && <div style={{ padding: "16px", color: "#8A8EA6" }}>{stats? `${stats.total} topics live from DB` : "Loading live from DB..."}</div>}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1A1A22", borderTop: "1px solid #2A2A35", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 50 }}>
        <Link href="/dashboard" style={{ textAlign: "center", fontSize: "11px", color: "#8A8EA6", textDecoration: "none" }}>🏠<br/>Dashboard</Link>
        <Link href="/subjects" style={{ textAlign: "center", fontSize: "11px", color: "#8A8EA6", textDecoration: "none" }}>📖<br/>Subjects</Link>
        <Link href="/mock-exams" style={{ textAlign: "center", fontSize: "11px", color: "#8A8EA6", textDecoration: "none" }}>📋<br/>Exams</Link>
        <Link href="/progress" style={{ textAlign: "center", fontSize: "11px", color: "#8A8EA6", textDecoration: "none" }}>📊<br/>Progress</Link>
        <Link href="/profile" style={{ textAlign: "center", fontSize: "11px", color: "#8A8EA6", textDecoration: "none" }}>👤<br/>Profile</Link>
      </div>
    </div>
  );
}
