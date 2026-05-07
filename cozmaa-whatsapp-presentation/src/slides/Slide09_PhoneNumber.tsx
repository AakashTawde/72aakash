import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const Option: React.FC<{
  delay: number;
  badge: string;
  badgeColor: string;
  title: string;
  bullets: { icon: string; text: string; tone?: "good" | "warn" }[];
  recommended?: boolean;
}> = ({ delay, badge, badgeColor, title, bullets, recommended }) => (
  <FadeIn delay={delay} from="up">
    <div
      style={{
        background: "white",
        border: `2px solid ${recommended ? theme.colors.primary : theme.colors.border}`,
        borderRadius: 24,
        padding: 30,
        width: 720,
        boxShadow: recommended
          ? "0 18px 50px rgba(10,126,140,0.18)"
          : "0 8px 24px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <span
          style={{
            background: badgeColor,
            color: "white",
            borderRadius: 999,
            padding: "6px 16px",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
        <h3 style={{ margin: 0, fontSize: 28, color: theme.colors.secondary }}>{title}</h3>
        {recommended && (
          <span
            style={{
              marginLeft: "auto",
              background: theme.colors.primary,
              color: "white",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            ⭐ RECOMMENDED
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bullets.map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              fontSize: 22,
              color: b.tone === "warn" ? theme.colors.danger : theme.colors.text,
            }}
          >
            <span>{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  </FadeIn>
);

export const Slide09_PhoneNumber: React.FC = () => {
  return (
    <SlideShell
      number={9}
      eyebrow="The Phone Number"
      title="What about my existing Cozmaa WhatsApp number?"
    >
      <div style={{ display: "flex", gap: 30, justifyContent: "center", marginTop: 10 }}>
        <Option
          delay={20}
          badge="OPTION A"
          badgeColor={theme.colors.primary}
          title="Use a NEW number for Cozmaa Business"
          recommended
          bullets={[
            { icon: "✅", text: "Your personal WhatsApp stays untouched" },
            { icon: "✅", text: "Clean separation — work and personal don't mix" },
            { icon: "✅", text: "No risk of losing existing chats" },
          ]}
        />
        <Option
          delay={55}
          badge="OPTION B"
          badgeColor={theme.colors.muted}
          title="Migrate your current Cozmaa number"
          bullets={[
            { icon: "⚠️", text: "Number can NEVER be used on regular WhatsApp again", tone: "warn" },
            { icon: "⚠️", text: "All old chats on that number will be lost", tone: "warn" },
            { icon: "✅", text: "Customers who already have it will reach the right place" },
          ]}
        />
      </div>
      <FadeIn delay={120} from="up">
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 28,
            fontWeight: 700,
            color: theme.colors.secondary,
          }}
        >
          Our suggestion: <span style={{ color: theme.colors.primary }}>Option A</span> — get a new
          number specifically for the website.
        </div>
      </FadeIn>
    </SlideShell>
  );
};
