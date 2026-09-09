"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();
  const isActive = (p: string) => path === p;

  const item = (href: string, icon: string, label: string) => (
    <Link href={href} style={{ 
      display: "flex", flexDirection: "column", alignItems: "center", 
      color: isActive(href) ? "white" : "#8A8EA6",
      fontSize: "11px", textDecoration: "none", gap: "4px"
    }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <div style={{ 
      position: "fixed", bottom: 0, left: 0, right: 0, 
      background: "#151A28", borderTop: "1px solid #252836", 
      display: "flex", justifyContent: "space-around", 
      padding: "10px 0", zIndex: 50
    }}>
      {item("/dashboard", "🏠", "Dashboard")}
      {item("/subjects", "📖", "Subjects")}
      {item("/mock-exams", "📋", "Exams")}
      {item("/progress", "📊", "Progress")}
      {item("/profile", "👤", "Profile")}
    </div>
  );
}
