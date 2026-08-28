// Matric360Learn - Easy Add Subjects Config
// TO ADD NEW SUBJECT: Just add 1 line to SUBJECTS below!

const SUBJECTS = [
  { id: "pure-maths", name: "Pure Maths", topics: 167, units: 13, color: "#FF6B00" },
  { id: "physical-sciences", name: "Physical Sciences", topics: 252, units: 11, color: "#25D366" },
  // ADD MORE EASILY: { id: "life-sciences", name: "Life Sciences", topics: 150, units: 8, color: "#6C5CE7" },
  // ADD MORE EASILY: { id: "geography", name: "Geography", topics: 120, units: 8, color: "#3498db" },
]

const PLANS = [
  { name: "1 Subject", m: "R149/m", y: "R1,490/yr", save: "Save R298", border: "#222", sub: "Pure Maths OR Physical Sciences" },
  { name: "2 Subjects", m: "R249/m", y: "R2,490/yr", save: "Save R498", border: "#25D366", pop: "POPULAR", sub: "Both Pure Maths + Physics" },
  { name: "Full Matric", m: "R349/m", y: "R3,490/yr", save: "Save R698", border: "#FF6B00", pop: "BEST VALUE", sub: "All future subjects included" },
]

export default function Home(){
return (
<div style={{fontFamily:'system-ui',background:'#0a0a0a',color:'#fff',minHeight:'100vh'}}>
<header style={{padding:'20px',display:'flex',justifyContent:'space-between',borderBottom:'1px solid #222',position:'sticky',top:0,background:'#0a0a0a',zIndex:10}}>
<b>Matric360Learn.co.za</b>
<a href="https://wa.me/27729888561?text=Hi%20I%20want%20to%20join%20Matric360" style={{background:'#25D366',color:'#000',padding:'8px 16px',borderRadius:'20px',textDecoration:'none',fontWeight:'bold',fontSize:'14px'}}>WhatsApp</a>
</header>

<div style={{textAlign:'center',padding:'60px 20px 30px'}}>
<h1 style={{fontSize:'42px',margin:'0 0 10px'}}>Pure Maths + Physical Sciences</h1>
<p style={{color:'#aaa',fontSize:'18px'}}>Start with 2 subjects. Add more in 10 seconds - 1 line config</p>
<div style={{marginTop:'20px',display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
{SUBJECTS.map(s=>(
<span key={s.id} style={{border:`1px solid ${s.color}`,padding:'8px 16px',borderRadius:'20px',fontSize:'14px',color:s.color}}>{s.name} • {s.topics} topics</span>
))}
</div>
<p style={{marginTop:'15px',color:'#666',fontSize:'13px'}}>Total CAPS Topics: {SUBJECTS.reduce((a,b)=>a+b.topics,0)} • Easy-add system active</p>
</div>

<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'20px',padding:'20px',maxWidth:'1100px',margin:'0 auto'}}>
{PLANS.map(p=>(
<div key={p.name} style={{border:`2px solid ${p.border}`,padding:'24px',borderRadius:'16px',textAlign:'center',background:'#111',position:'relative'}}>
{p.pop && <div style={{background:p.border,color:'#000',fontSize:'11px',padding:'4px 12px',borderRadius:'20px',position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',fontWeight:'bold'}}>{p.pop}</div>}
<h3 style={{margin:'10px 0 5px'}}>{p.name}</h3>
<p style={{fontSize:'12px',color:'#888',marginBottom:'10px'}}>{p.sub}</p>
<h2 style={{fontSize:'36px',margin:'10px 0'}}>{p.m}</h2>
<p style={{color:'#25D366',fontWeight:'bold',margin:'5px 0'}}>{p.y}</p>
<p style={{fontSize:'12px',color:'#666'}}>{p.save}</p>
<a href={`https://wa.me/27729888561?text=Hi%20Matric360%20I%20want%20${p.name}%20${p.m}`} style={{display:'block',marginTop:'20px',background:'#fff',color:'#000',padding:'12px',borderRadius:'8px',textDecoration:'none',fontWeight:'bold'}}>Choose {p.name}</a>
</div>
))}
</div>

<div style={{textAlign:'center',padding:'40px 20px',color:'#555',fontSize:'12px',maxWidth:'700px',margin:'0 auto'}}>
<p>HOW TO ADD A NEW SUBJECT (10 sec): Open app/page.tsx → Go to SUBJECTS array at top → Add new line: {`{ id: "life-sciences", name: "Life Sciences", topics: 150 }`} → Commit. Auto appears everywhere.</p>
</div>
</div>
)
}
