// components/admin/AddVideoModal.tsx - BUILD FIX - NO IMPORT ERROR
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  capsTopicId: string
  isOpen: boolean
  onClose: () => void
}

export default function AddVideoModal({ capsTopicId, isOpen, onClose }: Props) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [nodes, setNodes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [savedId, setSavedId] = useState("")

  useEffect(() => {
    if (!isOpen || !capsTopicId) return
    supabase.from('lesson_nodes').select('id, node_type, content').eq('caps_topic_id', capsTopicId).then(({ data }) => {
      if (data) {
        setNodes(data)
        const nodeB = data.find((n: any) => n.node_type === 'B')
        if (nodeB) {
          let c = nodeB.content
          try { if (typeof c === 'string') c = JSON.parse(c) } catch {}
          const existingYt = c?.youtubeId || c?.youtube_id || ""
          if (existingYt) {
            setYoutubeUrl(`https://www.youtube.com/watch?v=${existingYt}`)
            setSavedId(existingYt)
          }
        }
      }
    })
  }, [isOpen, capsTopicId])

  const extractId = (url: string) => {
    let id = url.trim()
    if (id.includes('v=')) id = id.split('v=')[1].split('&')[0]
    else if (id.includes('youtu.be/')) id = id.split('youtu.be/')[1].split('?')[0]
    else if (id.includes('/embed/')) id = id.split('/embed/')[1].split('?')[0]
    else if (id.length < 20 && !id.includes('/')) return id
    return id.split('/').pop()!.split('?')[0]
  }

  const handleSave = async () => {
    if (!youtubeUrl) return alert("Paste URL")
    setLoading(true)
    try {
      const ytId = extractId(youtubeUrl)
      const { data: existing } = await supabase.from('lesson_nodes').select('id, content').eq('caps_topic_id', capsTopicId).eq('node_type','B').single()
      let old: any = existing?.content || {}
      try { if (typeof old === 'string') old = JSON.parse(old) } catch {}
      
      const newContent = { ...old, youtubeId: ytId, youtube_id: ytId, youtubeUrl: `https://www.youtube.com/watch?v=${ytId}` }
      
      if (existing?.id) {
        await supabase.from('lesson_nodes').update({ content: newContent }).eq('id', existing.id)
      } else {
        await supabase.from('lesson_nodes').insert({ caps_topic_id: capsTopicId, node_type: 'B', title: 'Video', content: newContent })
      }
      
      await supabase.from('caps_knowledge_base').update({ youtube_id: ytId, thumbnail_url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` }).eq('id', capsTopicId)
      
      setSavedId(ytId)
      alert(`SAVED ${ytId}`)
    } catch (e: any) { alert(e.message) }
    setLoading(false)
  }

  if (!isOpen) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, width:'100%', maxWidth:500 }}>
        <h2 style={{ color:'white', fontWeight:800 }}>Add YouTube Video</h2>
        <p style={{ color:'#9ca3af', fontSize:12, marginBottom:16 }}>{capsTopicId.slice(0,8)} • Node B</p>
        <input value={youtubeUrl} onChange={e=>setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=x_YoOu5Rdd8" style={{ width:'100%', background:'#000', border:'1px solid #333', borderRadius:8, padding:12, color:'white', marginBottom:16 }} />
        {savedId && <div style={{ marginBottom:16, borderRadius:12, overflow:'hidden', border:'1px solid #00ff88' }}><div style={{ position:'relative', paddingBottom:'56.25%' }}><iframe src={`https://www.youtube.com/embed/${savedId}`} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:0 }} allowFullScreen /></div></div>}
        <div style={{ display:'flex', gap:12 }}><button onClick={onClose} style={{ flex:1, padding:12, borderRadius:8, background:'#333', color:'white' }}>Close</button><button onClick={handleSave} disabled={loading} style={{ flex:2, padding:12, borderRadius:8, background:loading?'#333':'#00ff88', color:loading?'#999':'#000', fontWeight:800 }}>{loading?'SAVING...':'Save to Node B'}</button></div>
      </div>
    </div>
  )
}
