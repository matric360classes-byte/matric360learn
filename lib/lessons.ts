export type LessonStatus = "draft" | "published" | "review";

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  unit: string;
  chapter: string;
  duration: string;
  status: LessonStatus;
  videoUrl?: string;
}

export const LESSONS: Lesson[] = [
  // MATHEMATICS - Paper 1 & 2 (CAPS Grade 12)
  { id: "math-algebra-1", subjectId: "math", title: "Algebra - Equations & Inequalities", unit: "Algebra", chapter: "Paper 1", duration: "18 min", status: "draft" },
  { id: "math-exponents", subjectId: "math", title: "Exponents and Surds", unit: "Algebra", chapter: "Paper 1", duration: "15 min", status: "draft" },
  { id: "math-number-patterns", subjectId: "math", title: "Number Patterns - Arithmetic & Geometric", unit: "Patterns", chapter: "Paper 1", duration: "22 min", status: "draft" },
  { id: "math-functions", subjectId: "math", title: "Functions - Parabola, Hyperbola, Exponential", unit: "Functions", chapter: "Paper 1", duration: "25 min", status: "draft" },
  { id: "math-finance", subjectId: "math", title: "Finance, Growth & Decay", unit: "Finance", chapter: "Paper 1", duration: "20 min", status: "draft" },
  { id: "math-calculus-diff", subjectId: "math", title: "Differential Calculus - First Principles", unit: "Calculus", chapter: "Paper 1", duration: "24 min", status: "draft" },
  { id: "math-calculus-opt", subjectId: "math", title: "Calculus Optimization & Rate of Change", unit: "Calculus", chapter: "Paper 1", duration: "21 min", status: "draft" },
  { id: "math-probability", subjectId: "math", title: "Probability & Counting Principles", unit: "Stats", chapter: "Paper 1", duration: "19 min", status: "draft" },
  
  // Trigonometry
  { id: "math-trig-compound", subjectId: "math", title: "Trigonometry - Compound Angles", unit: "Trigonometry", chapter: "Paper 2", duration: "23 min", status: "draft" },
  { id: "math-trig-general", subjectId: "math", title: "Trig Equations - General Solution", unit: "Trigonometry", chapter: "Paper 2", duration: "18 min", status: "draft" },
  { id: "math-trig-2d3d", subjectId: "math", title: "2D & 3D Trigonometry", unit: "Trigonometry", chapter: "Paper 2", duration: "20 min", status: "draft" },
  
  // Geometry & Stats
  { id: "math-analytical", subjectId: "math", title: "Analytical Geometry - Circle, Line", unit: "Geometry", chapter: "Paper 2", duration: "22 min", status: "draft" },
  { id: "math-euclidean", subjectId: "math", title: "Euclidean Geometry - Circle Theorems", unit: "Geometry", chapter: "Paper 2", duration: "26 min", status: "draft" },
  { id: "math-stats", subjectId: "math", title: "Statistics - Regression & Variance", unit: "Stats", chapter: "Paper 2", duration: "17 min", status: "draft" },

  // PHYSICAL SCIENCES
  { id: "ps-vectors", subjectId: "physical-sciences", title: "Vectors in 2D", unit: "Mechanics", chapter: "Physics", duration: "16 min", status: "draft" },
  { id: "ps-newton", subjectId: "physical-sciences", title: "Newton's Laws & Force Diagrams", unit: "Mechanics", chapter: "Physics", duration: "21 min", status: "draft" },
  { id: "ps-energy", subjectId: "physical-sciences", title: "Work, Energy & Power", unit: "Mechanics", chapter: "Physics", duration: "19 min", status: "draft" },
  { id: "ps-momentum", subjectId: "physical-sciences", title: "Momentum & Impulse", unit: "Mechanics", chapter: "Physics", duration: "18 min", status: "draft" },
  { id: "ps-organic-naming", subjectId: "physical-sciences", title: "Organic Nomenclature", unit: "Organic", chapter: "Chemistry", duration: "20 min", status: "draft" },
  { id: "ps-organic-reactions", subjectId: "physical-sciences", title: "Organic Reactions & Properties", unit: "Organic", chapter: "Chemistry", duration: "22 min", status: "draft" },
  { id: "ps-circuits", subjectId: "physical-sciences", title: "Electric Circuits - Internal Resistance", unit: "Electricity", chapter: "Physics", duration: "24 min", status: "draft" },
  { id: "ps-electrochem", subjectId: "physical-sciences", title: "Electrochemistry - Galvanic Cells", unit: "Chemical Change", chapter: "Chemistry", duration: "20 min", status: "draft" },
];

export const LESSONS_DATA = LESSONS.reduce((acc, l) => { acc[l.id] = l; return acc; }, {} as Record<string, Lesson>);
export const getLesson = (id: string) => LESSONS.find(l => l.id === id) || null;
export default LESSONS_DATA;
