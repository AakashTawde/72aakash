import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { FadeIn } from "./FadeIn";

export const SlideShell: React.FC<{
  number?: number;
  eyebrow?: string;
  title?: string;
  background?: string;
  children: React.ReactNode;
}> = ({ number, eyebrow, title, background, children }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: background ?? theme.colors.bg,
        fontFamily: theme.font,
        color: theme.colors.text,
        padding: "70px 110px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {(eyebrow || title) && (
        <div style={{ marginBottom: 30 }}>
          {eyebrow && (
            <FadeIn delay={2} from="left">
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: theme.colors.primary,
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                {eyebrow}
              </div>
            </FadeIn>
          )}
          {title && (
            <FadeIn delay={6} from="up">
              <h1
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: theme.colors.secondary,
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {title}
              </h1>
            </FadeIn>
          )}
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {children}
      </div>
      {number !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 18,
            color: theme.colors.muted,
            letterSpacing: 2,
          }}
        >
          {String(number).padStart(2, "0")} / 18 — Cozmaa
        </div>
      )}
    </AbsoluteFill>
  );
};
