"use client";
import { useState } from "react";

const CAPS_TOPICS = [
  { subject: "physical-sciences", name: "Newton's Laws", grade: 11, content: "Newton's 1st, 2nd, 3rd laws, F=ma" },
];

export default function SeedPage() {
  const [status, setStatus] = useState("Ready");
  const [debug, setDebug] = useState("");

  async function handleSeed() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setDebug(`URL: ${url ? 'Found ✅' : 'MISSING ❌'}\nKey: ${key ? 'Found ✅' : 'MISSING ❌'}`);

    if (!url || !key) {
      setStatus("❌ Vercel env keys missing!");
      return;
    }

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
          subject: "physical-sciences",
          topic_name: "Newton's Laws",
          grade: 11,
          content: "Test",
          caps_code: "physical-sciences-newtons-laws",
        })
      });
      const text = await res.text();
      setStatus(`Status: ${res.status} ${res.statusText}`);
      setDebug(prev => prev + `\n\nResponse: ${text}\n`);
      if (res.ok) setStatus(`✅ SUCCESS! 1 seeded! Status ${res.status}`);
    } catch (e: any) {
      setStatus("Fetch failed");
      setDebug(prev => prev + `\nError: ${e.message}`);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold">Seed DEBUG</h1>
      <button onClick={handleSeed} className="mt-4 bg-black text-white px-6 py-3 rounded-full w-full font-bold">Test Seed 1 Topic →</button>
      <p className="mt-4 font-bold">{status}</p>
      <pre className="mt-4 text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap">{debug}</pre>
      
      <div className="mt-6 text-sm">
        <p>If it says 401 or 403 → RLS still blocking. Run SQL again.</p>
        <p>If it says 404 → table doesn't exist.</p>
        <p>If URL MISSING → Add env in Vercel Settings.</p>
      </div>
    </div>
  );
}
