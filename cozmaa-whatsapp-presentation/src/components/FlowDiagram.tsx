import React from "react";
import { theme } from "../theme";
import { FadeIn } from "./FadeIn";

type Node = { icon: string; label: string; sub?: string };

export const FlowDiagram: React.FC<{
  nodes: Node[];
  startDelay?: number;
  perStep?: number;
}> = ({ nodes, startDelay = 0, perStep = 14 }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
      }}
    >
      {nodes.map((n, i) => (
        <React.Fragment key={i}>
          <FadeIn delay={startDelay + i * perStep * 2} from="up">
            <div
              style={{
                width: 200,
                background: theme.colors.bgSoft,
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: 24,
                padding: 22,
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(10,126,140,0.10)",
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 8 }}>{n.icon}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: theme.colors.secondary,
                  lineHeight: 1.2,
                }}
              >
                {n.label}
              </div>
              {n.sub && (
                <div style={{ fontSize: 14, color: theme.colors.muted, marginTop: 6 }}>
                  {n.sub}
                </div>
              )}
            </div>
          </FadeIn>
          {i < nodes.length - 1 && (
            <FadeIn delay={startDelay + i * perStep * 2 + perStep} from="left">
              <div
                style={{
                  fontSize: 38,
                  color: theme.colors.accent,
                  fontWeight: 700,
                }}
              >
                →
              </div>
            </FadeIn>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
