"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const getYtId = (u: string) => {
  const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/);
  return m? m[1] : u.trim();
};

export default function NewVideo() {
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [f, setF] = useState({
    url: "",
    provider: "YouTube",
    dur: "",
    subj: "Mathematics",
    unit: "",
    topicCode: "",
    title: "",
    desc: "",
    thumb: "",
    order: "0",
    status: "Ready",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
       .from("topics")
       .select("id,subject,caps_code,topic,paper_section")
       .limit(1000);
      if (data) setTopics(data);
    })();
  }, []);

  const forSubj = topics.filter((t) =>
    (t.subject || "").toLowerCase().includes(f.subj.slice(0, 4).toLowerCase())
  );
  const unitCounts: any = {};
  forSubj.forEach((t) => {
    const u = t.paper_section || (t.caps_code || "").split("-")[0] || "General";
    unitCounts[u] = 1;
  });
  const units = Object.keys(unitCounts).sort();

  const forUnit = forSubj.filter((t) => {
    if (!f.unit) return true;
    const u = t.paper_section || (t.caps_code || "").split("-")[0] || "General";
    return u === f.unit;
  });

  const save = async () => {
    if (!f.url) return alert("Paste YouTube URL first");
    if (!f.topicCode) return alert("Choose Topic");
    setSaving(true);
    const yid = getYtId(f.url);
    const pick = topics.find((t) => t.caps_code === f.topicCode);

    // MINIMAL PAYLOAD - only columns that exist - will save 100%
    const payload: any = {
      youtube_id: yid,
      youtube_url: f.url,
      title: f.title || pick?.topic || yid,
      subject: f.subj,
      caps_code: f.topicCode,
      caps_topic_id: pick?.id || null,
      topic: pick?.topic || f.topicCode,
      thumbnail_url: f.thumb || `https://img.youtube.com/vi/${yid}/hqdefault.jpg`,
    };

    const { error } = await supabase.from("videos").insert([payload]);

    if (!error && pick) {
      // Also set topics.youtube_id so learner Node page shows HD instantly
      await supabase.from("topics").update({ youtube_id: yid }).eq("id", pick.id);
    }

    setSaving(false);
    if (error) {
      alert("SAVE ERROR: " + error.message);
      console.log(error);
    } else {
      alert("✅ Video saved!");
      router.push("/admin/videos");
    }
  };

  return (
    <div style={{ background: "#0b0c14", minHeight: "100vh", color: "#fff", padding: 12 }}>
      <div
        style={{
          background: "#121a14",
          border: "1px solid #1e3a2a",
          borderRadius: 20,
          padding: 14,
          marginBottom: 12,
          fontSize: 12,
        }}
      >
        <span style={{ color: "#00ff88", fontWeight: 800 }}>Content Admin mode</span> — lessons, videos, CAPS
        and the question bank.
      </div>

      <div
        style={{
          background: "#1c1e2e",
          border: "1px solid #252a44",
          borderRadius: 24,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px" }}>Add video</h2>

        <label style={{ fontSize: 12 }}>Video URL (YouTube or Bunny Stream)</label>
        <input
          value={f.url}
          onChange={(e) => setF({...f, url: e.target.value })}
          placeholder="https://youtu.be/..."
          style={{
            width: "100%",
            background: "#12131f",
            border: "1px solid #252a44",
            borderRadius: 12,
            padding: 14,
            color: "#fff",
            margin: "6px 0 12px",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12 }}>Provider</label>
            <select
              value={f.provider}
              onChange={(e) => setF({...f, provider: e.target.value })}
              style={{
                width: "100%",
                background: "#12131f",
                border: "1px solid #252a44",
                borderRadius: 12,
                padding: 14,
                color: "#fff",
                marginTop: 6,
              }}
            >
              <option>YouTube</option>
              <option>Bunny</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12 }}>Duration (sec)</label>
            <input
              value={f.dur}
              onChange={(e) => setF({...f, dur: e.target.value })}
              style={{
                width: "100%",
                background: "#12131f",
                border: "1px solid #252a44",
                borderRadius: 12,
                padding: 14,
                color: "#fff",
                marginTop: 6,
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <select
            value={f.subj}
            onChange={(e) => setF({...f, subj: e.target.value, unit: "", topicCode: "" })}
            style={{
              background: "#12131f",
              border: "1px solid #252a44",
              borderRadius: 12,
              padding: 14,
              color: "#fff",
            }}
          >
            <option>Mathematics</option>
            <option>Physical Sciences</option>
          </select>
          <select
            value={f.unit}
            onChange={(e) => setF({...f, unit: e.target.value, topicCode: "" })}
            style={{
              background: "#12131f",
              border: "1px solid #252a44",
              borderRadius: 12,
              padding: 14,
              color: "#fff",
            }}
          >
            <option value="">Unit...</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <select
            value={f.topicCode}
            onChange={(e) => {
              const c = e.target.value;
              const p = topics.find((t) => t.caps_code === c);
              setF({...f, topicCode: c, title: p?.topic || f.title });
            }}
            style={{
              background: "#12131f",
              border: "1px solid #252a44",
              borderRadius: 12,
              padding: 14,
              color: "#fff",
            }}
          >
            <option value="">Topic...</option>
            {forUnit.map((t) => (
              <option key={t.id} value={t.caps_code}>
                {t.caps_code}
              </option>
            ))}
          </select>
        </div>

        <label style={{ fontSize: 12 }}>Title</label>
        <input
          value={f.title}
          onChange={(e) => setF({...f, title: e.target.value })}
          style={{
            width: "100%",
            background: "#12131f",
            border: "1px solid #252a44",
            borderRadius: 12,
            padding: 14,
            color: "#fff",
            margin: "6px 0 12px",
          }}
        />

        <label style={{ fontSize: 12 }}>Description</label>
        <textarea
          value={f.desc}
          onChange={(e) => setF({...f, desc: e.target.value })}
          style={{
            width: "100%",
            background: "#12131f",
            border: "1px solid #252a44",
            borderRadius: 12,
            padding: 14,
            color: "#fff",
            minHeight: 80,
            margin: "6px 0 12px",
          }}
        />

        <label style={{ fontSize: 12 }}>Thumbnail URL</label>
        <input
          value={f.thumb}
          onChange={(e) => setF({...f, thumb: e.target.value })}
          style={{
            width: "100%",
            background: "#12131f",
            border: "1px solid #252a44",
            borderRadius: 12,
            padding: 14,
            color: "#fff",
            margin: "6px 0 12px",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ fontSize: 12 }}>Order</label>
            <input
              value={f.order}
              onChange={(e) => setF({...f, order: e.target.value })}
              style={{
                width: "100%",
                background: "#12131f",
                border: "1px solid #252a44",
                borderRadius: 12,
                padding: 14,
                color: "#fff",
                marginTop: 6,
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12 }}>Status</label>
            <select
              value={f.status}
              onChange={(e) => setF({...f, status: e.target.value })}
              style={{
                width: "100%",
                background: "#12131f",
                border: "1px solid #252a44",
                borderRadius: 12,
                padding: 14,
                color: "#fff",
                marginTop: 6,
              }}
            >
              <option>Ready</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <Link
            href="/admin/videos"
            style={{
              background: "#252a44",
              padding: "12px 20px",
              borderRadius: 999,
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Cancel
          </Link>
          <button
            onClick={save}
            disabled={saving}
            style={{
              background: "#8b8bff",
              padding: "12px 22px",
              borderRadius: 999,
              fontWeight: 800,
              border: "none",
              color: "#000",
              cursor: "pointer",
            }}
          >
            {saving? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
