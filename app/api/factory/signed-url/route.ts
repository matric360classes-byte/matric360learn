import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { fileName } = await req.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const clean = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `bulk/${Date.now()}_${clean}`

  const { data, error } = await supabase.storage.from('source-pdfs').createSignedUploadUrl(path)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ path, signedUrl: data.signedUrl, token: data.token })
}
