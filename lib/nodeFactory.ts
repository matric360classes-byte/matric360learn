// lib/nodeFactory.ts - Auto-generates detailed Nodes for ANY topic
export function buildNodesForTopic(topicId: string, subjectId: string) {
  const title = topicId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const pretty = title;

  // Helpers to make it topic-specific
  const isWork = topicId.includes("work") || topicId.includes("theorem");
  const isEnergy = topicId.includes("energy");
  
  const formulas: any = isWork ? [
    { f: "W = FΔx cos(θ)", desc: "Work done by a constant force. θ = angle between F and Δx." },
    { f: "W_net = ΔEk", desc: "Work-Energy Theorem: Net work = change in kinetic energy." },
    { f: "ΔEk = Ek_f - Ek_i = ½m(v_f² - v_i²)", desc: "Change in kinetic energy = FINAL minus INITIAL." },
    { f: "Ek = ½mv²", desc: "Kinetic energy - energy due to motion." },
  ] : [
    { f: `${pretty} — Main Formula`, desc: `Core equation for ${pretty}.` },
    { f: "W = FΔx cosθ", desc: "You may need work formula in this topic." },
    { f: "Ek = ½mv²  |  Ep = mgh", desc: "Energy forms linked to this topic." },
  ];

  return {
    title: pretty,
    subjectId,
    nodes: [
      {
        id: "A",
        label: "Exam Hook",
        title: "Exam Hook — Concepts",
        data: {
          intro: `${pretty} appears in Paper 1 every year — 8-12 marks. Examiners love it because learners confuse signs, forget that ΔEk = FINAL minus INITIAL, and forget units.`,
          tips: [
            `EXAMINER TIP: For ${pretty}, always start with W_net = ΔEk as your first line. You get M mark even if calculation fails.`,
            `Why it matters: Links force, displacement and speed — connects Dynamics to Energy.`
          ],
          checklist: [`Can you define work?`, `Can you state Work-Energy Theorem in words?`, `Is ${pretty} scalar or vector?`]
        }
      },
      {
        id: "B",
        label: "Learn The Concept",
        title: "Learn The Concept",
        data: {
          formulas,
          // This is what your dark card renderer shows
          markdown: `Getting started with ${pretty}

${pretty} is a high-yield CAPS topic. The principle is simple: Net work done on an object changes its kinetic energy.

**Definitions**
• Work (W): W = FΔx cosθ — scalar, unit Joule (J)
• Kinetic Energy: Ek = ½mv² — scalar
• Work-Energy Theorem: W_net = Ek_f - Ek_i

**Key ideas**
• Positive W_net → speed increases
• Negative W_net → speed decreases
• Zero W_net → constant speed
• Always sum works: W_net = W_F + W_f + W_g`,
        }
      },
      {
        id: "C",
        label: "Worked Example",
        title: "Worked Example",
        data: {
          worked: [
            {
              q: `A 2 kg block slides down a 2 m high curved slope with friction. It starts from rest and reaches the bottom with 5 m·s⁻¹. Use work-energy theorem to calculate work done by friction. (6 marks)`,
              steps: [
                "W_net = ΔEk — State the Work-Energy Theorem principle.",
                "ΔEk = Ek_f - Ek_i = ½m(v_f²) - ½m(v_i²) — Formula for change in kinetic energy.",
                "ΔEk = ½(2 kg)(5 m·s⁻¹)² - ½(2 kg)(0)² = 25 J — Calculate change in Ek.",
                "W_net = W_gravity + W_friction — Net work is sum of conservative and non-conservative.",
                "W_gravity = mgh = (2)(9.8)(2) = 39.2 J — Work done by gravity on slope.",
                "25 = 39.2 + W_f → W_f = -14.2 J. Magnitude = 14.2 J — Solve for friction.",
              ],
              answer: "The work done by friction is -14.2 J (magnitude 14.2 J). Negative because friction opposes motion.",
            },
            {
              q: `A 60 kg crate is pulled 8 m up a 20° ramp by 400 N force. Friction 110 N. Starts at 2 m/s. Find speed at top using work-energy.`,
              steps: [
                "W_F = FΔx cos0° = (400)(8)(1) = 3200 J",
                "W_f = fΔx cos180° = (110)(8)(-1) = -880 J",
                "F_g_parallel = mg sinθ = (60)(9.8)sin20° = 201 J component opposite motion. W_g = -201*8 = -1608 J",
                "W_net = 3200 - 880 - 1608 = 712 J — Sum works",
                "W_net = ΔEk = ½m(v_f² - v_i²) — Apply theorem",
                "712 = ½(60)(v_f² - 2²) → 712 = 30(v_f² -4) → v_f = 5.26 m·s⁻¹",
              ],
              answer: "Speed at top is 5.26 m·s⁻¹",
            }
          ]
        }
      },
      {
        id: "D",
        label: "Examiner Traps",
        title: "Exam Strategy",
        data: {
          errors: [
            { title: "Assuming friction is the only non-conservative force.", text: "Marker: Friction is NOT the only non-conservative force. Applied, tension, motor forces are also non-conservative. When calculating W_nc, include ALL of them. Marks lost: 2" },
            { title: "Swapping initial and final velocities in ΔEk.", text: "Marker: Δ (delta) always means FINAL minus INITIAL. ΔEk = Ek_f - Ek_i = ½m(v_f² - v_i²). Swapping gives wrong sign. Marks lost: 1" },
            { title: "Forgetting work is a scalar and W_net is sum of scalars.", text: "Marker: Candidates calculate F_net first, then W_net = F_net Δx. Wrong. W_net = W1 + W2 + ... (scalar sum). If you use vectors you lose 2 marks." },
          ],
          tips: ["Always write formula first for M mark", "Check sign: + if force helps motion, - if opposes", "ΔEk = FINAL - INITIAL, never the other way"]
        }
      },
      {
        id: "E",
        label: "Exam Challenge",
        title: "Exam Challenge — Formulas & Checklist",
        data: {
          formulas: [
            { f: "Ek = ½mv²", desc: "You are calculating energy of an object due to its motion." },
            { f: "W = FΔx cos(θ)", desc: "You need to calculate work done by a single, constant force." },
            { f: "W_net = ΔEk", desc: "You need to relate net work to change in kinetic energy." },
          ],
          checklist: [
            "Have I stated Work-Energy Theorem (W_net = ΔEk) as my starting point?",
            "Have I drawn a free-body diagram to identify all forces doing work?",
            `Have I calculated W_net correctly by summing work done by each force (W_F + W_f + W_g)?`,
            "Is the sign (+/-) correct for work done by each force?",
            "Is ΔEk calculated as FINAL minus INITIAL (½mv_f² - ½mv_i²)?",
            "Have I used correct SI units throughout (J, kg, m, s)?",
            "Is my final answer in Joules (work/energy) or m·s⁻¹ (speed) and 3 sig figs?",
          ],
          worked: [
            {
              q: "Exam-style challenge (5 marks) — A 20 kg crate is pulled from rest up a 15,6 m ramp inclined at 18° to horizontal. Motor exerts 96,8 N parallel to ramp. Friction 13,5 N opposes. Use Work-Energy Theorem to calculate speed at top.",
              steps: [
                "W_app = FΔx cos0° = (96.8 N)(15.6 m)(1) = 1509.08 J",
                "W_f = (13.5 N)(15.6 m)cos180° = -210.6 J",
                "Component of gravity against motion: F_g_parallel = mg sinθ = (20)(9.8)sin18° = 60.58 N. W_g = (60.58)(15.6)cos180° = -945.05 J",
                "W_net = W_app + W_f + W_g = 1509.08 -210.6 -945.05 = 353.43 J",
                "Now apply theorem: W_net = ΔEk = Ek_f - Ek_i",
                "353.43 = ½mv_f² - ½mv_i²",
                "353.43 = ½(20)v_f² - 0 (starts from rest)",
                "353.43 = 10 v_f²",
                "v_f² = 35.343",
                "v_f = 5.95 m·s⁻¹",
              ],
              answer: "Speed at top is 5.95 m·s⁻¹. Positive net work → speed increases.",
            }
          ]
        }
      },
    ]
  };
}
