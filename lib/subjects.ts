export const SUBJECTS_DATA:any = {
  mathematics: {
    id: "mathematics", name: "Mathematics", desc: "CAPS-aligned",
    sections: [
      { title: "Mathematics", units: [
        { id: "number-patterns", unit: "UNIT 1", title: "Number Patterns, Sequences and Series", progress: 100, topics: [
          { id: "arithmetic-sequences", title: "Arithmetic Sequences" },
          { id: "geometric-sequences", title: "Geometric Sequences" },
          { id: "sigma-notation", title: "Sigma Notation" },
          { id: "series-and-sums", title: "Series and Sums" },
          { id: "convergent-series", title: "Convergent Series" },
        ]},
        { id: "functions-inverses", unit: "UNIT 2", title: "Functions and Inverses", progress: 100, topics: [
          { id: "parabola", title: "The Parabola" },
          { id: "hyperbola", title: "Hyperbola" },
          { id: "exponential-graph", title: "Exponential Graphs" },
          { id: "log-graph", title: "Logarithmic Graphs" },
          { id: "inverse-functions", title: "Inverse Functions" },
        ]},
        { id: "exponential-log", unit: "UNIT 3", title: "Exponential and Logarithmic Functions", progress: 100, topics: [
          { id: "exponential-functions", title: "Exponential Functions" },
          { id: "log-laws", title: "Laws of Logarithms" },
          { id: "log-equations", title: "Logarithmic Equations" },
          { id: "exponential-equations", title: "Exponential Equations" },
          { id: "applications", title: "Applications" },
        ]},
        { id: "finance", unit: "UNIT 4", title: "Finance, Growth and Decay", progress: 100, topics: [
          { id: "simple-interest", title: "Simple Interest" },
          { id: "compound-interest", title: "Compound Interest" },
          { id: "annuities", title: "Future Value Annuities" },
          { id: "present-value", title: "Present Value Annuities" },
          { id: "growth-decay", title: "Growth and Decay" },
        ]},
        { id: "differential-calculus", unit: "UNIT 5", title: "Differential Calculus", progress: 100, topics: [
          { id: "limits", title: "Limits" },
          { id: "first-principles", title: "First Principles" },
          { id: "differentiation-rules", title: "Differentiation Rules" },
          { id: "tangents-rates", title: "Tangents and Rates" },
          { id: "cubic-sketching", title: "Cubic Sketching" },
        ]},
        { id: "applications-calculus", unit: "UNIT 6", title: "Applications of Calculus", progress: 100, topics: [
          { id: "maxima-minima", title: "Maxima and Minima" },
          { id: "inflection", title: "Points of Inflection" },
          { id: "optimization", title: "Optimization" },
          { id: "rate-of-change", title: "Rate of Change" },
          { id: "interpretation", title: "Interpretation of Graphs" },
        ]},
        { id: "analytical-geometry", unit: "UNIT 7", title: "Analytical Geometry", progress: 100, topics: [
          { id: "distance-midpoint", title: "Distance and Midpoint" },
          { id: "gradient", title: "Gradient and Inclination" },
          { id: "equation-of-line", title: "Equation of a Line" },
          { id: "circle", title: "Circle" },
          { id: "tangent-to-circle", title: "Tangent to a Circle" },
        ]},
        { id: "trigonometry", unit: "UNIT 8", title: "Trigonometry", progress: 100, topics: [
          { id: "reduction-formulae", title: "Reduction Formulae" },
          { id: "identities", title: "Trigonometric Identities" },
          { id: "equations", title: "Trigonometric Equations" },
          { id: "co-functions", title: "Co-functions" },
          { id: "negative-angles", title: "Negative Angles" },
        ]},
        { id: "trigonometry-applications", unit: "UNIT 9", title: "Trigonometry Applications", progress: 100, topics: [
          { id: "sine-rule", title: "Sine Rule" },
          { id: "cosine-rule", title: "Cosine Rule" },
          { id: "area-rule", title: "Area Rule" },
          { id: "2d-problems", title: "2D Problems" },
          { id: "3d-problems", title: "3D Problems" },
        ]},
        { id: "euclidean-geometry", unit: "UNIT 10", title: "Euclidean Geometry", progress: 100, topics: [
          { id: "circle-geometry", title: "Circle Geometry" },
          { id: "cyclic-quads", title: "Cyclic Quadrilaterals" },
          { id: "tangent-chords", title: "Tangent-Chord Theorem" },
          { id: "similar-triangles", title: "Similar Triangles" },
          { id: "riders", title: "Riders and Proofs" },
        ]},
        { id: "statistics", unit: "UNIT 11", title: "Statistics", progress: 100, topics: [
          { id: "measures", title: "Measures of Central Tendency" },
          { id: "variance", title: "Variance and Standard Deviation" },
          { id: "regression", title: "Regression and Correlation" },
          { id: "box-whisker", title: "Box and Whisker" },
          { id: "interpretation", title: "Data Interpretation" },
        ]},
        { id: "counting-probability", unit: "UNIT 12", title: "Counting and Probability", progress: 100, topics: [
          { id: "counting-principle", title: "Counting Principle" },
          { id: "permutations", title: "Permutations" },
          { id: "combinations", title: "Combinations" },
          { id: "probability-rules", title: "Probability Rules" },
          { id: "venn-diagrams", title: "Venn Diagrams" },
        ]},
        { id: "probability-distributions", unit: "UNIT 13", title: "Probability Distributions", progress: 100, topics: [
          { id: "binomial", title: "Binomial Distribution" },
          { id: "normal", title: "Normal Distribution" },
          { id: "expected-value", title: "Expected Value" },
          { id: "applications", title: "Exam Applications" },
          { id: "past-papers", title: "Past Paper Questions" },
        ]},
      ]},
    ]
  },
  "physical-sciences": {
    id: "physical-sciences", name: "Physical Sciences", desc: "Physics and Chemistry",
    sections: [
      { title: "Physics", units: [
        { id: "mechanics", unit: "UNIT 1", title: "Mechanics", progress: 100, topics: [
          { id: "newtons-first-law", title: "Newton's First Law" },
          { id: "newtons-second-law", title: "Newton's Second Law" },
          { id: "newtons-third-law", title: "Newton's Third Law" },
          { id: "friction-inclined", title: "Friction and Inclined Planes" },
          { id: "connected-bodies", title: "Connected Bodies" },
        ]},
        { id: "momentum-impulse", unit: "UNIT 2", title: "Momentum and Impulse", progress: 100, topics: [
          { id: "momentum", title: "Momentum" },
          { id: "impulse", title: "Impulse" },
          { id: "conservation", title: "Conservation of Momentum" },
          { id: "elastic-collisions", title: "Elastic Collisions" },
          { id: "inelastic-collisions", title: "Inelastic Collisions" },
        ]},
        { id: "vertical-projectile", unit: "UNIT 3", title: "Vertical Projectile Motion", progress: 100, topics: [
          { id: "free-fall", title: "Free Fall" },
          { id: "equations", title: "Equations of Motion" },
          { id: "graphs", title: "Projectile Graphs" },
          { id: "bounce", title: "Bounce and Energy" },
        ]},
        { id: "work-energy-power", unit: "UNIT 4", title: "Work Energy and Power", progress: 100, topics: [
          { id: "work", title: "Work" },
          { id: "energy", title: "Energy" },
          { id: "conservation-energy", title: "Conservation of Energy" },
          { id: "power", title: "Power" },
          { id: "work-energy-theorem", title: "Work-Energy Theorem" },
        ]},
        { id: "doppler-effect", unit: "UNIT 5", title: "Doppler Effect", progress: 100, topics: [
          { id: "definition", title: "Definition" },
          { id: "frequency-shift", title: "Frequency Shift" },
          { id: "applications", title: "Real World Applications" },
          { id: "calculations", title: "Calculations" },
        ]},
        { id: "electrostatics", unit: "UNIT 6", title: "Electrostatics", progress: 100, topics: [
          { id: "coulombs-law", title: "Coulomb's Law" },
          { id: "electric-field", title: "Electric Field" },
          { id: "electric-potential", title: "Electric Potential" },
          { id: "capacitors", title: "Capacitors" },
          { id: "millikan", title: "Millikan Experiment" },
        ]},
        { id: "electric-circuits", unit: "UNIT 7", title: "Electric Circuits", progress: 100, topics: [
          { id: "ohms-law", title: "Ohm's Law" },
          { id: "power-energy", title: "Power and Energy" },
          { id: "internal-resistance", title: "Internal Resistance" },
        ]},
        { id: "electrodynamics", unit: "UNIT 8", title: "Electrodynamics", progress: 100, topics: [
          { id: "faradays-law", title: "Faraday's Law" },
          { id: "electric-motors", title: "Electric Motors" },
          { id: "generators", title: "Generators" },
        ]},
        { id: "optical-phenomena", unit: "UNIT 9", title: "Optical Phenomena", progress: 100, topics: [
          { id: "photoelectric", title: "Photoelectric Effect" },
          { id: "emission-spectra", title: "Emission Spectra" },
          { id: "absorption-spectra", title: "Absorption Spectra" },
        ]},
        { id: "emission-absorption", unit: "UNIT 10", title: "Emission and Absorption Spectra", progress: 100, topics: [
          { id: "line-spectra", title: "Line Spectra" },
          { id: "bohr-model", title: "Bohr Model" },
          { id: "energy-levels", title: "Energy Levels" },
          { id: "applications", title: "Applications" },
        ]},
      ]},
      { title: "Chemistry", units: [
        { id: "organic-macromolecules", unit: "UNIT 1", title: "Organic Compounds and Macromolecules", progress: 100, topics: [
          { id: "nomenclature", title: "Nomenclature" },
          { id: "isomers", title: "Isomers" },
          { id: "homologous", title: "Homologous Series" },
          { id: "reactions", title: "Organic Reactions" },
          { id: "polymers", title: "Polymers" },
          { id: "macromolecules", title: "Macromolecules" },
          { id: "physical-properties", title: "Physical Properties" },
          { id: "preparation", title: "Preparation" },
        ]},
        { id: "rate-extent", unit: "UNIT 2", title: "Rate and Extent of Reactions", progress: 100, topics: [
          { id: "rate", title: "Rate of Reaction" },
          { id: "factors", title: "Factors Affecting Rate" },
          { id: "collision-theory", title: "Collision Theory" },
          { id: "catalysts", title: "Catalysts" },
        ]},
        { id: "chemical-equilibrium", unit: "UNIT 3", title: "Chemical Equilibrium", progress: 100, topics: [
          { id: "equilibrium", title: "Chemical Equilibrium" },
          { id: "kc", title: "Kc and Kp" },
          { id: "le-chatelier", title: "Le Chatelier's Principle" },
          { id: "applications", title: "Industrial Applications" },
        ]},
        { id: "acids-bases", unit: "UNIT 4", title: "Acids and Bases", progress: 100, topics: [
          { id: "theories", title: "Acid-Base Theories" },
          { id: "ph", title: "pH Calculations" },
          { id: "titrations", title: "Titrations" },
        ]},
        { id: "electrochemistry", unit: "UNIT 5", title: "Electrochemistry", progress: 100, topics: [
          { id: "galvanic", title: "Galvanic Cells" },
          { id: "electrolytic", title: "Electrolytic Cells" },
          { id: "standard-potentials", title: "Standard Potentials" },
          { id: "applications", title: "Applications" },
        ]},
        { id: "chlor-alkali", unit: "UNIT 6", title: "Chlor-Alkali Industry", progress: 100, topics: [
          { id: "chlor-alkali", title: "Chlor-Alkali Industry" },
        ]},
      ]},
    ]
  }
};
