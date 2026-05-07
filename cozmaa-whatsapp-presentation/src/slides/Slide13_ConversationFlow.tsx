import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";
import { ChatBubble } from "../components/ChatBubble";
import { PhoneMockup } from "../components/PhoneMockup";

const Step: React.FC<{
  delay: number;
  num: number;
  title: string;
  children?: React.ReactNode;
}> = ({ delay, num, title, children }) => (
  <FadeIn delay={delay} from="up">
    <div
      style={{
        background: "white",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 18,
        padding: 18,
        width: 320,
        height: 280,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span
          style={{
            background: theme.colors.primary,
            color: "white",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          {num}
        </span>
        <div style={{ fontSize: 18, fontWeight: 700, color: theme.colors.secondary }}>{title}</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  </FadeIn>
);

export const Slide13_ConversationFlow: React.FC = () => {
  return (
    <SlideShell number={13} eyebrow="A Real Example" title="How a real conversation will flow">
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          alignItems: "stretch",
          flexWrap: "wrap",
          marginTop: 6,
        }}
      >
        <Step delay={20} num={1} title="Priya opens cozmaa.com">
          <div style={{ fontSize: 80, textAlign: "center" }}>💻</div>
          <div style={{ fontSize: 14, color: theme.colors.muted, textAlign: "center" }}>
            On her laptop at home
          </div>
        </Step>
        <Step delay={40} num={2} title="Clicks chat icon">
          <div style={{ fontSize: 80, textAlign: "center" }}>👆💬</div>
          <div style={{ fontSize: 14, color: theme.colors.muted, textAlign: "center" }}>
            Bottom-right corner
          </div>
        </Step>
        <Step delay={60} num={3} title="Types her question">
          <ChatBubble side="in" style={{ fontSize: 14, padding: "10px 14px" }}>
            Hi, I want to know about hair transplant
          </ChatBubble>
        </Step>
        <Step delay={80} num={4} title="We get a notification">
          <div style={{ fontSize: 60, textAlign: "center" }}>📱🔔</div>
          <div style={{ fontSize: 14, color: theme.colors.muted, textAlign: "center" }}>
            On the new business app
          </div>
        </Step>
        <Step delay={100} num={5} title="We reply — instantly">
          <ChatBubble side="out" style={{ fontSize: 14, padding: "10px 14px" }}>
            Hello Priya! Yes, here are our packages…
          </ChatBubble>
        </Step>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <FadeIn delay={140} from="up">
          <PhoneMockup
            headerColor={theme.colors.primary}
            headerTitle="Priya — Patient"
            width={280}
            height={300}
          >
            <ChatBubble side="in" style={{ fontSize: 16 }}>
              Hi, I want to know about hair transplant
            </ChatBubble>
            <ChatBubble side="out" style={{ fontSize: 16 }}>
              Hello Priya! Yes, here are our packages 🌟
            </ChatBubble>
          </PhoneMockup>
        </FadeIn>
      </div>
      <FadeIn delay={200} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 24,
            color: theme.colors.secondary,
            fontWeight: 600,
            marginTop: 30,
          }}
        >
          Just like WhatsApp — but the customer never leaves our website.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
