export default function Home() {
  return (
    <div style={{background:"#0b0b12", minHeight:"100vh", color:"white", padding:24, fontFamily:"system-ui"}}>
      <div style={{maxWidth:900, margin:"0 auto"}}>
        <h1 style={{fontSize:28, fontWeight:800}}>Matric360Learn</h1>
        <p style={{color:"#aaa", marginTop:8}}>CAPS Grade 12 • Physics & Maths</p>
        <div style={{marginTop:24, display:"grid", gap:12}}>
          <a href="/subjects/physical-sciences" style={{background:"#15151f", border:"1px solid #2a2a3a", borderRadius:16, padding:20, display:"block"}}>
            <div style={{fontWeight:700, fontSize:18}}>🧪 Physical Sciences</div>
            <div style={{color:"#888", fontSize:13, marginTop:4}}>Physics • Chemistry • Mechanics</div>
          </a>
          <a href="/subjects/mathematics" style={{background:"#15151f", border:"1px solid #2a2a3a", borderRadius:16, padding:20, display:"block"}}>
            <div style={{fontWeight:700, fontSize:18}}>📐 Mathematics</div>
            <div style={{color:"#888", fontSize:13, marginTop:4}}>Algebra • Calculus • Trigonometry</div>
          </a>
        </div>
        <div style={{marginTop:20, color:"#555", fontSize:12}}>Build: {new Date().toLocaleString()}</div>
      </div>
    </div>
  );
}
