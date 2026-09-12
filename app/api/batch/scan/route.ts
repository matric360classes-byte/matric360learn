import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function GET(){
  const { data } = await supabase.from("caps_topics").select("*").limit(500);
  return NextResponse.json({pdfs:[{name:"math.pdf"},{name:"Mathematics-Maths-P2-MEMO-May-June-2024"}], topics: data||[]});
}
