import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Card: React.FC<{
  emoji: string;
  title: string;
  steps: string[];
  result: string;
  good: boolean;
  delay: number;
}> = ({ emoji, title, steps, result, good, delay }) => (
  <FadeIn delay={delay} from="up">
    <div
      style={{
        background: theme.colors.bgSoft,
        border: `2px solid ${good ? theme.colors.success : theme.colors.danger}`,
        borderRadius: 28,
        padding: 36,
        width: 540,
        height: 460,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 88, marginBottom: 6 }}>{emoji}</div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: theme.colors.secondary,
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{ fontSize: 22, color: theme.colors.text, display: "flex", gap: 10 }}
          >
            <span style={{ color: theme.colors.muted, minWidth: 28 }}>{i + 1}.</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 18,
          fontSize: 26,
          fontWeight: 700,
          color: good ? theme.colors.success : theme.colors.danger,
        }}
      >
        {good ? "✅ " : "❌ "}
        {result}
      </div>
    </div>
  </FadeIn>
);

export const Slide02_Problem: React.FC = () => {
  return (
    <SlideShell number={2} eyebrow="The Gap" title="Our Current Problem">
      <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 10 }}>
        <Card
          delay={20}
          emoji="📱"
          title="Mobile Visitor"
          steps={[
            "Clicks chat button on cozmaa.com",
            "WhatsApp app opens instantly",
            "Starts chatting — done.",
          ]}
          result="Easy. We get the lead."
          good
        />
        <Card
          delay={48}
          emoji="💻"
          title="Desktop Visitor"
          steps={[
            "Clicks chat button on cozmaa.com",
            "Sees WhatsApp Web — needs phone & QR scan",
            "Most people give up here",
          ]}
          result="We lose them before they ever reach us."
          good={false}
        />
      </div>
      <FadeIn delay={120} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 28,
            color: theme.colors.muted,
            marginTop: 50,
            fontWeight: 500,
          }}
        >
          A big chunk of our website visitors are on desktops. They drop off before
          reaching us.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
