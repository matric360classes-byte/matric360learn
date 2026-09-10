"use client";
import dynamic from "next/dynamic";
const MathBatch = dynamic(() => import("../../../components/admin/MathBatch"), { ssr: false });
export default function Page(){ return <MathBatch />; }
