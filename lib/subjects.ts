export const SUBJECTS_DATA:any = {
  mathematics: {
    id: "mathematics", name: "Mathematics", desc: "CAPS-aligned",
    sections: [{ title: "Mathematics", units: [
      { id: "number-patterns", unit: "UNIT 1", title: "Number Patterns, Sequences and Series", topics: [{ id: "arithmetic-sequences", title: "Arithmetic Sequences", youtubeId: "kQ0i8s3q6dM" },{ id: "geometric-sequences", title: "Geometric Sequences", youtubeId: "kQ0i8s3q6dM" },{ id: "quadratic-sequences", title: "Quadratic Sequences", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "functions-inverses", unit: "UNIT 2", title: "Functions and Inverses", topics: [{ id: "parabola", title: "The Parabola", youtubeId: "kQ0i8s3q6dM" },{ id: "hyperbola", title: "Hyperbola", youtubeId: "kQ0i8s3q6dM" },{ id: "exponential", title: "Exponential Functions", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "exponential-log", unit: "UNIT 3", title: "Exponential and Logarithmic Functions", topics: [{ id: "log-laws", title: "Log Laws", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "finance-growth", unit: "UNIT 4", title: "Finance and Growth", topics: [{ id: "simple-interest", title: "Simple and Compound Interest", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "trigonometry", unit: "UNIT 5", title: "Trigonometry", topics: [{ id: "trig-identities", title: "Trig Identities", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "analytical-geometry", unit: "UNIT 6", title: "Analytical Geometry", topics: [{ id: "distance-formula", title: "Distance Formula", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "euclidean-geometry", unit: "UNIT 7", title: "Euclidean Geometry", topics: [{ id: "circle-theorems", title: "Circle Theorems", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "statistics", unit: "UNIT 8", title: "Statistics", topics: [{ id: "mean-median", title: "Mean Median Mode", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "probability", unit: "UNIT 9", title: "Probability", topics: [{ id: "basic-probability", title: "Basic Probability", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "differential-calculus", unit: "UNIT 10", title: "Differential Calculus", topics: [{ id: "first-principles", title: "First Principles", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "linear-programming", unit: "UNIT 11", title: "Linear Programming", topics: [{ id: "feasible-region", title: "Feasible Region", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "transformations", unit: "UNIT 12", title: "Transformations", topics: [{ id: "translations", title: "Translations", youtubeId: "kQ0i8s3q6dM" }]},
      { id: "sequences-series", unit: "UNIT 13", title: "Sequences and Series", topics: [{ id: "sigma-notation", title: "Sigma Notation", youtubeId: "kQ0i8s3q6dM" }]},
    ]}]
  },
  "physical-sciences": {
    id: "physical-sciences", name: "Physical Sciences", desc: "Physics and Chemistry",
    sections: [
      { title: "Physics", units: [
        { id: "mechanics", unit: "UNIT 1", title: "Mechanics", topics: [{ id: "vectors-scalars", title: "Vectors and Scalars", youtubeId: "dQw4w9WgXcQ" },{ id: "newtons-first-law", title: "Newtons First Law", youtubeId: "dQw4w9WgXcQ" },{ id: "newtons-second-law", title: "Newtons Second Law", youtubeId: "dQw4w9WgXcQ" }]},
        { id: "waves-sound-light", unit: "UNIT 2", title: "Waves Sound and Light", topics: [{ id: "doppler-effect", title: "Doppler Effect", youtubeId: "dQw4w9WgXcQ" }]},
        { id: "electricity-magnetism", unit: "UNIT 3", title: "Electricity and Magnetism", topics: [{ id: "ohms-law", title: "Ohms Law", youtubeId: "dQw4w9WgXcQ" }]},
      ]},
      { title: "Chemistry", units: [
        { id: "matter-materials", unit: "UNIT 1", title: "Matter and Materials", topics: [{ id: "atomic-structure", title: "Atomic Structure", youtubeId: "dQw4w9WgXcQ" }]},
        { id: "chemical-bonding", unit: "UNIT 2", title: "Chemical Bonding", topics: [{ id: "covalent-bonds", title: "Covalent Bonds", youtubeId: "dQw4w9WgXcQ" }]},
        { id: "organic-macromolecules", unit: "UNIT 3", title: "Organic Compounds and Macromolecules", topics: [{ id: "nomenclature", title: "Nomenclature", youtubeId: "dQw4w9WgXcQ" },{ id: "isomers", title: "Isomers", youtubeId: "dQw4w9WgXcQ" }]},
      ]}
    ]
  }
};
export const subjects = Object.values(SUBJECTS_DATA);
export const getByType = (t:any) => [];
