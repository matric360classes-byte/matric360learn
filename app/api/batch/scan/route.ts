import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function GET(){
  const { data } = await supabase.from("lesson_previews").select("*").order("subject").limit(1000);
  // dedupe by caps_code
  const map = new Map();
  (data||[]).forEach((r:any)=>{ if(!map.has(r.caps_code)) map.set(r.caps_code, r); });
  return NextResponse.json({
    pdfs:[{name:"math.pdf"},{name:"Mathematics-Maths-P2-MEMO-MOCK.pdf"}],
    topics: Array.from(map.values())
  });
}
