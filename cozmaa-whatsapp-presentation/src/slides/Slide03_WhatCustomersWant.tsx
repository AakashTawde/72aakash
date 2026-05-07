import React from "react";
import { SlideShell } from "../components/SlideShell";
import { FadeIn } from "../components/FadeIn";
import { theme } from "../theme";

export const Slide03_WhatCustomersWant: React.FC = () => {
  return (
    <SlideShell number={3} eyebrow="The Customer's View" title="What Customers Actually Want">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          marginTop: 30,
        }}
      >
        <FadeIn delay={20} from="left">
          <div style={{ fontSize: 280 }}>👩‍💻</div>
        </FadeIn>
        <FadeIn delay={45} from="right">
          <div
            style={{
              position: "relative",
              background: "white",
              border: `3px solid ${theme.colors.primary}`,
              borderRadius: 30,
              padding: "36px 44px",
              maxWidth: 720,
              fontSize: 30,
              lineHeight: 1.4,
              color: theme.colors.text,
              boxShadow: "0 12px 40px rgba(10,126,140,0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -22,
                top: 50,
                width: 0,
                height: 0,
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderRight: `22px solid ${theme.colors.primary}`,
              }}
            />
            "I just want to ask a quick question. Without downloading anything,
            scanning any QR codes, or filling forms."
          </div>
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
          Customers want to chat instantly. Right there. On the website. No extra steps.
        </p>
      </FadeIn>
    </SlideShell>
  );
};
