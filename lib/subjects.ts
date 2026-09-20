import { createClient } from "@supabase/supabase-js";

export const SUBJECTS_DATA_RAW: any = {
  // KEEP YOUR EXACT STRUCTURE BUT CHANGE ALL youtubeId: "kQ0i8s3q6dM" TO youtubeId: ""
  mathematics: { id: "mathematics", name: "Mathematics", desc: "...", sections: [...] },
  "physical-sciences": { id: "physical-sciences", name: "Physical Sciences", desc: "...", sections: [...] }
};

// THIS FUNCTION MAKES VIDEO POPUP - Student MUST use this, not SUBJECTS_DATA_RAW
export async function getSubjectsWithVideos() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: caps } = await supabase.from('caps_knowledge_base').select('caps_code, youtube_id, thumbnail_url, is_premium');
  const videoMap = new Map(caps?.map(c => [c.caps_code, c.youtube_id]) || []);

  const cloned = JSON.parse(JSON.stringify(SUBJECTS_DATA_RAW));
  for (const subjKey of Object.keys(cloned)) {
    for (const section of cloned[subjKey].sections) {
      for (const unit of section.units) {
        for (const topic of unit.topics) {
          if (videoMap.has(topic.id)) {
            topic.youtubeId = videoMap.get(topic.id);
          }
        }
      }
    }
  }
  return cloned;
}

export const SUBJECTS_DATA = SUBJECTS_DATA_RAW;
export const subjects = Object.values(SUBJECTS_DATA_RAW);
export const getByType = (t:any) => [];
