import { subjects } from "@/lib/subjects";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function SubjectPage({ params }: { params: { id: string } }) {
  const subject = subjects.find((s) => s.id === params.id);
  if (!subject) return notFound();
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <Link href="/">← Home</Link>
      <h1 style={{ fontSize: 32, fontWeight: "bold", marginTop: 20 }}>{subject.name}</h1>
      <p>Category: {subject.category} • {subject.progress}%</p>
      <h2 style={{ marginTop: 20, fontSize: 20, fontWeight: "bold" }}>Units:</h2>
      {subject.units.map((u) => (
        <div key={u.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10, borderRadius: 8 }}>
          <Link href={`/subjects/${subject.id}/${u.id}`} style={{ color: "blue", fontWeight: "bold" }}>{u.name} →</Link>
          <p style={{ fontSize: 12 }}>{u.topics.length} topics</p>
        </div>
      ))}
    </div>
  );
}
