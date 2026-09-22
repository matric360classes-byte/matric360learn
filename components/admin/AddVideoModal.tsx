// components/admin/AddVideoModal.tsx - FINAL WORKING VERSION
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // CHANGE THIS if your supabase import is different

interface Props {
  capsTopicId: string // This is the id from caps_knowledge_base
  isOpen: boolean
  onClose: () => void
}

export default function AddVideoModal({ capsTopicId, isOpen, onClose }: Props) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [nodes, setNodes] = useState<any[]>([])
  const [selectedNode, setSelectedNode] = useState("B") // DEFAULT B
  const [loading, setLoading] = useState(false)
  const [savedId, setSavedId] = useState("")

  useEffect(() => {
    if (!isOpen ||!capsTopicId) return

    // Load nodes for this topic
    supabase.from('lesson_nodes').select('id, node_type, title, content').eq('caps_topic_id', capsTopicId).then(({ data }) => {
      if (data) {
        setNodes(data)
        // Auto select B if exists
        const nodeB = data.find((n: any) => n.node_type === 'B')
        if (nodeB) {
          setSelectedNode(nodeB.id)
          // Prefill existing youtube if any
          let c = nodeB.content
          try { if (typeof c === 'string') c = JSON.parse(c) } catch { }
          const existingYt = c?.youtubeId || c?.youtube_id || ""
          if (existingYt) {
            setYoutubeUrl(`https://www.youtube.com/watch?v=${existingYt}`)
            setSavedId(existingYt)
          }
        }
      }
    })
  }, [isOpen, capsTopicId])

  const extractYoutubeId = (url: string) => {
    let id = url.trim()
    if (id.includes('v=')) id = id.split('v=')[1].split('&')[0]
    else if (id.includes('youtu.be/')) id = id.split('youtu.be/')[1].split('?')[0].split('&')[0]
    else if (id.includes('/embed/')) id = id.split('/embed/')[1].split('?')[0]
    else if (id.length > 20 &&!id.includes('/')) id = id // already id like x_YoOu5Rdd8
    else id = id.split('/').pop()!.split('?')[0]
    return id
  }

  const handleSaveVideo = async () => {
    if (!youtubeUrl) {
      alert("Paste YouTube URL")
      return
    }
    if (!capsTopicId) {
      alert("No capsTopicId")
      return
    }

    setLoading(true)
    try {
      const ytId = extractYoutubeId(youtubeUrl)
      if (!ytId || ytId.length < 5) {
        alert("Invalid YouTube URL")
        setLoading(false)
        return
      }

      // 1. Get existing B node content
      const { data: existingData } = await supabase
       .from('lesson_nodes')
       .select('id, content')
       .eq('caps_topic_id', capsTopicId)
       .eq('node_type', 'B')
       .single()

      let oldContent: any = existingData?.content || {}
      try {
        if (typeof oldContent === 'string') oldContent = JSON.parse(oldContent)
      } catch { oldContent = {} }
      if (typeof oldContent!== 'object') oldContent = { body: String(oldContent) }

      const newContent = {
       ...oldContent,
        youtubeId: ytId,
        youtube_id: ytId,
        youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
        thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        updatedAt: new Date().toISOString()
      }

      // 2. SAVE TO lesson_nodes (Node B)
      let error1
      if (existingData?.id) {
        const { error } = await supabase.from('lesson_nodes').update({
          content: newContent,
          title: oldContent.title || `B - Video: ${ytId}`
        }).eq('id', existingData.id)
        error1 = error
      } else {
        // Create B node if doesn't exist
        const { error } = await supabase.from('lesson_nodes').insert({
          caps_topic_id: capsTopicId,
          node_type: 'B',
          title: 'Formulas You Must Memorise',
          content: newContent,
          status: 'published'
        })
        error1 = error
      }

      if (error1) throw error1

      // 3. SAVE TO caps_knowledge_base - This makes it pop in Student Nodes
      const { error: error2 } = await supabase.from('caps_knowledge_base').update({
        youtube_id: ytId,
        thumbnail_url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      }).eq('id', capsTopicId)

      if (error2) console.warn("caps_knowledge_base update failed:", error2)

      setSavedId(ytId)
      alert(`✅ SAVED! ${ytId} attached to Node B`)

      // Close after save
      // onClose()

    } catch (e: any) {
      alert("SAVE FAILED: " + e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 16, padding: 24, width: '100%', maxWidth: 500 }}>
        <h2 style={{ color: 'white', fontWeight: 800, marginBottom: 4 }}>Add YouTube Video</h2>
        <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 16 }}>Topic: {capsTopicId.slice(0, 8)} • Will attach to Node B</p>

        {nodes.length > 0 && (
          <div style={{ marginBottom: 12, fontSize: 12, color: '#00ff88' }}>
            🔒 {nodes.length} NODES • {nodes[0]?.caps_topic_id?.slice(0, 8)} • Found Node B: {nodes.some(n => n.node_type === 'B')? 'YES' : 'NO'}
          </div>
        )}

        <label style={{ color: '#ccc', fontSize: 13, display: 'block', marginBottom: 6 }}>YouTube URL or ID</label>
        <input
          value={youtubeUrl}
          onChange={e => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=x_YoOu5Rdd8"
          style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: 8, padding: '12px', color: 'white', marginBottom: 16 }}
        />

        {savedId && (
          <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid #00ff88' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${savedId}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: 8, background: '#333', color: 'white', fontWeight: 700 }}
          >
            Close
          </button>
          <button
            onClick={handleSaveVideo}
            disabled={loading}
            style={{ flex: 2, padding: '12px', borderRadius: 8, background: loading? '#333' : '#00ff88', color: loading? '#999' : '#000', fontWeight: 800 }}
          >
            {loading? 'SAVING...' : 'Save to Node B'}
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 11, color: '#666' }}>
          Saves to: lesson_nodes (node_type B) + caps_knowledge_base (youtube_id)
        </div>
      </div>
    </div>
  )
}
