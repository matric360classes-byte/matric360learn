"use client";
import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const MTG: Record<string, Record<string, string[]>> = {
 Mathematics: {
  "Unit 1: Exponents and surds": ["The number system","Working with irrational numbers","Exponents","Exponential equations","Equations with rational exponents","Exam type examples"],
  "Unit 2: Algebra": ["Algebraic expressions","Addition and subtraction","Multiplication and division","Factorising","Notes on factorising a trinomial","Quadratic equations","Quadratic inequalities","Simultaneous equations","The nature of the roots"],
  "Unit 3: Number patterns, sequences and series": ["Number patterns","Arithmetic sequences","Quadratic sequences","Geometric sequences","Arithmetic and geometric series","Sigma notation"],
  "Unit 4: Functions": ["What is a function?","Function notation","The basic functions, formulas and graphs","Inverse functions","The logarithmic function","Transformation of functions"],
  "Unit 5: Trig functions": ["Graphs of trigonometric functions","The effect of a on amplitude","The effect of q on vertical shift","The effect of b on period","The effect of p on horizontal shift"],
  "Unit 6: Finance, growth and decay": ["Simple and compound interest","Calculating P, i and n","Simple and compound decay","Nominal and effective interest rates","Investments with time and interest rate changes","Annuities","Future Value Annuity","Present Value","Future Value"],
  "Unit 7: Calculus": ["Average gradient","Average rate of change","Derivative of a function at a point","Uses of the derivative","Drawing graph of cubic polynomial","First principles","Rules of differentiation","Tangent to curve","Maxima and minima","Calculus"],
  "Unit 8: Probability": ["Theoretical probability","Venn diagrams","Mutually exclusive events","Complementary events","Tree diagrams","Contingency tables","Counting principles","Permutations","Combinations","Fundamental counting principle"],
  "Unit 9: Analytical Geometry": ["Analytical Geometry","The equation of a line","The inclination of a line","Circles in analytical geometry","Distance and midpoint formula"],
  "Unit 10: Trigonometry": ["Trig ratios","Trig ratios in all quadrants","Trig ratios of special angles","Reduction formulae","Trigonometric identities","Solving trigonometric equations","Compound and double angle identities","Co-functions"],
  "Unit 11: Trigonometry - Sine, cosine and area rules": ["Right-angled triangles","Area rule","Sine rule","Cosine rule","Problems in two and three dimensions","2D and 3D Problems"],
  "Unit 12: Euclidean Geometry": ["Proportion and area of triangles","Proportion theorems","Similar polygons","Circle theorems","Cyclic quadrilaterals","Similarity and proportionality","Midpoint Theorem","Tangent chord theorem"],
  "Unit 13: Statistics": ["Bar graphs and frequency tables","Measures of central tendency","Measures of dispersion","Five number summary and box and whisker plot","Histograms and frequency polygons","Cumulative frequency and ogives","Variance and standard deviation","Bivariate data and scatter plot","Linear regression line","Correlation coefficient","Quartiles"],
 },
 "Physical Sciences": {
  "Unit 1: Mechanics - Force and Newtons Laws": ["Vectors","Force","Force diagrams","Resultant net force","Newtons First Law","Newtons Second Law","Newtons Third Law","Universal Gravitation","Mass and weight","Velocity and acceleration"],
  "Unit 2: Momentum and impulse": ["Momentum","Change in momentum","Impulse","Conservation of linear momentum","Elastic and inelastic collisions"],
  "Unit 3: Vertical projectile motion in 1D": ["Graphs of velocity","Free fall","Dropping a projectile","Projectile shot up then falls","Bouncing ball","Projectile motion"],
  "Unit 4: Work, energy and power": ["Work","Energy","Power","Work-energy theorem","Conservation of energy"],
  "Unit 5: Doppler Effect": ["Waves","Doppler Effect","Ultrasound waves","Redshift and blueshift","Applications with light"],
  "Unit 6: Electrostatics": ["Electrical charge","Conservation of Charge","Coulombs Law","Electric fields","Electric field strength"],
  "Unit 7: Electric circuits": ["Resistance of a wire","Ohms Law","Voltage and emf","Internal Resistance","Electric energy","Power","Electric circuits"],
  "Unit 8: Electrodynamics - Electrical machines": ["Motors and generators","Alternating current","AC and DC","Electrical machines"],
  "Unit 9: Optical phenomena and properties of materials": ["Electromagnetic waves","Visible light","Photoelectric effect","Optical phenomena"],
  "Unit 10: Emission and absorption spectra": ["Continuous emission spectra","Atomic emission spectra","Atomic absorption spectra"],
  "Unit 11: Organic compounds and macromolecules": ["Organic compounds","Physical properties and structure","IUPAC Naming","Homologous series","Reactions of organic compounds","Plastics and polymers","Plastics and pollution"],
  "Unit 12: Rate and extent of reactions": ["Energy changes","Activation energy","Catalysts","ΔH","Endothermic and exothermic","Rates of reactions","Collision Theory","Measuring rates"],
  "Unit 13: Chemical equilibrium": ["Le Chateliers Principle","Equilibrium Constant Kc","Chemical equilibrium","Factors that influence equilibrium","Graphs for chemical systems"],
  "Unit 14: Acids and bases": ["Properties of acids and bases","Conjugate acid-base pairs","Ampholyte","Salt hydrolysis","Acid-base indicators","Acid-base titrations","Ka and Kb","Kw","pH scale","pH Calculations","Titration calculations"],
  "Unit 15: Electrochemistry": ["Electrochemical cells","Electrolytic cells","Voltaic Galvanic cells","Cell notation","Standard electrode potentials","Emf of electrochemical cell"],
  "Unit 16: The chlor-alkali industry": ["Chlor-alkali industry","Chlor-alkali reactants and products","Industrial process"],
 }
};

