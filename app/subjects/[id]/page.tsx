import { SUBJECTS_DATA } from "../../../lib/subjects"
export default function SubjectPage({ params }: { params: { id: string } }) {
  const s = SUBJECTS_DATA[params.id]
  if(!s) return <div style={{padding:40,color:'#fff',background:'#0a0a0a',minHeight:'100vh'}}>Subject not found</div>
  return (
    <div style={{fontFamily:'system-ui',background:'#0a0a0a',color:'#fff',minHeight:'100vh',padding:'20px'}}>
      <a href="/" style={{color:'#888',textDecoration:'none'}}>← Back</a>
      <div style={{maxWidth:'800px',margin:'40px auto'}}>
        <h1 style={{fontSize:'48px'}}>{s.name}</h1>
        <p style={{color:'#aaa'}}>{s.description} • {s.topics} topics</p>
        <a href={`https://wa.me/27729888561?text=I%20want%20${s.name}`} style={{display:'inline-block',margin:'20px 0',background:'#25D366',color:'#000',padding:'14px 28px',borderRadius:'30px',textDecoration:'none',fontWeight:'bold'}}>Enroll R149</a>
        {s.curriculum.map((u:any,i:number)=>(
          <div key={i} style={{border:'1px solid #222',borderRadius:'12px',padding:'20px',marginBottom:'12px',background:'#111'}}>
            <h3 style={{color:s.color}}>{u.unit}</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{u.topics.map((t:string)=><span key={t} style={{background:'#222',padding:'6px 12px',borderRadius:'20px',fontSize:'13px'}}>{t}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
