import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Reason: React.FC<{ delay: number; text: string }> = ({ delay, text }) => (
  <FadeIn delay={delay} from="left">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: 24,
        color: theme.colors.text,
      }}
    >
      <span style={{ color: theme.colors.success, fontSize: 28, fontWeight: 800 }}>✅</span>
      <span>{text}</span>
    </div>
  </FadeIn>
);

export const Slide17_Recommendation: React.FC = () => {
  return (
    <SlideShell number={17} eyebrow="The Decision" title="My Recommendation">
      <FadeIn delay={20} from="up">
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
            color: "white",
            borderRadius: 28,
            padding: "40px 50px",
            boxShadow: "0 20px 50px rgba(10,126,140,0.30)",
          }}
        >
          <div style={{ fontSize: 22, opacity: 0.85, letterSpacing: 3, marginBottom: 16 }}>
            GO WITH
          </div>
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 18, opacity: 0.7, marginBottom: 4 }}>Provider</div>
              <div style={{ fontSize: 48, fontWeight: 800 }}>AiSensy</div>
              <div style={{ fontSize: 22, opacity: 0.85 }}>₹1,500/month plan</div>
            </div>
            <div>
              <div style={{ fontSize: 18, opacity: 0.7, marginBottom: 4 }}>Phone Number</div>
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1 }}>New dedicated number</div>
              <div style={{ fontSize: 22, opacity: 0.85 }}>Just for Cozmaa Business</div>
            </div>
            <div>
              <div style={{ fontSize: 18, opacity: 0.7, marginBottom: 4 }}>Start with</div>
              <div style={{ fontSize: 36, fontWeight: 800 }}>14-day free trial</div>
              <div style={{ fontSize: 22, opacity: 0.85 }}>Test before paying</div>
            </div>
          </div>
        </div>
      </FadeIn>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
        <FadeIn delay={70} from="up">
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: theme.colors.secondary,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Why this combination
          </div>
        </FadeIn>
        <Reason delay={85} text="Best price-to-feature ratio for a clinic our size" />
        <Reason delay={105} text="Free Green Tick verification — looks professional to customers" />
        <Reason delay={125} text="Indian company with Indian customer support" />
      </div>
    </SlideShell>
  );
};
