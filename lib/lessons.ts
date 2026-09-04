import { SUBJECTS_DATA } from "./subjects";

export type LessonStatus = "draft" | "published" | "review";

export interface Lesson {
  id: string;
  subjectId: string;
  subjectName: string;
  sectionTitle: string;
  unit: string;
  unitId: string;
  unitTitle: string;
  title: string;
  youtubeId: string;
  status: LessonStatus;
}

function flattenLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  try {
    const subjects = Object.values(SUBJECTS_DATA as any);
    for (const subj of subjects) {
      const sections = subj.sections || [];
      for (const sec of sections) {
        const units = sec.units || [];
        for (const u of units) {
          const topics = u.topics || [];
          for (const t of topics) {
            lessons.push({
              id: t.id,
              subjectId: subj.id,
              subjectName: subj.name,
              sectionTitle: sec.title || "",
              unit: u.unit || "",
              unitId: u.id || "",
              unitTitle: u.title || "",
              title: t.title || "",
              youtubeId: t.youtubeId || "",
              status: "draft",
            });
          }
        }
      }
    }
  } catch (e) {
    console.error("flatten error", e);
  }
  return lessons;
}

export const LESSONS: Lesson[] = flattenLessons();
export const SUBJECTS = Object.values(SUBJECTS_DATA as any).map((s: any) => ({
  id: s.id,
  name: s.name,
  desc: s.desc,
}));

export const LESSONS_DATA = LESSONS.reduce((acc: any, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {} as Record<string, Lesson>);

export const getLesson = (id: string) => LESSONS.find(l => l.id === id) || null;
export default LESSONS_DATA;
