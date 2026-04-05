"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "← Back" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 100,
        padding: "8px 16px",
        borderRadius: 12,
        border: "1.5px solid #E5E7EB",
        background: "white",
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: "#6B7280",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {label}
    </button>
  );
}
