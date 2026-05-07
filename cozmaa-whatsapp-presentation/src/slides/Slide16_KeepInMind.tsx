import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Item: React.FC<{ delay: number; text: string }> = ({ delay, text }) => (
  <FadeIn delay={delay} from="left">
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
        background: "white",
        border: `1px solid ${theme.colors.warning}`,
        borderRadius: 16,
        padding: "20px 26px",
        fontSize: 24,
        color: theme.colors.text,
        lineHeight: 1.4,
        boxShadow: "0 4px 14px rgba(245,158,11,0.10)",
      }}
    >
      <span style={{ fontSize: 32, flexShrink: 0 }}>⚠️</span>
      <span>{text}</span>
    </div>
  </FadeIn>
);

export const Slide16_KeepInMind: React.FC = () => {
  return (
    <SlideShell
      number={16}
      eyebrow="Honest Heads-Up"
      title="Things to keep in mind"
      background="#FFFBEA"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 1300 }}>
        <Item
          delay={20}
          text="The new business app is separate — needs a small mindset shift in the first week."
        />
        <Item
          delay={40}
          text="For sending promotional messages, Meta needs to approve the message templates first (1–2 days)."
        />
        <Item
          delay={60}
          text="If we want to send marketing offers, those cost ~₹0.86 per message."
        />
        <Item
          delay={80}
          text="We need to reply within 24 hours — otherwise sending free messages costs extra."
        />
        <Item
          delay={100}
          text="Internet must be working for the app to receive messages (just like normal WhatsApp)."
        />
      </div>
      <FadeIn delay={140} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 22,
            color: theme.colors.muted,
            marginTop: 30,
            fontStyle: "italic",
          }}
        >
          None of these are deal-breakers — but you should know them upfront.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
