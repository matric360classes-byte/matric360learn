import { Suspense } from "react";
import GlobalNav from "../../components/GlobalNav";

export const dynamic = "force-dynamic";

export default function SubjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 90, background: "#0e0f1a", minHeight: "100vh" }}>
      <Suspense fallback={<div style={{height:44, background:"#0e0f1a"}} />}>
        <GlobalNav />
      </Suspense>
      {children}
    </div>
  );
}
