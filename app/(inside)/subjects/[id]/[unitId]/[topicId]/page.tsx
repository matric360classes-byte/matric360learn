"use client";
import { useState } from "react";
import { buildNodesForTopic } from "@/lib/nodeFactory";

export default function Page({ params }: any) {
  const subjectId = params.id as string;
  const topicId = params.topicId as string;

  // use any to bypass type checks
  const lesson: any = buildNodesForTopic(topicId, subjectId);

  if (!lesson) {
    return <div style={{padding:20}}>No lesson for {topicId} in {subjectId}</div>;
  }

  const NODES: any[] = lesson.nodes;
  const [active, setActive] = useState(0);
  const node: any = NODES[active];
  const payload: any = node.content || node.data || node;

  return (
    <div style={{padding:16}}>
      <h2>{lesson.title || topicId}</h2>
      <p>{subjectId} / {params.unitId} / {topicId}</p>

      <div style={{display:"flex", gap:8, overflowX:"auto", margin:"12px 0"}}>
        {NODES.map((n:any, i:number) => (
          <button key={n.id || i} onClick={()=>setActive(i)}
            style={{padding:"8px 12px", background: i===active?"black":"#eee", color:i===active?"white":"black", borderRadius:8}}>
            {n.id}: {n.label || n.title}
          </button>
        ))}
      </div>

      <div style={{border:"1px solid #ddd", borderRadius:12, padding:16}}>
        <h3>{node.label || node.title} - {node.sub || ""}</h3>
        <pre style={{whiteSpace:"pre-wrap", fontFamily:"inherit", fontSize:14}}>
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
