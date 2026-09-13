export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FactoryPage(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://matric360learn.co.za'}/api/factory/stats?t=${Date.now()}`, { cache: 'no-store' });
  let data = { queued: 0, ready: 0, total: 0 };
  try{ data = await res.json(); }catch{}
  return (
    <div style={{ padding: 20, background: 'black', color: 'white', minHeight: '100vh' }}>
      <h1>Factory - {data.ready} Ready</h1>
      <p>Queued: {data.queued}</p>
      <p>Ready: {data.ready}</p>
      <p>Failed: 0</p>
      <a href="/api/factory/process-all?limit=5"><button>Process All Queued ({data.queued})</button></a>
      <p style={{ marginTop: 20, fontSize: 12 }}>Updated: {new Date().toISOString()}</p>
    </div>
  )
}
