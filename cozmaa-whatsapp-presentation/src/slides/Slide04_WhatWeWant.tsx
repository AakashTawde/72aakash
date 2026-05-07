import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

export const Slide04_WhatWeWant: React.FC = () => {
  return (
    <SlideShell number={4} eyebrow="Our View" title="What We Want (the Business Side)">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          marginTop: 30,
        }}
      >
        <FadeIn delay={45} from="left">
          <div
            style={{
              position: "relative",
              background: "white",
              border: `3px solid ${theme.colors.accent}`,
              borderRadius: 30,
              padding: "36px 44px",
              maxWidth: 760,
              fontSize: 30,
              lineHeight: 1.4,
              color: theme.colors.text,
              boxShadow: "0 12px 40px rgba(212,168,67,0.18)",
            }}
          >
            "I want to reply from my phone, like normal WhatsApp. Not learn a
            complicated software with menus and dashboards."
            <div
              style={{
                position: "absolute",
                right: -22,
                top: 50,
                width: 0,
                height: 0,
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderLeft: `22px solid ${theme.colors.accent}`,
              }}
            />
          </div>
        </FadeIn>
        <FadeIn delay={20} from="right">
          <div style={{ fontSize: 280 }}>👨‍⚕️</div>
        </FadeIn>
      </div>
      <FadeIn delay={90} from="up">
        <p
          style={{
            textAlign: "center",
            fontSize: 30,
            color: theme.colors.secondary,
            marginTop: 60,
            fontWeight: 600,
          }}
        >
          We want simplicity. All customer chats in one place — managed easily, on
          our phone.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
