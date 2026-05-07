import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Service: React.FC<{ delay: number; icon: string; label: string }> = ({
  delay,
  icon,
  label,
}) => (
  <FadeIn delay={delay} from="up">
    <div
      style={{
        background: theme.colors.bgSoft,
        border: `2px solid ${theme.colors.primary}`,
        borderRadius: 22,
        padding: "28px 22px",
        width: 280,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 70, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: theme.colors.secondary }}>{label}</div>
    </div>
  </FadeIn>
);

export const Slide10_BSPs: React.FC = () => {
  return (
    <SlideShell
      number={10}
      eyebrow="Who provides this?"
      title="We don't talk to Meta directly — we go through a BSP"
    >
      <FadeIn delay={18} from="up">
        <p style={{ fontSize: 26, color: theme.colors.text, marginTop: -10, marginBottom: 30 }}>
          A <b>BSP (Business Solution Provider)</b> is an authorised middleman approved by Meta.
          They give us:
        </p>
      </FadeIn>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        <Service delay={32} icon="🌐" label="The chat widget for our website" />
        <Service delay={48} icon="📊" label="A dashboard to see all customer chats" />
        <Service delay={64} icon="📱" label="The mobile app to reply on the go" />
        <Service delay={80} icon="🛠️" label="Technical setup and support" />
      </div>
      <FadeIn delay={120} from="up">
        <div
          style={{
            marginTop: 50,
            background: theme.colors.primarySoft,
            border: `2px dashed ${theme.colors.primary}`,
            borderRadius: 20,
            padding: "26px 32px",
            fontSize: 24,
            color: theme.colors.secondary,
            lineHeight: 1.5,
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          <b>Real-life analogy:</b> It's like an authorised car dealer. We don't buy directly
          from the manufacturer (Meta) — we go through a trusted dealer who handles everything.
        </div>
      </FadeIn>
    </SlideShell>
  );
};