export default function AdminVideosPage(){
  const [subject,setSubject]=useState<string>("Physical Sciences");
  const [unit,setUnit]=useState<string>("");
  const [topic,setTopic]=useState<string>("");
  const [title,setTitle]=useState<string>("");
  const [youtubeUrl,setYoutubeUrl]=useState<string>("");
  const [description,setDescription]=useState<string>("");
  const [loading,setLoading]=useState<boolean>(false);
  const [videos,setVideos]=useState<any[]>([]);

  const units = useMemo(()=>Object.keys(MTG[subject]||{}),[subject]);
  const topics = useMemo(()=>MTG[subject]?.[unit]||[],[subject,unit]);
  const ytId = useMemo(()=>youtubeUrl.match(/(?:youtu\.be\/|v=)([^&?]+)/)?.[1] || "",[youtubeUrl]);

  const fetchVideos = async ()=>{
    const { data } = await supabase.from("videos").select("*").order("created_at",{ascending:false}).limit(20);
    if(data) setVideos(data);
  };
  useEffect(()=>{ fetchVideos(); },[]);

  const handleSave = async ()=>{
    if(!unit ||!topic ||!title ||!youtubeUrl){ alert("Fill Subject, Unit, Topic, Title, YouTube"); return; }
    setLoading(true);
    const { error } = await supabase.from("videos").insert({
      youtube_id: ytId,
      youtube_url: youtubeUrl,
      subject: subject.toLowerCase().replace(/\s+/g,"-"),
      caps_code: unit,
      topic: topic,
      title: title,
      description: description || null,
      status: "Ready",
      is_premium: false,
      order_index: 0,
      thumbnail_url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    });
    setLoading(false);
    if(error) alert(error.message);
    else { alert("Saved! "+title); setTitle(""); setYoutubeUrl(""); setDescription(""); fetchVideos(); }
  };

  const handleDelete = async (id:string)=>{
    if(!confirm("Delete video?")) return;
    await supabase.from("videos").delete().eq("id",id);
    fetchVideos();
  };

  return(
    <div style={{background:"#0a0a12",minHeight:"100vh",color:"white",padding:16, paddingBottom:100}}>
      <h1 style={{fontWeight:800,fontSize:22}}>Admin - Add Video</h1>
      <p style={{color:"#9ca3af",fontSize:12, marginBottom:12}}>MTG Units: {subject==="Physical Sciences"?16:13} | Same as Practice • Preview restored</p>

      <select value={subject} onChange={(e)=>{setSubject(e.target.value); setUnit(""); setTopic("");}} style={{width:"100%",padding:12,borderRadius:12,background:"#15151f",color:"white",border:"1px solid #222"}}>
        {Object.keys(MTG).map((s:string)=><option key={s} value={s}>{s}</option>)}
      </select>

      <select value={unit} onChange={(e)=>{setUnit(e.target.value); setTopic("");}} style={{marginTop:10,width:"100%",padding:12,borderRadius:12,background:"#15151f",color:"white",border:"1px solid #222"}}>
        <option value="">Select Unit... ({units.length})</option>
        {units.map((u:string)=><option key={u} value={u}>{u}</option>)}
      </select>

      <select value={topic} onChange={(e)=>setTopic(e.target.value)} style={{marginTop:10,width:"100%",padding:12,borderRadius:12,background:"#15151f",color:"white",border:"1px solid #222"}}>
        <option value="">Select Topic... ({topics.length})</option>
        {topics.map((t:string)=><option key={t} value={t}>{t}</option>)}
      </select>

      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Video title e.g. Power - Work Energy Theorem" style={{marginTop:10,width:"100%",padding:12,borderRadius:12,background:"#15151f",color:"white",border:"1px solid #222"}}/>
      <input value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.target.value)} placeholder="YouTube URL https://youtu.be/..." style={{marginTop:10,width:"100%",padding:12,borderRadius:12,background:"#15151f",color:"white",border:"1px solid #222"}}/>
      <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description (optional)" style={{marginTop:10,width:"100%",padding:12,borderRadius:12,background:"#15151f",color:"white",border:"1px solid #222", minHeight:70}}/>

      {/* PREVIEW RESTORED */}
      {ytId && (
        <div style={{marginTop:16, background:"#15151f", borderRadius:16, padding:12, border:"1px solid #222"}}>
          <p style={{fontSize:12, color:"#9ca3af", marginBottom:8}}>Preview</p>
          <div style={{aspectRatio:"16/9", background:"black", borderRadius:12, overflow:"hidden"}}>
            <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} style={{width:"100%", height:"100%", objectFit:"cover"}} alt="thumb"/>
          </div>
          <div style={{marginTop:10, fontSize:13}}>
            <p style={{fontWeight:700}}>{title || "Untitled video"}</p>
            <p style={{color:"#9ca3af", fontSize:11, marginTop:4}}>{subject} • {unit} • {topic}</p>
            <p style={{color:"#6b7280", fontSize:11, marginTop:4}}>youtube_id: {ytId}</p>
          </div>
          <div style={{marginTop:10}}>
            <iframe width="100%" height="180" src={`https://www.youtube.com/embed/${ytId}`} style={{borderRadius:12, border:0}} allowFullScreen />
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={loading} style={{marginTop:16,width:"100%",padding:14,borderRadius:12,background:"#818cf8",color:"black",fontWeight:800}}>{loading?"Saving...":"Save Video"}</button>

      {/* LIST RESTORED */}
      <div style={{marginTop:28}}>
        <h2 style={{fontWeight:700, fontSize:16}}>Recent Videos ({videos.length})</h2>
        {videos.map((v:any)=>(
          <div key={v.id} style={{marginTop:10, background:"#11111a", padding:12, borderRadius:12, border:"1px solid #1f1f2a", display:"flex", gap:10}}>
            <img src={v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} style={{width:80, height:50, borderRadius:8, objectFit:"cover"}}/>
            <div style={{flex:1}}>
              <p style={{fontSize:13, fontWeight:600}}>{v.title}</p>
              <p style={{fontSize:11, color:"#9ca3af"}}>{v.caps_code} • {v.topic}</p>
              <p style={{fontSize:10, color:"#6b7280"}}>{v.subject}</p>
            </div>
            <button onClick={()=>handleDelete(v.id)} style={{color:"#ef4444", fontSize:12}}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
