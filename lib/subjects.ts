export const SUBJECTS_DATA:any = {
  mathematics: {
    id: "mathematics", name: "Mathematics", desc: "CAPS-aligned exam practice, worked solutions and progress tracking.",
    sections: [{ title: "Mathematics", units: [
      { id: "number-patterns", unit: "UNIT 1", title: "Number Patterns, Sequences and Series", topics: [
        { id: "arithmetic-sequences", title: "Arithmetic Sequences", youtubeId: "kQ0i8s3q6dM" },
        { id: "geometric-sequences", title: "Geometric Sequences", youtubeId: "I5akUQpFO4k" },
        { id: "sigma-notation", title: "Sigma Notation", youtubeId: "0P5i9y0x3eA" },
      ]},
      { id: "functions-inverses", unit: "UNIT 2", title: "Functions and Inverses", topics: [
        { id: "parabola", title: "The Parabola", youtubeId: "a1sD2f3g4hJ" },
        { id: "hyperbola", title: "Hyperbola", youtubeId: "x1eN9y2z4qR" },
        { id: "exponential", title: "Exponential Functions", youtubeId: "b2tG5h6j7kL" },
      ]},
      { id: "calculus", unit: "UNIT 3", title: "Differential Calculus", topics: [
        { id: "first-principles", title: "First Principles", youtubeId: "c3uH6i7j8kL" },
      ]},
    ]}]
  },
  "physical-sciences": {
    id: "physical-sciences", name: "Physical Sciences", desc: "CAPS Grade 12 Physical Sciences — Physics and Chemistry combined.",
    sections: [
      { title: "Physics", units: [
        { id: "mechanics", unit: "UNIT 1", title: "Mechanics", topics: [
          { id: "newtons-first-law", title: "Newtons First Law", youtubeId: "dQw4w9WgXcQ" },
          { id: "newtons-second-law", title: "Newtons Second Law", youtubeId: "dQw4w9WgXcQ" },
          { id: "newtons-third-law", title: "Newtons Third Law", youtubeId: "dQw4w9WgXcQ" },
        ]},
        { id: "momentum", unit: "UNIT 2", title: "Momentum and Impulse", topics: [
          { id: "momentum-def", title: "Momentum Definition", youtubeId: "dQw4w9WgXcQ" },
        ]},
      ]},
      { title: "Chemistry", units: [
        { id: "organic-macromolecules", unit: "UNIT 1", title: "Organic Compounds and Macromolecules", topics: [
          { id: "nomenclature", title: "Nomenclature", youtubeId: "dQw4w9WgXcQ" },
          { id: "isomers", title: "Isomers", youtubeId: "dQw4w9WgXcQ" },
        ]},
      ]}
    ]
  }
};

// DO NOT DELETE — APP NEEDS THESE!
export const subjects = Object.values(SUBJECTS_DATA);
export const getByType = (t:any) => SUBJECTS_DATA.mathematics.sections;
