import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

const CostRow: React.FC<{
  delay: number;
  label: string;
  amount: string;
  free?: boolean;
}> = ({ delay, label, amount, free }) => (
  <FadeIn delay={delay} from="left">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        borderRadius: 16,
        padding: "22px 28px",
        border: `1px solid ${theme.colors.border}`,
        fontSize: 24,
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      <span style={{ color: theme.colors.text, fontWeight: 500 }}>{label}</span>
      <span
        style={{
          color: free ? theme.colors.success : theme.colors.secondary,
          fontWeight: 700,
          fontSize: 26,
        }}
      >
        {amount}
      </span>
    </div>
  </FadeIn>
);

export const Slide12_Costs: React.FC = () => {
  return (
    <SlideShell number={12} eyebrow="Real Numbers" title="What it'll actually cost per month">
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 1200 }}>
        <CostRow delay={20} label="Platform fee (AiSensy plan)" amount="₹1,500 / month" />
        <CostRow
          delay={40}
          label="Messages from customers to us (within 24 hrs)"
          amount="FREE"
          free
        />
        <CostRow delay={60} label="Our replies to customers (within 24 hrs)" amount="FREE" free />
        <CostRow delay={80} label="Promotional messages we send (optional)" amount="₹0.86 / msg" />
        <CostRow delay={100} label="Appointment reminders we send" amount="₹0.12 / msg" />
      </div>
      <FadeIn delay={130} from="up">
        <div
          style={{
            marginTop: 36,
            background: theme.colors.primary,
            color: "white",
            borderRadius: 22,
            padding: "30px 36px",
            textAlign: "center",
            boxShadow: "0 16px 40px rgba(10,126,140,0.30)",
          }}
        >
          <div style={{ fontSize: 22, opacity: 0.9, marginBottom: 8, letterSpacing: 1 }}>
            BOTTOM LINE
          </div>
          <div style={{ fontSize: 46, fontWeight: 800 }}>
            ₹1,500 – ₹2,500 / month for normal clinic usage
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={170} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 22,
            color: theme.colors.muted,
            marginTop: 18,
            fontStyle: "italic",
          }}
        >
          Less than the cost of one new patient per month.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
