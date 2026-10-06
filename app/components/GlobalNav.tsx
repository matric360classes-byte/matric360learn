"use client";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../lib/subjects";

const NODES = [
  { id: "notes", label: "Notes", path: "" }, // default /topicId
  { id: "video", label: "Video Lesson", path: "?node=video" },
  { id: "practice", label: "Practice", path: "?node=practice" },
  { id: "exam", label: "Exam Challenge", path: "?node=exam" },
  { id: "summary", label: "Summary", path: "?node=summary" },
];

const norm = (s:string)=> (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");

export default function GlobalNav(){
 const params = useParams() as any;
 const pathname = usePathname();
 const search = useSearchParams();
 const router = useRouter();

 let sid = params?.id as string;
 if(sid==="physical-science") sid="physical-sciences";
 const uid = params?.unitId as string;
 const tid = params?.topicId as string;
 const nodeIdFromPath = params?.nodeId as string; // if you use /[nodeId] route
 const nodeParam = search.get("node") || nodeIdFromPath || "notes";

 if(!sid) return null;
 if(pathname==="/subjects") return null;

 const subj = (SUBJECTS_DATA as any)[sid];
 const units = subj?.sections?.flatMap((s:any)=>s.units) || [];
 const unitIndex = units.findIndex((u:any)=>u.id===uid);
 const unit = units[unitIndex];
 const topics = unit?.topics || [];
 const topicIndex = topics.findIndex((t:any)=>t.id===tid);
 const nodeIndex = NODES.findIndex(n=>n.id===nodeParam);
 const curNode = NODES[nodeIndex] || NODES[0];

 // BACK LOGIC
 let backHref = "/subjects";
 let backLabel = "Subjects";
 if(sid &&!uid) { backHref="/subjects"; backLabel="Subjects"; }
 if(uid &&!tid){ backHref=`/subjects/${sid}`; backLabel=subj?.name || "Back"; }
 if(uid && tid){
   if(nodeIndex>0){ backHref=`/subjects/${sid}/${uid}/${tid}${NODES[nodeIndex-1].path}`; backLabel=`← ${NODES[nodeIndex-1].label}`; }
   else { backHref=`/subjects/${sid}/${uid}`; backLabel=unit?.title?.slice(0,20) || "Back to Unit"; }
 }

 // NEXT / PREV LOGIC
 let prevLink: string | null = null; let prevLabel = "";
 let nextLink: string | null = null; let nextLabel = "";
 let isFinishTopic = false;

 if(uid && tid){
   // INSIDE NODES
   if(nodeIndex > 0){
     prevLink = `/subjects/${sid}/${uid}/${tid}${NODES[nodeIndex-1].path}`;
     prevLabel = `← ${NODES[nodeIndex-1].label}`;
   } else {
     // first node -> prev topic
     if(topicIndex>0){ prevLink = `/subjects/${sid}/${uid}/${topics[topicIndex-1].id}`; prevLabel = "← Prev Topic"; }
   }

   if(nodeIndex < NODES.length-1){
     nextLink = `/subjects/${sid}/${uid}/${tid}${NODES[nodeIndex+1].path}`;
     nextLabel = `${NODES[nodeIndex+1].label} →`;
   } else {
     // Last Node -> Finish Topic -> Next Topic
     if(topicIndex < topics.length-1){
       nextLink = `/subjects/${sid}/${uid}/${topics[topicIndex+1].id}`;
       nextLabel = "Next Topic →";
       isFinishTopic = true;
     } else {
       nextLink = `/subjects/${sid}`;
       nextLabel = "Finish Unit ✓";
       isFinishTopic = true;
     }
   }
 } else if(uid &&!tid){
   // Unit level
   if(unitIndex>0){ prevLink=`/subjects/${sid}/${units[unitIndex-1].id}`; prevLabel="← Prev Unit"; }
   if(unitIndex < units.length-1){ nextLink=`/subjects/${sid}/${units[unitIndex+1].id}`; nextLabel="Next Unit →"; }
 }

 return (
  <>
   <div style={{position:"sticky", top:0, zIndex:50, background:"rgba(14,15,26,0.95)", backdropFilter:"blur(10px)", borderBottom:"1px solid #1f223a", padding:"10px 16px", display:"flex", alignItems:"center", gap:10}}>
    <button onClick={()=>router.push(backHref)} style={{background:"#1a1c2e", border:"1px solid #2a2d4a", color:"#fff", padding:"8px 14px", borderRadius:12, fontSize:13, fontWeight:700}}>← {backLabel}</button>
    <div style={{marginLeft:"auto", display:"flex", gap:6, alignItems:"center"}}>
      {uid && tid && (
        <div style={{display:"flex", gap:4}}>
          {NODES.map((n,i)=>(
            <div key={n.id} style={{width:22, height:4, borderRadius:10, background: i<=nodeIndex? "#3a5bff" : "#252a44"}} />
          ))}
        </div>
      )}
      <div style={{fontSize:11, color:"#6b7280", marginLeft:8}}>{tid? `${curNode.label} • ${topicIndex+1}/${topics.length}` : uid? `Unit ${unitIndex+1}/${units.length}` : ""}</div>
    </div>
   </div>

   {(prevLink || nextLink) && (
    <div style={{position:"fixed", bottom:0, left:0, right:0, zIndex:60, background:"rgba(14,15,26,0.98)", borderTop:"1px solid #1f223a", padding:"12px 12px 22px", display:"flex", gap:10}}>
     {prevLink? <Link href={prevLink} style={{flex:1, textDecoration:"none", background:"#1a1c2e", border:"1px solid #2a2d4a", padding:"14px", borderRadius:16, color:"#9aa0b6", textAlign:"center", fontWeight:700, fontSize:13}}>{prevLabel}</Link> : <div style={{flex:1}}/>}
     {nextLink? <Link href={nextLink} style={{flex:1, textDecoration:"none", background: isFinishTopic? "#0f2a1e" : "#3a5bff", border: isFinishTopic? "1px solid #14532d" : "none", padding:"14px", borderRadius:16, color: isFinishTopic? "#4ade80" : "#fff", textAlign:"center", fontWeight:800, fontSize:13}}>{nextLabel}</Link> : null}
    </div>
   )}
  </>
 )
}
