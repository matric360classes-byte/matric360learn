export default function Home(){
 return (
  <div style={{fontFamily:'system-ui',background:'#0a0a0a',color:'#fff',minHeight:'100vh'}}>
    <header style={{padding:'20px',display:'flex',justifyContent:'space-between',borderBottom:'1px solid #222'}}>
      <b>Matric360Learn.co.za</b>
      <a href="https://wa.me/27700000000" style={{background:'#25D366',color:'#000',padding:'8px 14px',borderRadius:'8px',textDecoration:'none',fontWeight:'bold'}}>WhatsApp</a>
    </header>

    <div style={{textAlign:'center',padding:'60px 20px'}}>
      <h1 style={{fontSize:'42px'}}>matric360learn.co.za is LIVE</h1>
      <p style={{color:'#aaa'}}>Easy-add subjects: 1 line config</p>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',padding:'20px',maxWidth:'1000px',margin:'0 auto'}}>
      
      <div style={{border:'1px solid #222',padding:'20px',borderRadius:'12px',textAlign:'center'}}>
        <h3>1 Subject</h3>
        <h2>R149/m</h2>
        <p style={{color:'#25D366'}}>R1,490/yr</p>
        <p style={{fontSize:'12px',color:'#666'}}>Save R298</p>
      </div>

      <div style={{border:'2px solid #25D366',padding:'20px',borderRadius:'12px',textAlign:'center',background:'#111'}}>
        <div style={{background:'#25D366',color:'#000',fontSize:'11px',padding:'3px 8px',borderRadius:'20px',display:'inline-block'}}>MOST POPULAR</div>
        <h3>2 Subjects</h3>
        <h2>R249/m</h2>
        <p style={{color:'#25D366'}}>R2,490/yr</p>
        <p style={{fontSize:'12px',color:'#666'}}>Save R498</p>
      </div>

      <div style={{border:'1px solid #222',padding:'20px',borderRadius:'12px',textAlign:'center'}}>
        <h3>3 Subjects</h3>
        <h2>R329/m</h2>
        <p style={{color:'#25D366'}}>R3,290/yr</p>
        <p style={{fontSize:'12px',color:'#666'}}>Save R658</p>
      </div>

      <div style={{border:'1px solid #222',padding:'20px',borderRadius:'12px',textAlign:'center'}}>
        <h3>4 Subjects</h3>
        <h2>R399/m</h2>
        <p style={{color:'#25D366'}}>R3,990/yr</p>
        <p style={{fontSize:'12px',color:'#666'}}>Save R798</p>
      </div>

      <div style={{border:'1px solid #fff',padding:'20px',borderRadius:'12px',textAlign:'center'}}>
        <h3>All Subjects</h3>
        <h2>R499/m</h2>
        <p style={{color:'#25D366'}}>R4,990/yr</p>
        <p style={{fontSize:'12px',color:'#666'}}>Save R998 - Best Value</p>
      </div>

    </div>
  </div>
 )
}