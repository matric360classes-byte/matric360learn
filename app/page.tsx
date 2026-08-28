import Link from "next/link"
const SUBJECTS = [
  { id:"pure-maths", name:"Pure Maths", topics:"167 topics", color:"#FF6B00" },
  { id:"physical-sciences", name:"Physical Sciences", topics:"252 topics", color:"#25D366" },
]
export default function Home(){
  return(
    <div style={{background:"#0a0a0a",color:"#fff",minHeight:"100vh",fontFamily:"system-ui"}}>
      <div style={{maxWidth:"1000px",margin:"0 auto",padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",padding:"20px 0"}}><b>Matric360Learn.co.za</b><a href="https://wa.me/27729888561" style={{background:"#25D366",color:"#000",padding:"8px 16px",borderRadius:"20px",textDecoration:"none",fontWeight:"bold",fontSize:"14px"}}>WhatsApp</a></div>
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <h1 style={{fontSize:"48px",fontWeight:"900",margin:0}}>Pure Maths + Physical Sciences</h1>
          <p style={{color:"#aaa",marginTop:"12px"}}>Start with 2 subjects. Add more in 10 seconds - 1 line config</p>
          <div style={{display:"flex",gap:"12px",justifyContent:"center",marginTop:"20px",flexWrap:"wrap"}}>
            {SUBJECTS.map(s=>(
              <Link key={s.id} href={`/subjects/${s.id}`} style={{border:`1px solid ${s.color}`,color:s.color,padding:"8px 16px",borderRadius:"20px",textDecoration:"none",fontSize:"14px",background:`${s.color}15`}}>
                {s.name} • {s.topics} →
              </Link>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"20px",marginTop:"20px"}}>
          <div style={{border:"1px solid #222",borderRadius:"16px",padding:"24px",textAlign:"center",background:"#111"}}><h3>1 Subject</h3><h2>R149/m</h2><a href="https://wa.me/27729888561" style={{display:"block",background:"#fff",color:"#000",padding:"12px",borderRadius:"8px",textDecoration:"none",fontWeight:"bold",marginTop:"12px"}}>Choose 1</a></div>
          <div style={{border:"2px solid #25D366",borderRadius:"16px",padding:"24px",textAlign:"center",background:"#111"}}><h3>2 Subjects</h3><h2>R249/m</h2><a href="https://wa.me/27729888561" style={{display:"block",background:"#fff",color:"#000",padding:"12px",borderRadius:"8px",textDecoration:"none",fontWeight:"bold",marginTop:"12px"}}>Choose 2</a></div>
          <div style={{border:"2px solid #FF6B00",borderRadius:"16px",padding:"24px",textAlign:"center",background:"#111"}}><h3>Full Matric</h3><h2>R349/m</h2><a href="https://wa.me/27729888561" style={{display:"block",background:"#fff",color:"#000",padding:"12px",borderRadius:"8px",textDecoration:"none",fontWeight:"bold",marginTop:"12px"}}>Choose Full</a></div>
        </div>
      </div>
    </div>
  )
}
}
