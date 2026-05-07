import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Stage: React.FC<{ delay: number; day: string; title: string; sub: string }> = ({
  delay,
  day,
  title,
  sub,
}) => (
  <FadeIn delay={delay} from="up">
    <div
      style={{
        flex: 1,
        background: "white",
        border: `2px solid ${theme.colors.primary}`,
        borderRadius: 20,
        padding: 22,
        textAlign: "center",
        position: "relative",
        boxShadow: "0 8px 24px rgba(10,126,140,0.10)",
      }}
    >
      <div
        style={{
          background: theme.colors.primary,
          color: "white",
          borderRadius: 999,
          padding: "6px 16px",
          fontSize: 16,
          fontWeight: 700,
          display: "inline-block",
          marginBottom: 12,
        }}
      >
        {day}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: theme.colors.secondary,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 16, color: theme.colors.muted, lineHeight: 1.4 }}>{sub}</div>
    </div>
  </FadeIn>
);

const Connector: React.FC<{ delay: number }> = ({ delay }) => (
  <FadeIn delay={delay} from="left">
    <div style={{ fontSize: 28, color: theme.colors.accent, fontWeight: 800 }}>→</div>
  </FadeIn>
);

export const Slide15_SetupProcess: React.FC = () => {
  return (
    <SlideShell number={15} eyebrow="Setup" title="What's the setup process?">
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 14,
          marginTop: 30,
        }}
      >
        <Stage
          delay={20}
          day="DAY 1"
          title="Sign up"
          sub="Register on AiSensy and decide on the phone number"
        />
        <Connector delay={36} />
        <Stage
          delay={45}
          day="DAY 2"
          title="Verify Business"
          sub="Facebook Business Manager paperwork"
        />
        <Connector delay={60} />
        <Stage
          delay={70}
          day="DAY 3"
          title="Get number approved"
          sub="WhatsApp Business number approved by Meta"
        />
        <Connector delay={85} />
        <Stage
          delay={95}
          day="DAY 4"
          title="Install widget"
          sub="Add chat widget on cozmaa.com"
        />
        <Connector delay={110} />
        <Stage
          delay={120}
          day="DAY 5"
          title="Train + Go live"
          sub="Train staff on the new app and switch on"
        />
      </div>
      <FadeIn delay={160} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 28,
            color: theme.colors.secondary,
            marginTop: 70,
            fontWeight: 600,
          }}
        >
          Roughly <span style={{ color: theme.colors.primary }}>5–7 working days</span> from start
          to live.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
