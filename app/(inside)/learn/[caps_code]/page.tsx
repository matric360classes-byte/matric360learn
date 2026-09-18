// @ts-nocheck
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'

export default async function LearnPage({ params }: any) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url ||!key) {
      return (
        <div style={{ padding: 20, color: 'white', background: 'black', minHeight: '100vh' }}>
          Missing Supabase keys
        </div>
      )
    }

    const supabase = createClient(url, key)
    const slug = params.caps_code

    // FIXED: Directly query learning_nodes (your 675 clean lessons)
    const { data: nodes, error } = await supabase
     .from('learning_nodes')
     .select('*')
     .eq('caps_code', slug)
     .order('node_type', { ascending: true })

    if (error) {
      return <div style={{ padding: 20, background: 'black', color: 'white' }}>Supabase Error: {error.message}</div>
    }

    if (!nodes || nodes.length === 0) {
      return (
        <div style={{ padding: 20, color: 'white', background: 'black', minHeight: '100vh' }}>
          Topic not found for {slug} - 0 nodes. Check batch generated? Try /api/generate-all?batch=XX
        </div>
      )
    }

    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{nodes[0].topic_title}</h1>
        <p style={{ color: '#888', marginBottom: '20px' }}>{nodes[0].subject} • {slug} • {nodes.length} nodes</p>

        {nodes.map((n: any) => (
          <div key={n.id} style={{ border: '1px solid #333', margin: '16px 0', padding: '16px', borderRadius: '12px', background: '#111' }}>
            <b style={{ color: '#00ff88' }}>NODE {n.node_type}: {n.title}</b>
            <div style={{ whiteSpace: 'pre-wrap', color: '#ccc', fontSize: '14px', marginTop: '8px', lineHeight: '1.6' }}>
              {typeof n.content === 'string'? n.content : JSON.stringify(n.content, null, 2)}
            </div>
          </div>
        ))}
      </div>
    )
  } catch (e: any) {
    return <div style={{ padding: 20, background: 'black', color: 'white' }}>Error: {e.message}</div>
  }
}
