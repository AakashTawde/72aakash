import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { FadeIn } from "../components/FadeIn";

export const Slide01_Title: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.colors.bg} 0%, ${theme.colors.primarySoft} 100%)`,
        fontFamily: theme.font,
        color: theme.colors.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {[...Array(8)].map((_, i) => {
        const offset = i * 24;
        const y = 1080 + 200 - ((frame * 1.2 + offset * 60) % 1400);
        const x = 80 + ((i * 213) % 1700);
        const op = interpolate(y, [0, 200, 800, 1080], [0, 0.6, 0.6, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: y,
              left: x,
              opacity: op,
              fontSize: 80,
            }}
          >
            💬
          </div>
        );
      })}
      <div style={{ textAlign: "center", zIndex: 2, maxWidth: 1400 }}>
        <FadeIn delay={4} from="up">
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 30,
              background: theme.colors.primary,
              margin: "0 auto 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 64,
              boxShadow: "0 12px 40px rgba(10,126,140,0.30)",
              letterSpacing: 2,
            }}
          >
            C
          </div>
        </FadeIn>
        <FadeIn delay={14} from="up">
          <h1
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: theme.colors.secondary,
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            WhatsApp Chat Solution
            <br />
            for <span style={{ color: theme.colors.primary }}>Cozmaa.com</span>
          </h1>
        </FadeIn>
        <FadeIn delay={32} from="up">
          <p
            style={{
              fontSize: 36,
              color: theme.colors.muted,
              marginTop: 28,
              fontWeight: 500,
            }}
          >
            How customers will chat with us — directly from our website
          </p>
        </FadeIn>
        <FadeIn delay={50} from="up">
          <div
            style={{
              marginTop: 40,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: theme.colors.accent,
              fontWeight: 700,
            }}
          >
            A simple guide · No technical jargon
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
};
