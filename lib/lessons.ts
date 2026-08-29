export const LESSONS_DATA:any = {
  "newtons-first-law": {
    youtubeId: "k1R7xQ1PBO0", // Replace with your real YouTube ID
    duration: "12:34",
    nodes: {
      A: { title: "Exam Hook", content: "In 2023 NSC Paper 1, 8 marks asked: 'State Newton's First Law'. 62% lost marks because they forgot 'resultant force'. This node guarantees those 8 marks.", video: "k1R7xQ1PBO0" },
      B: { title: "Learn The Concept", content: "Newton's First Law: An object continues in uniform motion unless a non-zero resultant force acts on it. F_net = 0 => a = 0. Inertia is resistance to change.", video: "k1R7xQ1PBO0" },
      C: { title: "Worked Example", content: "Example: A 2kg box moves at constant velocity 5m/s. What is F_net? Solution: v constant => a=0 => F_net = m*a =0. Friction = Applied force.", video: "k1R7xQ1PBO0" },
      D: { title: "Examiner Traps", content: "Trap 1: Students write 'object at rest stays at rest' and forget 'in motion stays in motion'. Trap 2: Confusing First and Second law. Must mention 'resultant/net force'.", video: "k1R7xQ1PBO0" },
      E: { title: "Exam Challenge", content: "2022 NSC Q2: A car moves at 20m/s, engine force 500N, friction 500N. Explain motion using First Law. [3 marks] Answer: F_net=0 so constant velocity as per First Law.", video: "k1R7xQ1PBO0" },
    }
  },
  "arithmetic-sequences": {
    youtubeId: "dQw4w9WgXcQ",
    nodes: {
      A: { title: "Exam Hook", content: "Arithmetic sequences = 8-10 marks every Paper 1. This pattern appears Q1 every year since 2018." },
      B: { title: "Learn The Concept", content: "Tn = a + (n-1)d. Common difference d = T2 - T1." },
      C: { title: "Worked Example", content: "Find T20 of 3,7,11... a=3 d=4 T20=79" },
      D: { title: "Examiner Traps", content: "Trap: Using n instead of n-1. Always check first term." },
      E: { title: "Exam Challenge", content: "2023: Find sum of first 20 terms if T5=19 and T10=39" },
    }
  }
};

export function getLesson(topicId:string){
  return LESSONS_DATA[topicId] || null;
}
