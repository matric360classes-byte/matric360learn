"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function AdminPage() {
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState("");
  useEffect(() => {
    (async () => {
      const { count, error } = await supabase.from("topic_knowledge").select("id", { count: "exact", head: true });
      if (error) setErr(error.message);
      else setTotal(count || 0);
    })();
  }, []);
  return <div style={{padding:20}}><h1>Total Topics: {total}</h1>{err && <p style={{color:"red"}}>ERROR: {err}</p>}</div>;
}
