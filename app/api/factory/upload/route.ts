import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPA__URL || process.env.NEXT__URL || "https://civwluydzbwqlnipmcmkhe.supabase.co";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPA__KEY || process.env.SUPA_KEY || "sb_secret_UlK_LoRsi6zy2EKFfqbwTg_7KnAqq9w";
    
    const supabase = createClient(url, key);

    const buffer = Buffer.from(await file.arrayBuffer());
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g,"_").slice(0,40);
    const path = `${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage.from("source-pdfs").upload(path, buffer, {
      contentType: "application/pdf",
      upsert: true
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ path, ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
