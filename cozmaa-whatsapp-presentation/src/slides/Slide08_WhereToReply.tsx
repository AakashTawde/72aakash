import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { PhoneMockup } from "../components/PhoneMockup";
import { ChatBubble } from "../components/ChatBubble";
import { theme } from "../theme";

const Row: React.FC<{ delay: number; icon: string; text: string }> = ({ delay, icon, text }) => (
  <FadeIn delay={delay} from="left">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontSize: 26,
        color: theme.colors.text,
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span>{text}</span>
    </div>
  </FadeIn>
);

export const Slide08_WhereToReply: React.FC = () => {
  return (
    <SlideShell
      number={8}
      eyebrow="So where will I reply from?"
      title="A separate app — but it FEELS like WhatsApp"
    >
      <div style={{ display: "flex", gap: 80, alignItems: "center", marginTop: 10 }}>
        <FadeIn delay={20} from="left">
          <PhoneMockup
            headerColor={theme.colors.primary}
            headerTitle="Cozmaa Inbox"
            width={300}
            height={580}
          >
            <ChatBubble side="in">Hi, looking for hair transplant info</ChatBubble>
            <ChatBubble side="out">Hello! Sharing our packages now 🙂</ChatBubble>
            <ChatBubble side="in">Cost kitna hota hai approx?</ChatBubble>
            <ChatBubble side="out">Starting ₹65,000 — depends on grafts</ChatBubble>
          </PhoneMockup>
        </FadeIn>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
          <Row delay={50} icon="📱" text="Looks and works exactly like WhatsApp" />
          <Row delay={75} icon="💬" text="Same chat bubbles, same green vibe" />
          <Row delay={100} icon="🔔" text="Notifications come the same way" />
          <Row delay={125} icon="🆕" text="Only difference — a different app icon on your phone" />
          <FadeIn delay={150} from="up">
            <div
              style={{
                marginTop: 24,
                background: theme.colors.primarySoft,
                border: `2px dashed ${theme.colors.primary}`,
                borderRadius: 18,
                padding: "22px 26px",
                fontSize: 23,
                color: theme.colors.secondary,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              <b>Think of it like this:</b> Gmail and Outlook are both for emails.
              Different apps, same job. You'll get used to it in a day.
            </div>
          </FadeIn>
        </div>
      </div>
    </SlideShell>
  );
};
