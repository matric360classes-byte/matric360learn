import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const cookieStore = await cookies()
  const all = cookieStore.getAll()
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <div style={{padding:20, background:'#0a0d1a', color:'white', minHeight:'100vh', fontFamily:'monospace', fontSize:13}}>
      <h2>DEBUG</h2>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      <p>User: {user ? user.email : 'NO USER ❌'}</p>
      <p>Error: {error?.message || 'none'}</p>
      <p>Cookies count: {all.length}</p>
      <pre style={{whiteSpace:'pre-wrap', background:'#151a2d', padding:12, borderRadius:8}}>
        {all.map(c => `${c.name}: ${c.value.slice(0,40)}...`).join('\n') || 'NO COOKIES'}
      </pre>
      <br/>
      <a href="/login" style={{color:'#fbbf24'}}>Go to login</a> | <a href="/dashboard" style={{color:'#22c55e'}}>Go to dashboard</a>
    </div>
  )
}
