export const SUBJECTS_DATA:any = {
  mathematics: {
    id: "mathematics", name: "Mathematics", desc: "Pure Maths - Patterns, Algebra, Calculus & more",
    sections: [
      { title: "Algebra & Patterns", units: [
        { id: "number-patterns", unit: "UNIT 1", title: "Number Patterns, Sequences and Series", progress: 100, topics: [
          { id: "arithmetic-sequences", title: "Arithmetic Sequences" },
          { id: "geometric-sequences", title: "Geometric Sequences" },
          { id: "sigma-notation", title: "Sigma Notation" },
          { id: "series-and-sums", title: "Series and Sums" },
          { id: "convergent-series", title: "Convergent Series" },
        ]},
        { id: "functions", unit: "UNIT 2", title: "Functions", progress: 100, topics: [
          { id: "parabola", title: "Parabola" },
          { id: "hyperbola", title: "Hyperbola" },
          { id: "exponential", title: "Exponential Functions" },
          { id: "logarithms", title: "Logarithms" },
        ]},
        { id: "finance", unit: "UNIT 3", title: "Finance, Growth and Decay", progress: 100, topics: [
          { id: "simple-interest", title: "Simple & Compound Interest" },
          { id: "annuities", title: "Annuities" },
        ]},
      ]},
      { title: "Calculus", units: [
        { id: "differential-calculus", unit: "UNIT 4", title: "Differential Calculus", progress: 100, topics: [
          { id: "first-principles", title: "First Principles" },
          { id: "rules", title: "Differentiation Rules" },
          { id: "tangents", title: "Tangents and Normals" },
        ]},
      ]},
    ]
  },
  "physical-sciences": {
    id: "physical-sciences", name: "Physical Sciences", desc: "Physics + Chemistry",
    sections: [
      { title: "Mechanics", units: [
        { id: "mechanics", unit: "UNIT 1", title: "Mechanics", progress: 100, topics: [
          { id: "newtons-first-law", title: "Newton's First Law" },
          { id: "newtons-second-law", title: "Newton's Second Law" },
          { id: "newtons-third-law", title: "Newton's Third Law" },
          { id: "free-body", title: "Free Body Diagrams" },
          { id: "friction", title: "Friction" },
        ]},
        { id: "momentum", unit: "UNIT 2", title: "Momentum and Impulse", progress: 100, topics: [
          { id: "momentum-def", title: "Momentum" },
          { id: "impulse", title: "Impulse" },
          { id: "conservation", title: "Conservation of Momentum" },
        ]},
        { id: "projectile", unit: "UNIT 3", title: "Vertical Projectile Motion", progress: 100, topics: [
          { id: "free-fall", title: "Free Fall" },
          { id: "equations", title: "Equations of Motion" },
        ]},
      ]},
      { title: "Chemistry", units: [
        { id: "matter", unit: "UNIT 4", title: "Matter and Materials", progress: 100, topics: [
          { id: "intermolecular", title: "Intermolecular Forces" },
        ]},
      ]},
    ]
  }
};
