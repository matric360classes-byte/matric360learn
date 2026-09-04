export type LessonStatus = "draft" | "published" | "review";
export interface Lesson {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  unit: string;
  unitTitle: string;
  status: LessonStatus;
}

export const LESSONS: Lesson[] = [
  { id: "math-algebra-1", subjectId: "math", subjectName: "Mathematics", title: "Algebra - Equations", unit: "1", unitTitle: "Algebra", status: "draft" },
  { id: "math-functions-1", subjectId: "math", subjectName: "Mathematics", title: "Functions - Parabola", unit: "2", unitTitle: "Functions", status: "draft" },
  { id: "ps-vectors", subjectId: "physical-sciences", subjectName: "Physical Sciences", title: "Vectors in 2D", unit: "1", unitTitle: "Mechanics", status: "draft" },
];

export const SUBJECTS = [
  { id: "math", name: "Mathematics" },
  { id: "physical-sciences", name: "Physical Sciences" },
];

export const LESSONS_DATA = LESSONS.reduce((a:any,c)=>{a[c.id]=c; return a;},{});
export const getLesson = (id:string)=> LESSONS.find(l=>l.id===id) || null;
export default LESSONS_DATA;
