export const dynamic='force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
export async function GET(){
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error, count } = await supa.from('lesson_previews').select('id,status', { count: 'exact' });
  if(error) return NextResponse.json({ error: error.message, queued:0, ready:0, total:0 });
  const queued = data.filter((r:any)=>r.status==='queued').length;
  const ready = data.filter((r:any)=>r.status==='ready').length;
  return NextResponse.json({ queued, ready, total: count, error: null });
}
