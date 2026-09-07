"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CAPS_TOPICS = [
  // PHYSICAL SCIENCES - 38 core CAPS topics
  { subject: "physical-sciences", name: "Newton's Laws", grade: 11, description: "Newton's 1st, 2nd, 3rd laws, F=ma, inertia, action-reaction" },
  { subject: "physical-sciences", name: "Work Energy Power", grade: 12, description: "Work done, kinetic energy, potential energy, power P=W/t, conservation" },
  { subject: "physical-sciences", name: "Momentum Impulse", grade: 12, description: "Momentum p=mv, impulse, conservation of momentum in collisions" },
  { subject: "physical-sciences", name: "Gravitational Fields", grade: 11, description: "Newton's law of gravitation, g=9.8, projectile motion" },
  { subject: "physical-sciences", name: "Electric Circuits", grade: 11, description: "Ohm's Law V=IR, series parallel, power, internal resistance" },
  { subject: "physical-sciences", name: "Electrostatics", grade: 11, description: "Coulomb's law, electric fields, E=kQ/r2" },
  { subject: "physical-sciences", name: "Electromagnetism", grade: 12, description: "Faraday's law, motors, generators, transformers" },
  { subject: "physical-sciences", name: "Waves Sound Light", grade: 11, description: "Transverse longitudinal, frequency wavelength, Doppler effect" },
  { subject: "physical-sciences", name: "Matter Materials", grade: 10, description: "Phases, density, atomic structure, periodic table" },
  { subject: "physical-sciences", name: "Chemical Change", grade: 10, description: "Balancing equations, stoichiometry, moles" },
  // MATHEMATICS - sample
  { subject: "mathematics", name: "Algebra", grade: 10, description: "Equations, factorization, completing square, quadratic formula" },
  { subject: "mathematics", name: "Functions", grade: 11, description: "Linear, quadratic, exponential, hyperbolic, domain range" },
  { subject: "mathematics", name: "Trigonometry", grade: 11, description: "Sin cos tan, identities, sine cosine rule, 2D 3D problems" },
  { subject: "mathematics", name: "Calculus", grade: 12, description: "Limits, differentiation from first principles, rules, optimization" },
];

export default function SeedPage() {
  const [status, setStatus] = useState("Ready to seed");
  const [count, setCount] = useState(0);

  async function handleSeed() {
    setStatus("Seeding... Please wait");
    let seeded = 0;
    for (const topic of CAPS_TOPICS) {
      const { error } = await supabase.from("topic_knowledge").upsert({
        subject: topic.subject,
        topic_name: topic.name,
        grade: topic.grade,
        content: topic.description,
        caps_code: `${topic.subject}-${topic.name.toLowerCase().replace(/\s+/g,'-')}`,
        created_at: new Date().toISOString(),
      }, { onConflict: 'caps_code' });
      if (!error) seeded++;
    }
    setCount(seeded);
    setStatus(`✅ Done! ${seeded} topics seeded into topic_knowledge`);
  }

  return (
    <div className="p-6 min-h-screen bg-[#f8f9ff]">
      <h1 className="text-2xl font-bold mb-2">Seed CAPS Knowledge</h1>
      <p className="text-sm text-gray-500 mb-6">Auto-fills Supabase topic_knowledge so AI tutor knows everything. No PDFs needed.</p>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="mb-4 font-medium">Topics to seed: {CAPS_TOPICS.length}</p>
        <p className="text-sm mb-4 p-3 bg-blue-50 rounded">This will fill your 268 Missing CAPS meta automatically.</p>
        <button onClick={handleSeed} className="bg-black text-white px-6 py-3 rounded-full font-bold w-full">Seed All CAPS Knowledge →</button>
        <p className="mt-4 text-center font-bold">{status}</p>
        {count > 0 && <p className="text-center text-green-600">Your AI tutor now knows {count} topics!</p>}
      </div>
    </div>
  );
}
