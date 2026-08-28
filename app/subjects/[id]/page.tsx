import { SUBJECTS_DATA } from "@/lib/subjects"
export default function Page({params}:{params:{id:string}}){
const s=SUBJECTS_DATA[params.id]
if(!s) return <div>Not found</div>
return <div style={{background:"#000",color:"#fff",minHeight:"100vh",padding:"20px"}}>
<h1>{s.name} - {s.units.length} Units</h1>
{s.units.map((u:any,i:number)=><div key={i} style={{border:"1px solid #222",padding:"15px",margin:"10px 0",borderRadius:"12px",background:"#111"}}><b>{u.title}</b><p style={{color:"#aaa",fontSize:"13px"}}>{u.topics.join(" • ")}</p></div>)}
</div>
}
