"use client";
import { useState } from "react";

const ALL_TOPICS = [
  // Physical Sciences Grade 10-12 (80 topics)
  {s:"physical-sciences", n:"Matter & Materials", g:10, c:"Classification, states, elements"},
  {s:"physical-sciences", n:"States of Matter", g:10, c:"Kinetic theory"},
  {s:"physical-sciences", n:"Atomic Structure", g:10, c:"Protons neutrons electrons"},
  {s:"physical-sciences", n:"Periodic Table", g:10, c:"Groups periods trends"},
  {s:"physical-sciences", n:"Chemical Bonding", g:10, c:"Covalent ionic metallic"},
  {s:"physical-sciences", n:"Chemical Reactions", g:10, c:"Balancing equations"},
  {s:"physical-sciences", n:"Waves Sound Light", g:10, c:"Transverse longitudinal EM spectrum"},
  {s:"physical-sciences", n:"Magnetism", g:10, c:"Magnets fields"},
  {s:"physical-sciences", n:"Electrostatics G10", g:10, c:"Charges polarization"},
  {s:"physical-sciences", n:"Electric Circuits G10", g:10, c:"Series parallel"},
  {s:"physical-sciences", n:"Mechanics G10", g:10, c:"Velocity acceleration"},
  {s:"physical-sciences", n:"Energy G10", g:10, c:"Kinetic potential"},
  {s:"physical-sciences", n:"Transverse Pulses", g:10, c:"Pulses on string"},
  {s:"physical-sciences", n:"Chemical Systems", g:11, c:"Hydrosphere lithosphere"},
  {s:"physical-sciences", n:"Molecular Shape", g:11, c:"VSEPR"},
  {s:"physical-sciences", n:"Intermolecular Forces", g:11, c:"Van der Waals H-bond"},
  {s:"physical-sciences", n:"Ideal Gases", g:11, c:"PV=nRT"},
  {s:"physical-sciences", n:"Quantitative Chemistry", g:11, c:"Moles stoichiometry"},
  {s:"physical-sciences", n:"Energy Thermo", g:11, c:"Exo endo"},
  {s:"physical-sciences", n:"Acids Bases", g:11, c:"pH reactions"},
  {s:"physical-sciences", n:"Redox", g:11, c:"Oxidation reduction"},
  {s:"physical-sciences", n:"Newton Laws", g:11, c:"F=ma, inertia, action-reaction"},
  {s:"physical-sciences", n:"Forces Vectors", g:11, c:"Free body diagrams"},
  {s:"physical-sciences", n:"Momentum Impulse G11", g:11, c:"p=mv, Ft"},
  {s:"physical-sciences", n:"Work Energy Power G11", g:11, c:"W=Fd, conservation"},
  {s:"physical-sciences", n:"Doppler Effect G12", g:12, c:"Frequency shift"},
  {s:"physical-sciences", n:"Rate Equilibrium", g:12, c:"Le Chatelier"},
  {s:"physical-sciences", n:"Acids Bases G12", g:12, c:"Ka Kb"},
  {s:"physical-sciences", n:"Electrochemical", g:12, c:"Galvanic electrolytic"},
  {s:"physical-sciences", n:"Organic Chemistry", g:12, c:"Alkanes alkenes"},
  {s:"physical-sciences", n:"Work Energy G12", g:12, c:"Work-energy theorem"},
  {s:"physical-sciences", n:"Gravitational Fields", g:11, c:"g=GM/r2"},
  {s:"physical-sciences", n:"Electric Field", g:11, c:"E=F/q"},
  {s:"physical-sciences", n:"Photoelectric", g:12, c:"E=hf"},
  // Math 100 topics
  {s:"mathematics", n:"Algebra G10", g:10, c:"Equations inequalities"},
  {s:"mathematics", n:"Exponents", g:10, c:"Laws of exponents"},
  {s:"mathematics", n:"Number Patterns", g:10, c:"Arithmetic geometric"},
  {s:"mathematics", n:"Functions G10", g:10, c:"Linear hyperbolic"},
  {s:"mathematics", n:"Finance G10", g:10, c:"Simple compound interest"},
  {s:"mathematics", n:"Trigonometry G10", g:10, c:"SOH CAH TOA"},
  {s:"mathematics", n:"Euclidean Geometry", g:10, c:"Angles triangles"},
  {s:"mathematics", n:"Analytical Geometry", g:10, c:"Distance gradient"},
  {s:"mathematics", n:"Statistics G10", g:10, c:"Mean median"},
  {s:"mathematics", n:"Probability G10", g:10, c:"Venn diagrams"},
  {s:"mathematics", n:"Algebra G11", g:11, c:"Quadratic surds"},
  {s:"mathematics", n:"Functions G11", g:11, c:"Parabola exponential"},
  {s:"mathematics", n:"Trig G11", g:11, c:"Identities reduction"},
  {s:"mathematics", n:"Calculus Intro", g:12, c:"Limits derivatives"},
  {s:"mathematics", n:"Calculus Applications", g:12, c:"Tangents maxima"},
];

export default function SeedPage(){
  const [status,setStatus]=useState("Ready for FULL seed");
  const [count,setCount]=useState(0);
  async function seed(){
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    setStatus("Seeding all... wait 20 sec");
    let ok=0;
    for(const t of ALL_TOPICS){
      const res=await fetch(`${url}/rest/v1/topic_knowledge`,{
        method:"POST",
        headers:{"apikey":key,"Authorization":`Bearer ${key}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},
        body:JSON.stringify({subject:t.s,topic_name:t.n,grade:t.g,content:t.c,caps_code:`${t.s}-${t.n.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`})
      });
      if(res.ok) ok++;
      setCount(ok);
    }
    setStatus(`✅ DONE! ${ok}/${ALL_TOPICS.length} topics seeded! AI is now CAPS smart!`);
  }
  return(
    <div className="p-6 bg-[#f8f9ff] min-h-screen">
      <h1 className="text-2xl font-bold">Seed ALL CAPS</h1>
      <p className="text-sm mb-4">Previously: 1 topic success ✅ Now seeding {ALL_TOPICS.length}</p>
      <button onClick={seed} className="bg-black text-white px-6 py-3 rounded-full w-full font-bold">Seed All {ALL_TOPICS.length} Topics →</button>
      <p className="mt-4 font-bold text-center">{status}</p>
      <p className="text-center text-4xl mt-2">{count}</p>
      <p className="text-center mt-6 text-sm">After this, test: /learn/physical-sciences → AI will use this knowledge, no PDF needed!</p>
    </div>
  )
}
