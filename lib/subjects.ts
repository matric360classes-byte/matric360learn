export const SUBJECTS_DATA: any = {
  "physical-sciences": {
    name: "Physical Sciences",
    desc: "Physics • Chemistry",
    color: "#7c3aed",
    sections: [
      {
        title: "PHYSICS",
        units: [
          { id: "mechanics", title: "UNIT 1: Mechanics", progress: 30, topics: ["Vectors", "Newton Laws", "Momentum", "Work Energy Power"] },
          { id: "waves-sound-light", title: "UNIT 2: Waves, Sound and Light", progress: 0, topics: ["Doppler Effect", "Diffraction", "Photoelectric Effect"] },
          { id: "electricity-magnetism", title: "UNIT 3: Electricity & Magnetism", progress: 0, topics: ["Electrostatics", "Electric Circuits", "Electrodynamics"] },
          { id: "matter-materials", title: "UNIT 4: Matter & Materials", progress: 0, topics: ["Organic Molecules", "Bonding"] },
        ]
      },
      {
        title: "CHEMISTRY",
        units: [
          { id: "chemical-change", title: "UNIT 1: Chemical Change", progress: 0, topics: ["Rate of Reaction", "Equilibrium", "Acids Bases"] },
          { id: "chemical-systems", title: "UNIT 2: Chemical Systems", progress: 0, topics: ["Fertilizers", "Electrochemical"] },
        ]
      }
    ]
  },
  "mathematics": {
    name: "Mathematics",
    desc: "Algebra • Calculus • Geometry",
    color: "#f59e0b",
    sections: [
      {
        title: "MATHEMATICS",
        units: [
          { id: "algebra", title: "UNIT 1: Algebra and Equations", progress: 20, topics: ["Equations", "Inequalities", "Nature of Roots"] },
          { id: "functions", title: "UNIT 2: Functions and Graphs", progress: 0, topics: ["Parabola", "Exponential", "Trig Functions"] },
          { id: "calculus", title: "UNIT 3: Calculus", progress: 0, topics: ["Limits", "Differentiation", "Integration"] },
          { id: "trig", title: "UNIT 4: Trigonometry", progress: 0, topics: ["Identities", "2D & 3D Trig"] },
          { id: "geometry", title: "UNIT 5: Euclidean Geometry", progress: 0, topics: ["Circle Geometry", "Similarity"] },
          { id: "stats-prob", title: "UNIT 6: Statistics & Probability", progress: 0, topics: ["Regression", "Probability"] },
        ]
      }
    ]
  }
};
