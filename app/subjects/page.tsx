import { SUBJECTS, LESSONS } from "@/lib/lessons";
import Link from "next/link";

export default function SubjectsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Choose Subject - Matric 360</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SUBJECTS.map((s) => {
          const count = LESSONS.filter(l => l.subjectId === s.id).length;
          return (
            <Link key={s.id} href={`/subjects/${s.id}`} className="border rounded-xl p-6 hover:shadow-lg transition bg-white">
              <h2 className="text-xl font-bold">{s.name}</h2>
              <p className="text-gray-600 mt-2">{count} topics • CAPS Mind the Gap</p>
              <span className="text-blue-600 mt-4 inline-block">Open →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
