export async function POST(req: NextRequest){
  const b = await req.json();
  const { youtube_id, youtube_url, caps_topic_id, caps_code, subject, title, thumbnail_url, order, status, is_premium } = b;
  if(!youtube_id ||!caps_topic_id) return NextResponse.json({error:"Missing"}, {status:400});

  const thumb = thumbnail_url || `https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`;

  // FIX: Don't use onConflict - check manually
  const { data: existing } = await admin.from("videos").select("id").eq("caps_topic_id", caps_topic_id).maybeSingle();

  if (existing) {
    await admin.from("videos").update({
      youtube_id,
      youtube_url,
      caps_code,
      subject,
      title,
      thumbnail_url: thumb,
      order_index: order||0,
      status: status||"Ready",
      is_premium: is_premium??true
    }).eq("id", existing.id);
  } else {
    await admin.from("videos").insert([{
      youtube_id,
      youtube_url,
      caps_topic_id,
      caps_code,
      subject,
      title,
      thumbnail_url: thumb,
      order_index: order||0,
      status: status||"Ready",
      is_premium: is_premium??true
    }]);
  }

  // THIS is what makes Student Nodes populate - save to CAPS
  await admin.from("caps_knowledge_base").update({
    youtube_id,
    thumbnail_url: thumb,
    is_premium: is_premium??true
  } as any).eq("id", caps_topic_id);

  return NextResponse.json({ok:true});
}
