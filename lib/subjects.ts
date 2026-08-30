export const SUBJECTS_DATA:any = {
  mathematics: { id: "mathematics", name: "Mathematics", desc: "CAPS", sections: [{ title: "Mathematics", units: [{ id: "number-patterns", unit: "UNIT 1", title: "Number Patterns", topics: [{ id: "arithmetic-sequences", title: "Arithmetic Sequences" }] }] }] },
  "physical-sciences": { id: "physical-sciences", name: "Physical Sciences", desc: "Physics", sections: [{ title: "Physics", units: [{ id: "mechanics", unit: "UNIT 1", title: "Mechanics", topics: [{ id: "newtons-first-law", title: "Newtons First Law" }] }] }] }
};
export const subjects = Object.values(SUBJECTS_DATA);
export const getByType = (t:any) => [];
