"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqinipmcmkhe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpdndsdXlkemJ3cWxuaXBtY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NDAyNzEsImV4cCI6MjEwNDMxNjI3MX0.vo_4_bAfi0owDoUf-EdIznBdQs25tG3nxRUorbPXCB0"
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
