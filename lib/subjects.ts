export const SUBJECTS_DATA:any = {
  mathematics: {
    id: "mathematics", name: "Mathematics", desc: "CAPS-aligned",
    sections: [{ title: "Mathematics", units: [
      { id: "number-patterns", unit: "UNIT 1", title: "Number Patterns, Sequences and Series", topics: [
        { id: "arithmetic-sequences", title: "Arithmetic Sequences" },
        { id: "geometric-sequences", title: "Geometric Sequences" },
      ]},
      { id: "functions-inverses", unit: "UNIT 2", title: "Functions and Inverses", topics: [
        { id: "parabola", title: "The Parabola" },
      ]},
    ]}]
  },
  "physical-sciences": {
    id: "physical-sciences", name: "Physical Sciences", desc: "Physics and Chemistry",
    sections: [
      { title: "Physics", units: [
        { id: "mechanics", unit: "UNIT 1", title: "Mechanics", topics: [
          { id: "newtons-first-law", title: "Newtons First Law" },
          { id: "newtons-second-law", title: "Newtons Second Law" },
        ]},
      ]},
      { title: "Chemistry", units: [
        { id: "organic-macromolecules", unit: "UNIT 1", title: "Organic Compounds", topics: [
          { id: "nomenclature", title: "Nomenclature" },
        ]},
      ]}
    ]
  }
};
