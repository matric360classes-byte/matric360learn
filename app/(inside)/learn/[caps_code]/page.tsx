// @ts-nocheck
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'

export default async function LearnPage({ params }: any) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      return (
        <div style={{ padding: 20, color: 'white', background: 'black', minHeight: '100vh' }}>
          Missing Supabase keys in Vercel - Add NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in Vercel Settings
        </div>
      )
    }

    const supabase = createClient(url, key)
    const slug = params.caps_code || params.subject || params.id

    const { data: topic } = await supabase.from('caps_knowledge_base').select('*').eq('caps_code', slug).maybeSingle()

    if (!topic) {
      return (
        <div style={{ padding: 20, color: 'white', background: 'black', minHeight: '100vh' }}>
          Topic not found for {slug} - Your 675 nodes are safe. Check caps_code spelling.
        </div>
      )
    }

    const { data: nodes } = await supabase.from('lesson_nodes').select('*').eq('caps_topic_id', topic.id).order('node_type')
    const getNode = (t: string) => nodes?.find((n: any) => n.node_type === t)

    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: '20px' }}>
        <h1>{topic.topic}</h1>
        <p style={{ color: '#888' }}>{topic.subject} - Grade {topic.grade}</p>
        {['A','B','C','D','E'].map((k) => {
          const n = getNode(k)
          return (
            <div key={k} style={{ border: '1px solid #333', margin: '12px 0', padding: '12px', borderRadius: '12px', background: '#111' }}>
              <b>NODE {k}: {n?.title || 'Empty'}</b>
              <div style={{ whiteSpace: 'pre-wrap', color: '#ccc', fontSize: '14px' }}>
                {n?.content?.body_markdown?.slice(0, 2000) || 'No content'}
              </div>
            </div>
          )
        })}
      </div>
    )
  } catch (e: any) {
    return <div style={{ padding: 20, background: 'black', color: 'white' }}>Error: {e.message}</div>
  }
}
