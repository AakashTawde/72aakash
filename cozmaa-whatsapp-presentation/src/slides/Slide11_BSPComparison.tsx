import React from "react";
import { SlideShell } from "../components/SlideShell";
import { ComparisonTable } from "../components/ComparisonTable";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

export const Slide11_BSPComparison: React.FC = () => {
  return (
    <SlideShell number={11} eyebrow="Top 3 BSP Options" title="Which provider should we pick?">
      <FadeIn delay={18} from="up">
        <p style={{ fontSize: 24, color: theme.colors.muted, marginTop: -10, marginBottom: 26 }}>
          We've shortlisted three. Here's how they compare for a clinic our size.
        </p>
      </FadeIn>
      <ComparisonTable
        startDelay={30}
        rowDelay={14}
        columns={[
          { key: "aisensy", label: "AiSensy", highlight: true },
          { key: "interakt", label: "Interakt" },
          { key: "wati", label: "Wati" },
        ]}
        rows={[
          {
            feature: "Starting price",
            values: { aisensy: "₹1,500/mo", interakt: "₹999/mo", wati: "₹2,499/mo" },
          },
          {
            feature: "Free trial",
            values: { aisensy: "14 days", interakt: "Yes", wati: "7 days" },
          },
          {
            feature: "Mobile app",
            values: { aisensy: "✅", interakt: "✅", wati: "✅" },
          },
          {
            feature: "Indian company",
            values: { aisensy: "✅", interakt: "✅ (Jio)", wati: "❌ Global" },
          },
          {
            feature: "Best for",
            values: {
              aisensy: "Small clinics",
              interakt: "Tightest budget",
              wati: "Larger teams",
            },
          },
        ]}
      />
      <FadeIn delay={140} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 24,
            color: theme.colors.secondary,
            marginTop: 30,
            fontWeight: 600,
          }}
        >
          ⭐ Our pick: <span style={{ color: theme.colors.primary }}>AiSensy</span> — best balance
          of price, support and features for Cozmaa.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
