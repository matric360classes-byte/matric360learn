import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { fileName } = await req.json();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const supabase = createClient(url, key);
    const cleanName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g,"_").slice(0,40)}`;

    const { data, error } = await supabase.storage
      .from("source-pdfs")
      .createSignedUploadUrl(cleanName);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ 
      signedUrl: data.signedUrl, 
      path: cleanName, 
      token: data.token 
    });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
