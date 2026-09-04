import { LESSONS, SUBJECTS } from "@/lib/lessons";
import Link from "next/link";

export default function SubjectDetail({ params }: { params: { subjectId: string } }) {
  const subject = SUBJECTS.find(s => s.id === params.subjectId);
  const lessons = LESSONS.filter(l => l.subjectId === params.subjectId);
  
  // Group by unit
  const units: Record<string, typeof lessons> = {};
  lessons.forEach(l => {
    if (!units[l.unitTitle]) units[l.unitTitle] = [];
    units[l.unitTitle].push(l);
  });

  if (!subject) return <div className="p-6">Subject not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/subjects" className="text-blue-600 mb-4 inline-block">← Back to Subjects</Link>
      <h1 className="text-3xl font-bold">{subject.name}</h1>
      <p className="text-gray-600 mb-6">{lessons.length} topics • Grade 12 CAPS</p>

      <div className="space-y-8">
        {Object.entries(units).map(([unitTitle, unitLessons]) => (
          <div key={unitTitle} className="border rounded-xl p-4 bg-white">
            <h2 className="font-bold text-lg mb-3">{unitLessons[0].unit} - {unitTitle}</h2>
            <div className="space-y-2">
              {unitLessons.map(l => (
                <Link key={l.id} href={`/watch/${l.id}`} className="flex justify-between p-3 rounded hover:bg-gray-50 border">
                  <span>{l.title}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{l.status}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
