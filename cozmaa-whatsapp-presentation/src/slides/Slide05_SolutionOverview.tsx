import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FlowDiagram } from "../components/FlowDiagram";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

export const Slide05_SolutionOverview: React.FC = () => {
  return (
    <SlideShell number={5} eyebrow="The Solution" title="How It Works — End to End">
      <FadeIn delay={18} from="up">
        <p style={{ fontSize: 26, color: theme.colors.muted, marginTop: -10, marginBottom: 50 }}>
          Customer types on our website. We get it on our phone. We reply. Done.
        </p>
      </FadeIn>
      <FlowDiagram
        startDelay={30}
        nodes={[
          { icon: "💻", label: "Customer's Laptop", sub: "Visits cozmaa.com" },
          { icon: "💬", label: "Chat Widget", sub: "On our website" },
          { icon: "☁️", label: "WhatsApp Cloud", sub: "Meta's network" },
          { icon: "📱", label: "Our Business App", sub: "Notifies us instantly" },
          { icon: "👨‍⚕️", label: "We Reply", sub: "From anywhere" },
        ]}
      />
      <FadeIn delay={180} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 28,
            color: theme.colors.secondary,
            marginTop: 60,
            fontWeight: 600,
          }}
        >
          The customer never leaves our website. We never leave our phone.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
