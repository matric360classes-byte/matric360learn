"use client";
import { useState } from "react";
import { buildNodesForTopic } from "@/lib/nodeFactory";

export default function Page({ params }: any) {
  const subjectId = params.id; // mathematics or physical-sciences
  const topicId = params.topicId;

  const lesson = buildNodesForTopic(topicId, subjectId);

  if (!lesson) {
    return <div style={{padding:20}}>No lesson for {topicId} in {subjectId} — check ID</div>;
  }

  const NODES = lesson.nodes;
  const [active, setActive] = useState(0);
  const node = NODES[active];

  return (
    <div style={{padding:16}}>
      <h2>{lesson.title}</h2>
      <p>{lesson.unit} - {lesson.section}</p>

      <div style={{display:"flex", gap:8, overflowX:"auto", margin:"12px 0"}}>
        {NODES.map((n:any, i:number) => (
          <button key={n.id} onClick={()=>setActive(i)}
            style={{padding:"8px 12px", background: i===active?"black":"#eee", color:i===active?"white":"black", borderRadius:8}}>
            {n.id}: {n.label}
          </button>
        ))}
      </div>

      <div style={{border:"1px solid #ddd", borderRadius:12, padding:16}}>
        <h3>{node.label} - {node.sub}</h3>
        <pre style={{whiteSpace:"pre-wrap", fontFamily:"inherit"}}>
          {JSON.stringify(node.content, null, 2)}
        </pre>
      </div>
    </div>
  );
}
