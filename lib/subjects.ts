export const SUBJECTS_DATA: any = {
  "physical-sciences": {
    name: "Physical Sciences",
    desc: "Physics • Chemistry",
    color: "#7c3aed",
    sections: [
      {
        title: "PHYSICS",
        units: [
          { id: "mechanics", title: "UNIT 1: Mechanics", progress: 30, topics: ["Newton's Laws", "Momentum", "Work Energy Power"] },
          { id: "waves-sound-light", title: "UNIT 2: Waves, Sound and Light", progress: 0, topics: ["Doppler Effect", "Diffraction"] },
          { id: "electricity-magnetism", title: "UNIT 3: Electricity & Magnetism", progress: 0, topics: ["Electric Circuits", "Electrodynamics"] },
        ]
      },
      {
        title: "CHEMISTRY",
        units: [
          { id: "matter-materials", title: "UNIT 1: Matter & Materials", progress: 0, topics: ["Quantitative Chemistry"] },
        ]
      }
    ]
  },
  "mathematics": {
    name: "Mathematics",
    desc: "Algebra • Calculus",
    color: "#f59e0b",
    sections: [
      {
        title: "MATHEMATICS",
        units: [
          { id: "algebra", title: "UNIT 1: Algebra", progress: 0, topics: ["Equations"] },
        ]
      }
    ]
  }
};
