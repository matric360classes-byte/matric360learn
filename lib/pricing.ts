export const PLANS = [
  { id: 'free', name: 'FREE', monthly: 0, label: 'R0 /forever', sub: '✓ CAPS lessons ✓ 1 quiz per unit' },
  { id: '1-subject', name: '1 Subject', monthly: 149 },
  { id: '2-subjects', name: '2 Subjects', monthly: 249, popular: true },
  { id: '3-subjects', name: '3 Subjects', monthly: 300 },
  { id: '4-subjects', name: '4 Subjects', monthly: 350 },
  { id: '5-subjects', name: '5 Subjects', monthly: 400 },
  { id: '6plus', name: '6+ Subjects', monthly: 450, best: true, bestText: 'Best value' },
].map(p => ({
  ...p,
  annual: p.monthly * 10,
  save: p.monthly > 0 ? `Save R${p.monthly * 2}` : ''
}))
