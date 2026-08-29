import { SUBJECTS_DATA } from "@/lib/subjects";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function SubjectPage({ params }: { params: { id: string } }) {
  const subject = SUBJECTS_DATA[params.id];
  if (!subject) return notFound();

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <Link href="/">← Home</Link>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginTop: 20 }}>{subject.name}</h1>
      <p>{subject.desc}</p>
      {subject.sections.map((sec: any, i: number) => (
        <div key={i} style={{ marginTop: 20 }}>
          <h2 style={{ fontWeight: "bold", background: "#eee", padding: 8 }}>{sec.title}</h2>
          {sec.units.map((u: any) => (
            <div key={u.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10, borderRadius: 8 }}>
              <Link href={`/subjects/${params.id}/${u.id}`} style={{ color: "blue", fontWeight: "bold" }}>
                {u.title} →
              </Link>
              <p style={{ fontSize: 12 }}>{u.progress}% • {u.topics.length} topics</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
