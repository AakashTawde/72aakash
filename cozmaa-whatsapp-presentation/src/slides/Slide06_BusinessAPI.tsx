import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Bullet: React.FC<{ delay: number; icon: string; text: string }> = ({
  delay,
  icon,
  text,
}) => (
  <FadeIn delay={delay} from="left">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        background: theme.colors.bgSoft,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 18,
        padding: "22px 28px",
        fontSize: 28,
        fontWeight: 600,
        color: theme.colors.secondary,
        width: 720,
      }}
    >
      <span style={{ fontSize: 40 }}>{icon}</span>
      <span>{text}</span>
    </div>
  </FadeIn>
);

export const Slide06_BusinessAPI: React.FC = () => {
  return (
    <SlideShell number={6} eyebrow="Meet the Tech (Briefly)" title="Meet WhatsApp Business API">
      <div style={{ display: "flex", gap: 70, alignItems: "center", marginTop: 20 }}>
        <FadeIn delay={20} from="left">
          <div
            style={{
              width: 360,
              height: 360,
              borderRadius: 80,
              background: theme.colors.whatsapp,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 220,
              boxShadow: "0 20px 60px rgba(37,211,102,0.30)",
            }}
          >
            🟢
          </div>
        </FadeIn>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          <FadeIn delay={36} from="up">
            <p style={{ fontSize: 26, lineHeight: 1.5, color: theme.colors.text, margin: 0 }}>
              It's the official, professional version of WhatsApp — made by{" "}
              <b>Meta (the same company that owns WhatsApp)</b> — for businesses
              like ours.
            </p>
          </FadeIn>
          <Bullet delay={70} icon="✅" text="100% official and legal" />
          <Bullet delay={95} icon="✅" text="Same WhatsApp experience for customers" />
          <Bullet delay={120} icon="✅" text="Built for businesses to handle many chats at once" />
        </div>
      </div>
    </SlideShell>
  );
};
