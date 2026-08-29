import "./globals.css";
export const metadata = { title: "Matric360Learn", description: "CAPS" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0, background:"#0b0b12"}}>{children}</body>
    </html>
  );
}
