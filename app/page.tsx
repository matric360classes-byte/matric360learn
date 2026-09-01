export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e14] text-white">
      {/* NAV */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          <span className="font-black text-[18px]">Matric<span className="text-[#7c6cff]">3</span><span className="text-[#f7c948]">60</span></span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/login" className="text-sm text-[#a1a3b8] hover:text-white">Login</a>
          <a href="/login" className="bg-[#fde8b0] text-black text-sm font-bold px-4 py-2 rounded-full">Start Free</a>
        </div>
      </header>

      {/* HERO - DESKTOP SPLIT */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] tracking-widest text-[#a1a3b8] mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span> CAPS-Aligned · Grade 12
          </div>
          <h1 className="text-[32px] lg:text-[56px] font-black leading-[0.95] tracking-tight">
            Master Grade 12<br/>
            Maths & Physical<br/>
            Sciences with<br/>
            <span className="bg-gradient-to-r from-[#2dd4ff] to-[#a78bfa] bg-clip-text text-transparent">Confidence</span>
          </h1>
          <p className="mt-5 text-[#8b8da3] text-[15px] lg:text-[16px] max-w-[440px] leading-relaxed">
            Start with CAPS-aligned Grade 12 lessons and build progress step by step.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a href="/login" className="bg-[#f7c948] text-black font-extrabold px-6 py-3 rounded-full text-sm text-center">
              ✨ Start Studying Free
            </a>
            <a href="#how" className="bg-[#1e1e2e] text-white font-bold px-6 py-3 rounded-full text-sm text-center border border-[#2a2a3e]">
              ▷ See How It Works
            </a>
          </div>
        </div>

        {/* RIGHT - DASHBOARD CARD */}
        <div className="lg:justify-self-end w-full lg:w-[380px]">
          <div className="bg-[#1a1a28] border border-[#2a2a3e] rounded-[20px] p-5 shadow-2xl">
            <div className="flex justify-between text-[11px] text-[#8b8da3] mb-4">
              <span>Dashboard</span>
              <span className="text-[#f7c948]">🔥 5 day streak</span>
            </div>
            <div className="bg-[#24243a] rounded-xl p-4 mb-4">
              <div className="text-[11px] text-[#8b8da3]">Exam Readiness</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-black text-[#2ee89e]">75%</span>
                <span className="text-[11px] text-[#8b8da3]">On track</span>
              </div>
              <div className="h-1.5 bg-[#0e0e14] rounded-full mt-2"><div className="h-full w-[75%] bg-gradient-to-r from-[#2dd4ff] to-[#a78bfa] rounded-full"></div></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#24243a] rounded-xl p-3">
                <div className="text-[10px] text-[#8b8da3]">LEVEL</div>
                <div className="font-black">12</div>
                <div className="text-[10px] text-[#2ee89e]">+240 XP today</div>
              </div>
              <div className="bg-[#24243a] rounded-xl p-3">
                <div className="text-[10px] text-[#8b8da3]">GOAL</div>
                <div className="font-black">100 XP</div>
                <div className="text-[10px] text-[#2ee89e]">Almost there</div>
              </div>
            </div>
            <div className="bg-[#24243a] rounded-xl p-3 mb-3">
              <div className="text-[10px] text-[#2dd4ff]">✨ RECOMMENDED</div>
              <div className="text-[13px] font-bold">Calculus - Paper 1 Prep</div>
              <div className="text-[11px] text-[#8b8da3]">5 lessons · 12 min</div>
            </div>
            <div className="bg-[#2a2420] border border-[#3a3228] rounded-xl p-3">
              <div className="text-[11px]">🔥 Daily streak</div>
              <div className="text-[11px] text-[#8b8da3]">Keep your streak alive — complete one lesson today.</div>
            </div>
          </div>
        </div>
      </main>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-[22px] font-black">See how Matric360 works</h2>
        <p className="text-[13px] text-[#8b8da3] max-w-[600px] mx-auto mt-2">A quick tour of daily practice, past papers, mock exams and progress tracking — everything Grade 12 learners need to master the CAPS curriculum.</p>
      </section>
    </div>
  )
}
