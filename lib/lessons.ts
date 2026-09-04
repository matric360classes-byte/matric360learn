import { SUBJECTS_DATA } from "./subjects";

export type LessonStatus = "draft" | "published" | "review";

export interface Lesson {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  unit: string;
  unitTitle: string;
  youtubeId?: string;
  status: LessonStatus;
}

// Flatten SUBJECTS_DATA (your 123-line file) into 100+ lessons
function flattenLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  try {
    const subjects = SUBJECTS_DATA as any;
    for (const subjectKey of Object.keys(subjects)) {
      const subject = subjects[subjectKey];
      const subjectName = subject.name || subjectKey;
      const sections = subject.sections || [];
      for (const section of sections) {
        const unit = section.unit || "";
        const unitTitle = section.title || "";
        const topics = section.topics || [];
        for (const topic of topics) {
          lessons.push({
            id: topic.id,
            subjectId: subject.id || subjectKey,
            subjectName,
            title: topic.title,
            unit,
            unitTitle,
            youtubeId: topic.youtubeId || "",
            status: "draft",
          });
        }
      }
    }
  } catch (e) {
    console.error("flatten error", e);
  }
  return lessons;
}

export const LESSONS: Lesson[] = flattenLessons();
export const LESSONS_DATA = LESSONS.reduce((acc, l) => { acc[l.id] = l; return acc; }, {} as Record<string, Lesson>);
export const getLesson = (id: string) => LESSONS.find(l => l.id === id) || null;

// Fallback for old SUBJECTS import
export const SUBJECTS = Object.values(SUBJECTS_DATA as any).map((s: any) => ({
  id: s.id,
  name: s.name,
  desc: s.desc,
}));

export default LESSONS_DATA;
