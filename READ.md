# Matric360Learn — LOCKED GREEN v154

**Status:** 🟢 Production 154 — d0dcbc8 — 30 Aug 2025
**URL:** https://matric360learn.vercel.app

## LOCKED STRUCTURE — DO NOT DELETE

### Mathematics — 13 Units × 5 = 65 subtopics — Mind the Gap CAPS
1. Algebra, Equations and Inequalities
2. Number Patterns, Sequences and Series
3. Functions and Graphs
4. Inverse Functions
5. Exponential and Logarithmic Functions
6. Finance, Growth and Decay
7. Analytical Geometry
8. Euclidean Geometry
9. Trigonometry - Identities
10. Trigonometry - Equations, Sine, Cosine, Area Rules
11. Statistics
12. Differential Calculus
13. Counting and Probability

### Physical Sciences — 14 Units
**PHYSICS — 8 Units**
1. Newtons Laws
2. Momentum and Impulse
3. Vertical Projectile Motion
4. Work, Energy and Power
5. Doppler Effect
6. Electrostatics
7. Electric Circuits
8. Electrodynamics

**CHEMISTRY — 6 Units**
1. Organic Nomenclature
2. Organic Physical Properties and Reactions
3. Rate and Extent
4. Chemical Equilibrium
5. Acids and Bases
6. Electrochemistry

### Features Locked
- 80min YouTube holder — supports 12 hours — no cut-off
- Nodes A-E: Explanation, Formulas, Worked Example, Common Mistakes, Exam Tip
- Dark premium UI
- PHYSICS / CHEMISTRY split
- All GREEN safe — no `'` characters

### Backup
- `lib/subjects.ts` = Single source of truth — 13 Maths + 14 Science
- `app/subjects/[id]/[unitId]/page.tsx` = Units page
- `app/subjects/[id]/[unitId]/[topicId]/page.tsx` = 80min Video + Nodes A-E

### How to not lose it when editing
1. Never delete `lib/subjects.ts` — only edit youtubeId values
2. To add real videos: only change `youtubeId: "..."`
3. Create branch for experiments: `dev` branch
4. This commit d0dcbc8 is your restore point

**Locked by:** matric360classes-byte — 30 Aug 2025 — 19:06
