"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProgressPage(){
  const router = useRouter();
  const [loading,setLoading] = useState(true);
  const [stats,setStats] = useState({
    masteryWeighted: 0,
    curriculumPct: 0,
    done: 0,
    total: 0,
    mathsPct: 0,
    physicsPct: 0,
    milestones: [] as string[],
    quizzes: [] as {label:string, score:string}[]
  });

  useEffect(()=>{
    (async()=>{
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if(!user){ setLoading(false); return; }

      // 1. Get total learning nodes from your real table
      const { count: totalCount } = await supabase.from("lesson_nodes").select("id", {count:"exact", head:true});
      const total = totalCount || 0;

      // 2. Get user's progress
      const { data: progress } = await supabase.from("user_lesson_progress").select("*").eq("user_id", user.id);
      const lessons = progress || [];

      // 3. Get user's quizzes
      const { data: quizData } = await supabase.from("user_quiz_attempts").select("*").eq("user_id", user.id).order("created_at", {ascending:false}).limit(5);
      const quizzesRaw = quizData || [];

      const done = lessons.filter((l:any)=>l.completed).length;
      const curriculumPct = total ? Math.round((done/total)*100) : 0;

      const avgMastery = lessons.length ? Math.round(lessons.reduce((a:any,b:any)=>a+(b.mastery_score||0),0)/lessons.length) : 0;
      const quizAvg = quizzesRaw.length ? Math.round((quizzesRaw.reduce((a:any,b:any)=>a+(b.score/(b.total||1)),0)/quizzesRaw.length)*100) : 0;
      const masteryWeighted = lessons.length || quizzesRaw.length ? Math.round(avgMastery*0.6 + quizAvg*0.4) : 0;

      const maths = lessons.filter((l:any)=>l.subject_slug==='mathematics');
      const physics = lessons.filter((l:any)=>l.subject_slug==='physical-sciences' || l.subject_slug==='physical_sciences');
      const mathsPct = maths.length ? Math.round(maths.reduce((a:any,b:any)=>a+(b.mastery_score||0),0)/maths.length) : 0;
      const physicsPct = physics.length ? Math.round(physics.reduce((a:any,b:any)=>a+(b.mastery_score||0),0)/physics.length) : 0;

      const m: string[] = [];
      if(done>=1) m.push("First lesson");
      if(quizzesRaw.length>=1 || done>=2) m.push("First streak");
      if(mathsPct>=80 || physicsPct>=80 || avgMastery>=80) m.push("First mastery");
      if(done>=7) m.push("7-day streak");

      const quizzes = quizzesRaw.map((q:any)=>({
        label: `Practice session · ${new Date(q.created_at).toLocaleDateString('en-GB')}`,
        score: `${q.score}/${q.total}`
      }));

      setStats({
        masteryWeighted,
        curriculumPct,
        done,
        total,
        mathsPct,
        physicsPct,
        milestones: m,
        quizzes
      });
      setLoading(false);
    })();
  },[]);

  if(loading) return <div style={{padding:20,color:"white"}}>Loading progress...</div>;
  
  return(
    <div style={{padding:"8px 8px 90px"}}>
      <div style={{fontSize:26,fontWeight:900}}>Your progress</div>

      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"18px",marginTop:16}}>
        <div style={{fontSize:13,color:"#9ca3af"}}>Mastery-weighted progress</div>
        <div style={{fontSize:36,fontWeight:900,marginTop:6}}>{stats.masteryWeighted}%</div>
        <div style={{height:8,background:"#2a2d4a",borderRadius:999,marginTop:12,overflow:"hidden"}}>
          <div style={{width:`${stats.masteryWeighted}%`,height:"100%",background:"#7c7cff"}}></div>
        </div>
        <div style={{fontSize:12,color:"#9ca3af",marginTop:10,lineHeight:1.4}}>Based on quiz scores and lesson mastery, not just lessons opened.</div>
      </div>

      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"18px",marginTop:14}}>
        <div style={{fontSize:13,color:"#9ca3af"}}>Curriculum completion</div>
        <div style={{fontSize:36,fontWeight:900,marginTop:6}}>{stats.curriculumPct}%</div>
        <div style={{height:8,background:"#2a2d4a",borderRadius:999,marginTop:12,overflow:"hidden"}}>
          <div style={{width:`${stats.curriculumPct}%`,height:"100%",background:"#6b7280"}}></div>
        </div>
        <div style={{fontSize:12,color:"#9ca3af",marginTop:10}}>{stats.done} of {stats.total} learning nodes complete</div>
      </div>

      <div style={{fontSize:14,fontWeight:700,color:"#9ca3af",marginTop:18,marginBottom:8}}>Mastery by subject</div>

      <div onClick={()=>router.push("/subjects/mathematics")} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:18,padding:"14px",marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",gap:8}}>
          <div style={{fontWeight:800,whiteSpace:"nowrap"}}>Mathematics</div>
          <div style={{fontSize:13,color:"#9ca3af"}}>You are {stats.mathsPct}% through Grade 12 Mathematics (based on mastery)</div>
        </div>
        <div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:12}}><div style={{width:`${stats.mathsPct}%`,height:"100%",background:"#7c7cff"}}></div></div>
      </div>

      <div onClick={()=>router.push("/subjects/physical-sciences")} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:18,padding:"14px",marginBottom:14,cursor:"pointer"}}>
        <div style={{display:"flex",gap:8}}>
          <div style={{fontWeight:800,whiteSpace:"nowrap"}}>Physical<br/>Sciences</div>
          <div style={{fontSize:13,color:"#9ca3af"}}>You are {stats.physicsPct}% through Grade 12 Physical Sciences (based on mastery)</div>
        </div>
        <div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:12}}><div style={{width:`${stats.physicsPct}%`,height:"100%",background:"#7c7cff"}}></div></div>
      </div>

      <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:22,padding:"16px",marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:800,display:"flex",gap:8}}><span>🏅</span> Milestones</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>{stats.milestones.length} earned</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {stats.milestones.length===0 && <div style={{color:"#6b7280",fontSize:12,gridColumn:"1 / span 2"}}>No milestones yet — complete your first lesson!</div>}
          {stats.milestones.includes("First lesson") && <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span>📖</span> First lesson</div>}
          {stats.milestones.includes("First streak") && <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span>🔥</span> First streak</div>}
          {stats.milestones.includes("First mastery") && <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span>⭐</span> First mastery</div>}
          {stats.milestones.includes("7-day streak") && <div style={{border:"1px solid #2a2d4a",borderRadius:999,padding:"8px 12px",fontSize:12,display:"flex",gap:6}}><span>🔥</span> 7-day streak</div>}
        </div>
      </div>

      <div style={{fontSize:14,fontWeight:700,color:"#9ca3af",marginBottom:8}}>Recent quizzes</div>

      {stats.quizzes.length===0 ? (
        <div style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:"14px",color:"#6b7280",fontSize:13}}>No quizzes yet — take a practice quiz to see it here.</div>
      ) : (
        stats.quizzes.map((q,i)=>(
          <div key={i} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:999,padding:"14px 16px",display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <div style={{fontSize:13}}>{q.label}</div>
            <div style={{fontWeight:700,fontSize:14}}>{q.score}</div>
          </div>
        ))
      )}
    </div>
  );
}
