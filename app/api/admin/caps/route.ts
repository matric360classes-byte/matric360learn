import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(){
  const { data } = await admin.from("caps_knowledge_base").select("id,subject,topic,caps_code").limit(1000);
  return NextResponse.json(data || []);
}
