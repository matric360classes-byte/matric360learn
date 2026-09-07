"use client";
import { useState } from "react";

const CAPS_TOPICS = [
  { subject: "physical-sciences", name: "Newton's Laws", grade: 11, content: "Newton's 1st, 2nd, 3rd laws, F=ma" },
  { subject: "physical-sciences", name: "Work Energy Power", grade: 12, content: "Work, kinetic energy, potential, power" },
  { subject: "physical-sciences", name: "Momentum Impulse", grade: 12, content: "Momentum p=mv, conservation" },
  { subject: "physical-sciences", name: "Electric Circuits", grade: 11, content: "Ohm's Law V=IR, series parallel" },
  { subject: "physical-sciences", name: "Electrostatics", grade: 11, content: "Coulomb's law, electric fields" },
  { subject: "mathematics", name: "Algebra", grade: 10, content: "Equations, factorization, quadratic" },
  { subject: "mathematics", name: "Functions", grade: 11, content: "Linear quadratic exponential" },
  { subject: "mathematics", name: "Trigonometry", grade: 11, content: "Sin cos tan, identities" },
  { subject: "mathematics", name: "Calculus", grade: 12, content: "Limits differentiation" },
];

export default function SeedPage() {
  const [status, setStatus] = useState("Ready to seed");
  const [count, setCount] = useState(0);

  async function handleSeed() {
    setStatus("Seeding... Wait 10 sec");
    // Use fetch, not supabase-js library
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      setStatus("❌ Supabase keys not found in Vercel env");
      return;
    }

    let seeded = 0;
    for (const t of CAPS_TOPICS) {
      try {
        const res = await fetch(`${url}/rest/v1/topic_knowledge`, {
          method: "POST",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
          },
          body: JSON.stringify({
            subject: t.subject,
            topic_name: t.name,
            grade: t.grade,
            content: t.content,
            caps_code: `${t.subject}-${t.name.toLowerCase().replace(/\s+/g,'-')}`,
          })
        });
        if (res.ok) seeded++;
      } catch(e) {}
    }
    setCount(seeded);
    setStatus(`✅ Done! ${seeded} topics seeded`);
  }

  return (
    <div className="p-6 min-h-screen bg-[#f8f9ff]">
      <h1 className="text-2xl font-bold mb-2">Seed CAPS Knowledge</h1>
      <p className="text-sm text-gray-500 mb-6">No library needed — uses direct API</p>
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="mb-4">Topics: {CAPS_TOPICS.length}</p>
        <button onClick={handleSeed} className="bg-black text-white px-6 py-3 rounded-full font-bold w-full">Seed Now →</button>
        <p className="mt-4 text-center font-bold">{status}</p>
        {count>0 && <p className="text-center text-green-600">AI now knows {count} topics!</p>}
      </div>
    </div>
  );
}
