export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { createClient } from '@supabase/supabase-js';

export default async function FactoryPage(){
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, count } = await supa.from('lesson_previews').select('id,status', { count: 'exact' });
  const queued = data?.filter((r:any)=>r.status==='queued').length || 0;
  const ready = data?.filter((r:any)=>r.status==='ready').length || 0;
  
  return (
    <div style={{ padding: 20, background: 'black', color: 'white', minHeight: '100vh' }}>
      <h1>Factory - {ready} Ready</h1>
      <p>Queued: {queued}</p>
      <p>Ready: {ready}</p>
      <p>Total: {count}</p>
      <p>DB: {process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0,30)}...</p>
      <a href="/api/factory/process-all?limit=5"><button>Process All Queued ({queued})</button></a>
      <p style={{ marginTop: 20, fontSize: 10 }}>Updated: {new Date().toISOString()}</p>
    </div>
  )
}
