import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { PhoneMockup } from "../components/PhoneMockup";
import { ChatBubble } from "../components/ChatBubble";
import { theme } from "../theme";

export const Slide07_RealityCheck: React.FC = () => {
  return (
    <SlideShell
      number={7}
      eyebrow="⚠️ Important — Read Carefully"
      title="One thing to understand before we go further"
      background={"#FFFBEA"}
    >
      <FadeIn delay={20} from="up">
        <div
          style={{
            background: "white",
            border: `2px solid ${theme.colors.warning}`,
            borderRadius: 20,
            padding: "28px 36px",
            fontSize: 36,
            fontWeight: 700,
            color: theme.colors.secondary,
            lineHeight: 1.3,
            marginBottom: 30,
          }}
        >
          We will <span style={{ color: theme.colors.danger }}>NOT</span> use the
          green WhatsApp app you have on your phone right now.
        </div>
      </FadeIn>
      <div style={{ display: "flex", gap: 60, alignItems: "center", justifyContent: "center" }}>
        <FadeIn delay={50} from="left">
          <PhoneMockup
            label="1️⃣  Personal WhatsApp"
            headerColor="#075E54"
            headerTitle="Family Group"
            width={260}
            height={460}
          >
            <ChatBubble side="in" style={{ fontSize: 16 }}>
              Beta, dinner kab aa rahe ho?
            </ChatBubble>
            <ChatBubble side="out" style={{ fontSize: 16 }}>
              8 baje tak ghar pahunch jaunga 🙂
            </ChatBubble>
          </PhoneMockup>
        </FadeIn>
        <FadeIn delay={62} from="up">
          <div
            style={{
              fontSize: 80,
              color: theme.colors.danger,
              fontWeight: 800,
            }}
          >
            ✕
          </div>
        </FadeIn>
        <FadeIn delay={75} from="right">
          <PhoneMockup
            label="2️⃣  Business API (Cozmaa)"
            headerColor={theme.colors.primary}
            headerTitle="Patient — Priya"
            width={260}
            height={460}
          >
            <ChatBubble side="in" style={{ fontSize: 16 }}>
              Hi, hair transplant ki info chahiye thi
            </ChatBubble>
            <ChatBubble side="out" style={{ fontSize: 16 }}>
              Hello Priya! Sure, I'll share details right now.
            </ChatBubble>
          </PhoneMockup>
        </FadeIn>
      </div>
      <FadeIn delay={150} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 24,
            color: theme.colors.secondary,
            marginTop: 30,
            fontWeight: 600,
          }}
        >
          These two CANNOT mix. It's a Meta rule — not something we can change.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
