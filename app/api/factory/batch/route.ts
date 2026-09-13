import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { path, fileName, fileSize } = await req.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await supabase.from('source_pdfs').insert({
    file_name: fileName,
    file_path: path,
    storage_path: path,
    file_size: fileSize,
    status: 'uploaded'
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase.from('source_pdfs').select('file_name').order('created_at', { ascending: false }).limit(100)
  return NextResponse.json({ files: data || [] })
}
