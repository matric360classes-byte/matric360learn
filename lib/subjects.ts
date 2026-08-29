export const SUBJECTS_DATA:any = {
  mathematics: {
    id: "mathematics", name: "Mathematics", desc: "CAPS-aligned exam practice, worked solutions and progress tracking.",
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
          { id: "parabola", title: "Parabola & Graphs" },
          { id: "hyperbola", title: "Hyperbola" },
          { id: "exponential-graph", title: "Exponential Graphs" },
          { id: "inverse", title: "Inverse Functions" },
          { id: "interpretation", title: "Graph Interpretation" },
        ]},
        { id: "exponential-log", unit: "UNIT 3", title: "Exponential and Logarithmic Functions", progress: 100, topics: [
          { id: "exponential-functions", title: "Exponential Functions" },
          { id: "log-laws", title: "Logarithm Laws" },
          { id: "log-equations", title: "Log Equations" },
          { id: "applications", title: "Applications" },
          { id: "graphs", title: "Graphs of Logs" },
        ]},
        { id: "finance", unit: "UNIT 4", title: "Finance, Growth and Decay", progress: 100, topics: [
          { id: "simple-interest", title: "Simple Interest" },
          { id: "compound-interest", title: "Compound Interest" },
          { id: "annuities", title: "Annuities" },
          { id: "present-value", title: "Present Value" },
          { id: "decay", title: "Growth & Decay" },
        ]},
        { id: "differential-calculus", unit: "UNIT 5", title: "Differential Calculus", progress: 100, topics: [
          { id: "first-principles", title: "First Principles" },
          { id: "power-rule", title: "Power Rule" },
          { id: "product-quotient", title: "Product & Quotient Rule" },
          { id: "chain-rule", title: "Chain Rule" },
          { id: "tangents", title: "Tangents & Rates" },
        ]},
        { id: "applications-calculus", unit: "UNIT 6", title: "Applications of Calculus", progress: 100, topics: [
          { id: "maxima-minima", title: "Maxima & Minima" },
          { id: "inflection", title: "Inflection Points" },
          { id: "optimization", title: "Optimization" },
          { id: "rate-of-change", title: "Rate of Change" },
          { id: "sketching", title: "Cubic Sketching" },
        ]},
        { id: "analytical-geometry", unit: "UNIT 7", title: "Analytical Geometry", progress: 100, topics: [
          { id: "distance-midpoint", title: "Distance & Midpoint" },
          { id: "gradient", title: "Gradient & Equation" },
          { id: "circle", title: "Circle" },
          { id: "tangents-circle", title: "Tangents to Circle" },
          { id: "inclination", title: "Inclination" },
        ]},
        { id: "trigonometry", unit: "UNIT 8", title: "Trigonometry", progress: 100, topics: [
          { id: "reduction", title: "Reduction Formulae" },
          { id: "identities", title: "Identities" },
          { id: "equations", title: "Trig Equations" },
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
          { id: "tangents", title: "Tangents" },
          { id: "similarity", title: "Similarity & Ratio" },
          { id: "proofs", title: "Riders & Proofs" },
        ]},
        { id: "statistics", unit: "UNIT 11", title: "Statistics", progress: 100, topics: [
          { id: "measures", title: "Measures of Central Tendency" },
          { id: "variance", title: "Variance & Standard Deviation" },
          { id: "regression", title: "Regression & Correlation" },
          { id: "box-whisker", title: "Box & Whisker" },
          { id: "interpretation", title: "Data Interpretation" },
        ]},
        { id: "counting-probability", unit: "UNIT 12", title: "Counting and Probability", progress: 100, topics: [
          { id: "counting", title: "Counting Principle" },
          { id: "permutations", title: "Permutations" },
          { id: "combinations", title: "Combinations" },
          { id: "probability-rules", title: "Probability Rules" },
          { id: "venn", title: "Venn Diagrams" },
        ]},
        { id: "probability-distributions", unit: "UNIT 13", title: "Probability Distributions", progress: 100, topics: [
          { id: "binomial", title: "Binomial Distribution" },
          { id: "normal", title: "Normal Distribution" },
          { id: "expected", title: "Expected Value" },
          { id: "applications", title: "Applications" },
          { id: "past-papers", title: "Exam Questions" },
        ]},
      ]},
    ]
  },
  "physical-sciences": {
    id: "physical-sciences", name: "Physical Sciences", desc: "CAPS Grade 12 Physical Sciences — Physics and Chemistry combined.",
    sections: [
      { title: "Physics", units: [
        { id: "mechanics", unit: "UNIT 1", title: "Mechanics", progress: 100, topics: [
          { id: "newtons-laws", title: "Newton's Laws" },
          { id: "free-body", title: "Free Body Diagrams" },
          { id: "friction", title: "Friction" },
          { id: "inclined-plane", title: "Inclined Planes" },
          { id: "application", title: "Applications" },
        ]},
        { id: "momentum-impulse", unit: "UNIT 2", title: "Momentum and Impulse", progress: 100, topics: [
          { id: "momentum", title: "Momentum" },
          { id: "impulse", title: "Impulse" },
          { id: "conservation", title: "Conservation" },
          { id: "elastic", title: "Elastic Collisions" },
          { id: "inelastic", title: "Inelastic Collisions" },
        ]},
        { id: "vertical-projectile", unit: "UNIT 3", title: "Vertical Projectile Motion", progress: 100, topics: [
          { id: "free-fall", title: "Free Fall" },
          { id: "equations", title: "Equations of Motion" },
          { id: "graphs", title: "Graphs" },
          { id: "bounce", title: "Bounce & Energy" },
        ]},
        { id: "work-energy-power", unit: "UNIT 4", title: "Work Energy and Power", progress: 100, topics: [
          { id: "work", title: "Work" },
          { id: "energy", title: "Energy" },
          { id: "conservation-energy", title: "Conservation of Energy" },
          { id: "power", title: "Power" },
          { id: "work-energy-theorem", title: "Work-Energy Theorem" },
        ]},
        { id: "doppler-effect", unit: "UNIT 5", title: "Doppler Effect", progress: 100, topics: [
          { id: "definition", title: "Doppler Effect Definition" },
          { id: "frequency", title: "Frequency Shift" },
          { id: "applications", title: "Applications" },
          { id: "calculations", title: "Calculations" },
        ]},
        { id: "electrostatics", unit: "UNIT 6", title: "Electrostatics", progress: 100, topics: [
          { id: "coulomb", title: "Coulomb's Law" },
          { id: "electric-field", title: "Electric Field" },
          { id: "potential", title: "Potential" },
          { id: "capacitor", title: "Capacitors" },
          { id: "applications", title: "Applications" },
        ]},
        { id: "electric-circuits", unit: "UNIT 7", title: "Electric Circuits", progress: 100, topics: [
          { id: "ohms-law", title: "Ohm's Law" },
          { id: "power-energy", title: "Power & Energy" },
          { id: "internal-resistance", title: "Internal Resistance" },
        ]},
        { id: "electrodynamics", unit: "UNIT 8", title: "Electrodynamics", progress: 100, topics: [
          { id: "faraday", title: "Faraday's Law" },
          { id: "motors", title: "Motors" },
          { id: "generators", title: "Generators" },
        ]},
        { id: "optical-phenomena", unit: "UNIT 9", title: "Optical Phenomena", progress: 100, topics: [
          { id: "photoelectric", title: "Photoelectric Effect" },
          { id: "emission", title: "Emission Spectra" },
          { id: "absorption", title: "Absorption" },
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
          { id: "naming", title: "Naming & Structures" },
          { id: "isomers", title: "Isomers" },
          { id: "reactions", title: "Organic Reactions" },
          { id: "polymers", title: "Polymers" },
          { id: "macromolecules", title: "Macromolecules" },
          { id: "physical-properties", title: "Physical Properties" },
          { id: "preparation", title: "Preparation" },
          { id: "applications", title: "Applications" },
        ]},
        { id: "rate-extent", unit: "UNIT 2", title: "Rate and Extent of Reactions", progress: 100, topics: [
          { id: "rate", title: "Rate of Reaction" },
          { id: "factors", title: "Factors Affecting Rate" },
          { id: "mechanism", title: "Mechanism" },
          { id: "catalysts", title: "Catalysts" },
        ]},
        { id: "chemical-equilibrium", unit: "UNIT 3", title: "Chemical Equilibrium", progress: 100, topics: [
          { id: "equilibrium", title: "Equilibrium" },
          { id: "kc", title: "Kc & Kp" },
          { id: "le-chatelier", title: "Le Chatelier" },
          { id: "applications", title: "Applications" },
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
          { id: "industry", title: "Chlor-Alkali Industry" },
        ]},
      ]},
    ]
  }
};
