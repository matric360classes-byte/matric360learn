import GlobalNav from "../components/GlobalNav";

export default function SubjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 90, background: "#0e0f1a", minHeight: "100vh" }}>
      <GlobalNav />
      {children}
    </div>
  );
}
