export const SUBJECTS_DATA: any = {
  mathematics: {
    id: "mathematics",
    name: "Mathematics",
    desc: "CAPS-aligned",
    sections: [
      {
        title: "Mathematics",
        units: [
          {
            id: "number-patterns",
            unit: "UNIT 1",
            title: "Number Patterns, Sequences and Series",
            subTopics: [
              { id: "arithmetic-sequences", title: "Arithmetic Sequences", youtubeId: "kQ0i8s3q6dM" },
              { id: "geometric-sequences", title: "Geometric Sequences", youtubeId: "I5akUQpFO8" },
              { id: "sigma-notation", title: "Sigma Notation", youtubeId: "0P5i9y0x3eA" }
            ]
          },
          {
            id: "functions-inverses",
            unit: "UNIT 2",
            title: "Functions and Inverses",
            subTopics: [
              { id: "parabola", title: "The Parabola", youtubeId: "a1sD2f3g4hJ" },
              { id: "hyperbola", title: "Hyperbola", youtubeId: "x1eN9y2z4qR" }
            ]
          }
        ]
      }
    ]
  },
  physicalSciences: {
    id: "physical-sciences",
    name: "Physical Sciences",
    sections: [
      {
        title: "Mechanics",
        units: [
          {
            id: "vectors",
            unit: "UNIT 1",
            title: "Vectors & Scalars",
            subTopics: [
              { id: "scalars-vectors", title: "Scalars vs Vectors", youtubeId: "kQ0i8s3q6dM" }
            ]
          }
        ]
      }
    ]
  }
};

export const subjects = Object.values(SUBJECTS_DATA);
export const getByType = (t: any) => SUBJECTS_DATA[t]?.sections || [];
