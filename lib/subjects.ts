export const SUBJECTS_DATA:any = {
  mathematics: {
    id: "mathematics", name: "Mathematics", desc: "Pure Maths - 13 Units CAPS",
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
          { id: "exponential", title: "Exponential & Log" },
          { id: "inverse", title: "Inverse Functions" },
        ]},
        { id: "finance", unit: "UNIT 3", title: "Finance, Growth and Decay", progress: 100, topics: [
          { id: "interest", title: "Simple & Compound Interest" },
          { id: "annuities", title: "Annuities" },
          { id: "decay", title: "Growth & Decay" },
        ]},
        { id: "algebra", unit: "UNIT 4", title: "Algebra", progress: 100, topics: [
          { id: "equations", title: "Equations & Inequalities" },
          { id: "nature-of-roots", title: "Nature of Roots" },
        ]},
      ]},
      { title: "Calculus & Geometry", units: [
        { id: "differential-calculus", unit: "UNIT 5", title: "Differential Calculus", progress: 100, topics: [
          { id: "first-principles", title: "First Principles" },
          { id: "rules", title: "Differentiation Rules" },
          { id: "tangents", title: "Tangents & Rates" },
        ]},
        { id: "analytical-geometry", unit: "UNIT 6", title: "Analytical Geometry", progress: 100, topics: [{ id: "circle", title: "Circle & Line" }, { id: "distance", title: "Distance & Midpoint" }]},
        { id: "trigonometry", unit: "UNIT 7", title: "Trigonometry", progress: 100, topics: [{ id: "identities", title: "Identities" }, { id: "equations", title: "Trig Equations" }, { id: "2d", title: "2D Trigonometry" }]},
        { id: "euclidean-geometry", unit: "UNIT 8", title: "Euclidean Geometry", progress: 100, topics: [{ id: "circle-geometry", title: "Circle Geometry" }, { id: "proofs", title: "Proofs" }]},
        { id: "probability-statistics", unit: "UNIT 9", title: "Probability & Statistics", progress: 100, topics: [{ id: "probability", title: "Probability" }, { id: "stats", title: "Statistics & Regression" }]},
        { id: "polynomials", unit: "UNIT 10", title: "Polynomials", progress: 100, topics: [{ id: "remainder", title: "Remainder Theorem" }]},
        { id: "measurement", unit: "UNIT 11", title: "Measurement", progress: 100, topics: [{ id: "area-volume", title: "Area & Volume" }]},
        { id: "maps-models", unit: "UNIT 12", title: "Maps & Models", progress: 100, topics: [{ id: "scale", title: "Scale Drawing" }]},
        { id: "revision", unit: "UNIT 13", title: "Exam Revision", progress: 100, topics: [{ id: "papers", title: "Past Papers" }]},
      ]},
    ]
  },
  "physical-sciences": {
    id: "physical-sciences", name: "Physical Sciences", desc: "Physics + Chemistry CAPS",
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
          { id: "conservation", title: "Conservation" },
        ]},
        { id: "projectile", unit: "UNIT 3", title: "Vertical Projectile Motion", progress: 100, topics: [{ id: "free-fall", title: "Free Fall" }, { id: "equations", title: "Equations" }]},
        { id: "work-energy", unit: "UNIT 4", title: "Work, Energy & Power", progress: 100, topics: [{ id: "work", title: "Work" }, { id: "energy", title: "Energy" }]},
        { id: "doppler", unit: "UNIT 5", title: "Doppler Effect", progress: 100, topics: [{ id: "effect", title: "Doppler Effect" }]},
        { id: "waves", unit: "UNIT 6", title: "Waves & Sound", progress: 100, topics: [{ id: "wave-properties", title: "Wave Properties" }]},
        { id: "light", unit: "UNIT 7", title: "Light & EM Radiation", progress: 100, topics: [{ id: "em-spectrum", title: "EM Spectrum" }]},
        { id: "electrostatics", unit: "UNIT 8", title: "Electrostatics", progress: 100, topics: [{ id: "coulomb", title: "Coulomb's Law" }]},
        { id: "electric-circuits", unit: "UNIT 9", title: "Electric Circuits", progress: 100, topics: [{ id: "ohms-law", title: "Ohm's Law" }]},
        { id: "electrodynamics", unit: "UNIT 10", title: "Electrodynamics", progress: 100, topics: [{ id: "generators", title: "Generators & Motors" }]},
      ]},
      { title: "Chemistry", units: [
        { id: "matter", unit: "UNIT 11", title: "Matter and Materials", progress: 100, topics: [{ id: "intermolecular", title: "Intermolecular Forces" }]},
        { id: "chemical-change", unit: "UNIT 12", title: "Chemical Change", progress: 100, topics: [{ id: "rates", title: "Rates of Reaction" }]},
        { id: "acids-bases", unit: "UNIT 13", title: "Acids and Bases", progress: 100, topics: [{ id: "ph", title: "pH & Titration" }]},
        { id: "electrochemistry", unit: "UNIT 14", title: "Electrochemistry", progress: 100, topics: [{ id: "galvanic", title: "Galvanic Cells" }]},
        { id: "organic", unit: "UNIT 15", title: "Organic Chemistry", progress: 100, topics: [{ id: "alkanes", title: "Alkanes & Alkenes" }]},
        { id: "chemical-systems", unit: "UNIT 16", title: "Chemical Systems", progress: 100, topics: [{ id: "fertilizers", title: "Fertilizers" }]},
      ]},
    ]
  }
};
