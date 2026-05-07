import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Benefit: React.FC<{ delay: number; icon: string; text: string }> = ({
  delay,
  icon,
  text,
}) => (
  <FadeIn delay={delay} from="up">
    <div
      style={{
        background: "white",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 22,
        padding: "26px 26px",
        width: 540,
        height: 170,
        display: "flex",
        gap: 18,
        alignItems: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: 18,
          background: theme.colors.primarySoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: theme.colors.secondary,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  </FadeIn>
);

export const Slide14_Benefits: React.FC = () => {
  return (
    <SlideShell number={14} eyebrow="What's in it for us" title="Benefits — for Cozmaa">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        <Benefit delay={20} icon="🎯" text="Capture desktop visitors who currently drop off" />
        <Benefit
          delay={36}
          icon="💬"
          text="One inbox for all customer chats — no missed messages"
        />
        <Benefit
          delay={52}
          icon="📞"
          text="Customer's name and phone number captured automatically"
        />
        <Benefit delay={68} icon="🕐" text="Reply from anywhere — phone, laptop, tablet" />
        <Benefit
          delay={84}
          icon="👥"
          text="Multiple staff can reply (receptionist + doctor + manager)"
        />
        <Benefit
          delay={100}
          icon="📊"
          text="Chat history of every patient — useful for follow-ups"
        />
      </div>
    </SlideShell>
  );
};
