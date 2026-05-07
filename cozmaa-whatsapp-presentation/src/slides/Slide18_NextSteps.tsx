import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Check: React.FC<{ delay: number; text: string }> = ({ delay, text }) => (
  <FadeIn delay={delay} from="left">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "white",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 14,
        padding: "20px 26px",
        fontSize: 24,
        color: theme.colors.text,
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: `2.5px solid ${theme.colors.primary}`,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <span>{text}</span>
    </div>
  </FadeIn>
);

export const Slide18_NextSteps: React.FC = () => {
  return (
    <SlideShell number={18} eyebrow="Decision Time" title="What we need from you to start">
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 1300 }}>
        <Check delay={20} text="Approval on the AiSensy plan (₹1,500/month)" />
        <Check delay={40} text="Decision: New number or migrate existing one?" />
        <Check delay={60} text="Cozmaa logo + brand colours (already on the website)" />
        <Check delay={80} text="Sample replies for common patient questions" />
        <Check delay={100} text="List of staff members who'll handle chats" />
      </div>
      <FadeIn delay={140} from="up">
        <div
          style={{
            marginTop: 40,
            background: theme.colors.primary,
            color: "white",
            borderRadius: 22,
            padding: "26px 36px",
            textAlign: "center",
            fontSize: 30,
            fontWeight: 700,
            boxShadow: "0 16px 40px rgba(10,126,140,0.30)",
          }}
        >
          Once approved — we go live in under a week. 🚀
        </div>
      </FadeIn>
      <FadeIn delay={170} from="up">
        <div
          style={{
            marginTop: 28,
            textAlign: "center",
            fontSize: 22,
            color: theme.colors.muted,
          }}
        >
          Questions? <b style={{ color: theme.colors.secondary }}>Aakash Tawde</b> · 📞 [your
          number] · ✉️ [your email]
        </div>
      </FadeIn>
    </SlideShell>
  );
};
