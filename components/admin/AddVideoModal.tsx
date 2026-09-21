"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function AddVideoModal({ capsTopicId, onClose }: { capsTopicId: string, onClose: () => void }) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [nodes, setNodes] = useState<any[]>([])
  const [selectedNode, setSelectedNode] = useState("B") // DEFAULT B

  useEffect(() => {
    // Load nodes for this topic
    supabase.from('lesson_nodes').select('id, node_type, title').eq('caps_topic_id', capsTopicId).then(({data})=>{
      if(data) setNodes(data)
    })
  }, [capsTopicId])

  const handleSave = async () => {
    const youtubeId = youtubeUrl.split('v=')[1]?.split('&')[0] || youtubeUrl.split('/').pop() || ""
    if(!youtubeId) return alert("Invalid YouTube URL")

    // 1. Save to videos table
    await supabase.from('videos').insert({
      caps_topic_id: capsTopicId,
      youtube_id: youtubeId,
      youtube_url: youtubeUrl,
      node_type: selectedNode || "B",
      status: 'ready'
    })

    // 2. THE BRIDGE - Attach to Node B (or selected)
    const nodeToUse = selectedNode || "B"
    // get existing content first
    const { data: existing } = await supabase.from('lesson_nodes').select('content').eq('caps_topic_id', capsTopicId).eq('node_type', nodeToUse).maybeSingle()

    await supabase.from('lesson_nodes').upsert({
      caps_topic_id: capsTopicId,
      node_type: nodeToUse,
      content: {...(existing?.content || {}), youtubeId, youtube_url: youtubeUrl, videoReady: true }
    }, { onConflict: 'caps_topic_id,node_type' })

    // 3. Also save to caps_knowledge_base for fallback
    await supabase.from('caps_knowledge_base').update({ youtube_id: youtubeId }).eq('id', capsTopicId)

    alert(`Video attached to Node ${nodeToUse} ✅`)
    onClose()
  }

  return (
    <div style={{background:'#111',border:'1px solid #333',padding:20,borderRadius:16,color:'white'}}>
      <h3>Add Video</h3>
      <input value={youtubeUrl} onChange={e=>setYoutubeUrl(e.target.value)} placeholder="https://youtu.be/..." style={{width:'100%',padding:10,margin:'10px 0',background:'#222',color:'white'}} />

      <label style={{fontSize:12,color:'#00ff88'}}>Attach to node *recommended - defaults to B</label>
      <select value={selectedNode} onChange={e=>setSelectedNode(e.target.value)} style={{width:'100%',padding:10,background:'#222',color:'white',marginTop:5}}>
        <option value="A">A - Introduction</option>
        <option value="B">B - Learn the Concept (Default)</option>
        <option value="C">C - CAPS Formula</option>
        <option value="D">D - Questions</option>
        <option value="E">E - Example</option>
      </select>

      {nodes.length===0 && <p style={{fontSize:11,color:'orange',marginTop:5}}>No node selected. This video will be attached to B — Learn the Concept by default.</p>}

      <button onClick={handleSave} style={{marginTop:15,width:'100%',padding:12,background:'#00ff88',color:'black',fontWeight:'bold',borderRadius:8}}>Save + Attach to Node {selectedNode}</button>
      <button onClick={onClose} style={{marginTop:8,width:'100%',padding:10,background:'#333',color:'white',borderRadius:8}}>Cancel</button>
    </div>
  )
}
