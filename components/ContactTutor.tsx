"use client";

export function ContactTutorButton({ 
  label = "Contact Tutor on WhatsApp", 
  message = "Hi Matric360 Tutor, I need help with",
  style = {},
  small = false
}: {
  label?: string;
  message?: string;
  style?: React.CSSProperties;
  small?: boolean;
}) {
  const waNumber = "27729888561"; // 0729888561
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: small ? 6 : 8,
        padding: small ? "8px 14px" : "12px 20px",
        borderRadius: 999,
        background: "#25D366",
        color: "#0f111e",
        fontWeight: 800,
        fontSize: small ? 13 : 14,
        textDecoration: "none",
        cursor: "pointer",
        ...style
      }}
    >
      <span>💬</span> {label}
    </a>
  );
}

export function FloatingWhatsApp() {
  const waNumber = "27729888561";
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hi Matric360 Tutor, I need help")}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 92,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 999,
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        zIndex: 95,
        textDecoration: "none"
      }}
      aria-label="Contact Tutor on WhatsApp"
    >
      💬
    </a>
  );
}
