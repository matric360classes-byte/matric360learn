export const SUBJECTS_DATA: any = {
  "physical-sciences": {
    name: "Physical Sciences",
    desc: "CAPS Grade 12",
    sections: [
      {
        title: "Physics",
        units: [
          {
            id: "mechanics", title: "Mechanics", unit: "UNIT 1", progress: 100, topicsCount: 5,
            topics: [
              { id: "newtons-first-law", title: "Newton's First Law", video: true, practice: true, exam: true, completed: true, youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
              { id: "newtons-second-law", title: "Newton's Second Law", video: true, practice: true, exam: true, completed: true },
              { id: "newtons-third-law", title: "Newton's Third Law", video: true, practice: true, exam: true, completed: true },
              { id: "friction-inclined", title: "Friction and Inclined Planes", video: false, practice: true, exam: true, completed: true },
              { id: "connected-bodies", title: "Connected Bodies", video: false, practice: true, exam: true, completed: true },
            ]
          },
          { id: "momentum-impulse", title: "Momentum and Impulse", unit: "UNIT 2", progress: 100, topicsCount: 5, topics: [] },
          { id: "vertical-projectile", title: "Vertical Projectile Motion", unit: "UNIT 3", progress: 100, topicsCount: 4, topics: [] },
          { id: "work-energy-power", title: "Work Energy and Power", unit: "UNIT 4", progress: 100, topicsCount: 5, topics: [] },
          { id: "doppler-effect", title: "Doppler Effect", unit: "UNIT 5", progress: 100, topicsCount: 4, topics: [] },
          { id: "electrostatics", title: "Electrostatics", unit: "UNIT 6", progress: 100, topicsCount: 5, topics: [] },
          { id: "electric-circuits", title: "Electric Circuits", unit: "UNIT 7", progress: 100, topicsCount: 3, topics: [] },
          { id: "electrodynamics", title: "Electrodynamics", unit: "UNIT 8", progress: 100, topicsCount: 3, topics: [] },
          { id: "optical-phenomena", title: "Optical Phenomena", unit: "UNIT 9", progress: 100, topicsCount: 3, topics: [] },
          { id: "emission-absorption", title: "Emission and Absorption Spectra", unit: "UNIT 10", progress: 100, topicsCount: 4, topics: [] },
        ]
      },
      {
        title: "Chemistry",
        units: [
          { id: "organic-compounds", title: "Organic Compounds and Macromolecules", unit: "UNIT 1", progress: 100, topicsCount: 8, topics: [] },
          { id: "rate-extent", title: "Rate and Extent of Reactions", unit: "UNIT 2", progress: 100, topicsCount: 4, topics: [] },
          { id: "chemical-equilibrium", title: "Chemical Equilibrium", unit: "UNIT 3", progress: 100, topicsCount: 4, topics: [] },
          { id: "acids-bases", title: "Acids and Bases", unit: "UNIT 4", progress: 100, topicsCount: 3, topics: [] },
          { id: "electrochemistry", title: "Electrochemistry", unit: "UNIT 5", progress: 100, topicsCount: 4, topics: [] },
          { id: "chlor-alkali", title: "Chlor-Alkali Industry", unit: "UNIT 6", progress: 100, topicsCount: 1, topics: [] },
        ]
      }
    ]
  },
  "mathematics": {
    name: "Mathematics",
    desc: "CAPS Grade 12",
    sections: [
      {
        title: "Mathematics",
        units: [
          {
            id: "number-patterns", title: "Number Patterns, Sequences and Series", unit: "UNIT 1", progress: 100, topicsCount: 5,
            topics: [
              { id: "arithmetic-sequences", title: "Arithmetic Sequences", video: true, completed: true },
              { id: "geometric-sequences", title: "Geometric Sequences", video: true, completed: true },
              { id: "sigma-notation", title: "Sigma Notation", video: true, completed: true },
              { id: "series-sums", title: "Series and Sums", video: false, completed: true },
              { id: "convergent-series", title: "Convergent Series", video: true, completed: true },
            ]
          },
          { id: "functions-inverses", title: "Functions and Inverses", unit: "UNIT 2", progress: 100, topicsCount: 5, topics: [] },
          { id: "exponential-log", title: "Exponential and Logarithmic Functions", unit: "UNIT 3", progress: 100, topicsCount: 5, topics: [] },
          { id: "finance", title: "Finance, Growth and Decay", unit: "UNIT 4", progress: 100, topicsCount: 5, topics: [] },
          { id: "differential-calculus", title: "Differential Calculus", unit: "UNIT 5", progress: 100, topicsCount: 5, topics: [] },
        ]
      }
    ]
  }
};

// Helper to find unit
export function findUnit(subjectId: string, unitId: string){
  const subj = SUBJECTS_DATA[subjectId];
  if(!subj) return null;
  for(const sec of subj.sections){
    for(const u of sec.units){
      if(u.id === unitId) return u;
    }
  }
  return null;
}
export function findTopic(subjectId: string, unitId: string, topicId: string){
  const unit = findUnit(subjectId, unitId);
  if(!unit ||!unit.topics) return null;
  return unit.topics.find((t:any)=>t.id===topicId) || null;
}
