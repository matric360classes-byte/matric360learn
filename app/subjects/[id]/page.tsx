import { SUBJECTS_DATA } from "@/lib/subjects";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const subject = (SUBJECTS_DATA as any)[params.id];
  if (!subject) return notFound();
  return (
    <div style={{ padding: 20 }}>
      <Link href="/">← Back</Link>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginTop: 10 }}>{subject.name}</h1>
      <p>{subject.desc}</p>
      {subject.sections.map((s: any, i: number) => (
        <div key={i} style={{ marginTop: 20 }}>
          <h2 style={{ background: "#222", color: "#fff", padding: 8 }}>{s.title}</h2>
          {s.units.map((u: any) => (
            <Link key={u.id} href={`/subjects/${params.id}/${u.id}`} style={{ display: "block", border: "1px solid #ccc", padding: 10, marginTop: 8, borderRadius: 8 }}>
              {u.title} →
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
