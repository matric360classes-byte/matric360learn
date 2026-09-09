"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcmkhe.supabase.co",
  "sb_secret_UlK_LoRsi6zy2EKFfqbwTg_7KnAqq9w"
);

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [bySubject, setBySubject] = useState<any>({});

  useEffect(() => {
    (async () => {
      const { count: total } = await supabase.from("topic_knowledge").select("id", { count: "exact", head: true });
      const { data: topics } = await supabase.from("topic_knowledge").select("*");
      const { data: lessons } = await supabase.from("lesson_previews").select("topic_id");
      const { data: questions } = await supabase.from("questions").select("topic_id");

      const qMap: any = {};
      questions?.forEach((q: any) => { qMap[q.topic_id] = (qMap[q.topic_id] || 0) + 1; });
      const lessonSet = new Set(lessons?.map((l: any) => l.topic_id));

      // LIVE calculations only
      const missingMeta = topics?.filter((t: any) =>!t.caps_code ||!t.subject).length || 0;
      const missingNodes = topics?.filter((t: any) =>!lessonSet.has(t.id)).length || 0;
      const lessThan3 = topics?.filter((t: any) => (qMap[t.id] || 0) < 3).length || 0;
      const missingPaper = topics?.filter((t: any) =>!t.paper &&!t.section).length || 0;
      const published = topics?.filter((t: any) => t.status === 'published' || t.is_published === true).length || 0;

      // LIVE by subject grouping
      const grouped: any = {};
      topics?.forEach((t: any) => {
        const subj = t.subject || t.caps_code?.split(' ')[0] || 'Unassigned';
        if (!grouped[subj]) grouped[subj] = { topics: 0, scaffolded: 0, qs: 0, inReview: 0 };
        grouped[subj].topics++;
        if (lessonSet.has(t.id)) grouped[subj].scaffolded++;
        if ((qMap[t.id] || 0) >= 3) grouped[subj].qs++;
        if (t.status === 'in_review') grouped[subj].inReview++;
      });

      setStats({
        total: total || 0,
        published,
        inReview: topics?.filter((t: any) => t.status === 'in_review').length || 0,
        drafts: topics?.filter((t: any) => t.status === 'draft').length || 0,
        needsChanges: topics?.filter((t: any) => t.status === 'needs_changes').length || 0,
        missingMeta,
        missingNodes,
        lessThan3,
        missingPaper
      });
      setBySubject(grouped);
    })();
  }, []);

  const Card = ({ label, value, icon }: any) => (
    <div style={{ background: "#1A1D29", borderRadius: "24px", padding: "18px", border: "1px solid #252836" }}>
      <div>{icon}</div>
      <div style={{ color: "#8A8EA6", fontSize: "13px", marginTop: "8px" }}>{label}</div>
      <div style={{ fontSize: "32px", fontWeight: "800", marginTop: "6px" }}>{stats? value : "..."}</div>
    </div>
  );

  return (
    <div style={{ background: "#0F111A", minHeight: "100vh", color: "white", paddingBottom: "90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #1A1D29" }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#1A1D29", border: "1px solid #252836", color: "white" }}>☰</button>
        <b>Matric360</b>
        <span style={{ fontSize: "12px", color: "#22C55E" }}>Online</span>
      </div>

      {menuOpen? (
        <div style={{ margin: "16px", background: "#1A1D29", borderRadius: "20px", padding: "16px", border: "1px solid #252836" }}>
          <div style={{ background: "#151A23", borderRadius: "16px", padding: "12px", marginBottom: "16px" }}><b style={{ color: "#22C55E" }}>Content Admin mode</b> — lessons, videos, CAPS and question bank.</div>
          <div>⊞ Dashboard</div>
          <div style={{ marginTop: "12px", fontWeight: "700" }}>📄 Content</div>
          <div style={{ marginLeft: "12px", borderLeft: "1px solid #252836", paddingLeft: "12px", color: "#8A8EA6", lineHeight: "2" }}>Lesson Manager<br/>Live Lessons<br/>Review Lessons<br/>Content Health<br/>Content Cleanup</div>
          <div style={{ marginTop: "12px", fontWeight: "700" }}>🛠️ Generation Tools</div>
          <div style={{ marginLeft: "12px", marginTop: "8px" }}>
            <div style={{ background: "#7C7CFF", color: "black", borderRadius: "20px", padding: "6px 14px", display: "inline-block", fontWeight: "700" }}>Factory</div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "16px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>CAPS Content Factory</h1>
          <p style={{ color: "#8A8EA6", fontSize: "13px" }}>Command center for Grade 12 curriculum production.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
            <Card label="Total topics" value={stats?.total} icon="📘" />
            <Card label="Published" value={stats?.published} icon="✅" />
            <Card label="In review" value={stats?.inReview} icon="🕐" />
            <Card label="Drafts" value={stats?.drafts} icon="☰" />
            <Card label="Needs changes" value={stats?.needsChanges} icon="⚠️" />
            <Card label="Missing CAPS meta" value={stats?.missingMeta} icon="✨" />
          </div>

          <h3 style={{ marginTop: "24px" }}>Missing content</h3>
          <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
            <div style={{ background: "#1A1D29", borderRadius: "20px", padding: "16px", border: "1px solid #252836" }}><div style={{ color: "#8A8EA6", fontSize: "13px" }}>Topics missing nodes A-E</div><div style={{ color: "#EF4444", fontSize: "28px", fontWeight: "800" }}>{stats?.missingNodes?? "..."}</div></div>
            <div style={{ background: "#1A1D29", borderRadius: "20px", padding: "16px", border: "1px solid #252836" }}><div style={{ color: "#8A8EA6", fontSize: "13px" }}>Topics with &lt;3 questions</div><div style={{ color: "#EF4444", fontSize: "28px", fontWeight: "800" }}>{stats?.lessThan3?? "..."}</div></div>
            <div style={{ background: "#1A1D29", borderRadius: "20px", padding: "16px", border: "1px solid #252836" }}><div style={{ color: "#8A8EA6", fontSize: "13px" }}>Topics missing paper/section</div><div style={{ color: "#EF4444", fontSize: "28px", fontWeight: "800" }}>{stats?.missingPaper?? "..."}</div></div>
          </div>

          <h3 style={{ marginTop: "24px" }}>Completion by subject</h3>
          <div style={{ background: "#1A1D29", borderRadius: "20px", border: "1px solid #252836", marginTop: "12px" }}>
            {Object.keys(bySubject).length === 0 && <div style={{ padding: "16px", color: "#8A8EA6" }}>{stats? `${stats.total} topics live` : "Loading..."}</div>}
            {Object.entries(bySubject).map(([subj, v]: any) => (
              <div key={subj} style={{ display: "grid", gridTemplateColumns: "1.5fr 0.7fr 0.7fr 0.6fr", padding: "14px 16px", borderTop: "1px solid #252836", fontSize: "14px" }}>
                <b>{subj}</b><span style={{ textAlign: "center" }}>{v.topics}</span><span style={{ textAlign: "center" }}>{v.scaffolded}</span><span style={{ textAlign: "center" }}>{v.qs}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
