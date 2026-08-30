export default function Page() {
  return (
    <div style={{background:"black", color:"white", padding:"20px", minHeight:"100vh"}}>
      <h1>Level 2 OK - FIXED</h1>
      <p>Time: {new Date().toString()}</p>
      <div style={{marginTop:"20px", background:"#222", padding:"15px", borderRadius:"10px"}}>
        <p>UNIT 1 - Number Patterns</p>
        <p>UNIT 2 - Functions</p>
        <p>UNIT 3 - Finance</p>
      </div>
      <a href="/" style={{color:"cyan", marginTop:"20px", display:"block"}}>← Home</a>
    </div>
  );
}
