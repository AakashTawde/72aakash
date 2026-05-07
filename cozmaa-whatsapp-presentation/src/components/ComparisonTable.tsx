import React from "react";
import { theme } from "../theme";
import { FadeIn } from "./FadeIn";

export type Column = {
  key: string;
  label: string;
  highlight?: boolean;
};

export type Row = {
  feature: string;
  values: Record<string, string>;
};

export const ComparisonTable: React.FC<{
  columns: Column[];
  rows: Row[];
  startDelay?: number;
  rowDelay?: number;
}> = ({ columns, rows, startDelay = 0, rowDelay = 12 }) => {
  const totalCols = columns.length + 1;
  const cellPad = "20px 22px";
  return (
    <div
      style={{
        width: "100%",
        background: "white",
        borderRadius: 20,
        boxShadow: "0 12px 40px rgba(27,45,79,0.10)",
        overflow: "hidden",
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1.4fr repeat(${columns.length}, 1fr)`,
        }}
      >
        <div
          style={{
            padding: cellPad,
            background: theme.colors.secondary,
            color: "white",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          Feature
        </div>
        {columns.map((c) => (
          <div
            key={c.key}
            style={{
              padding: cellPad,
              background: c.highlight ? theme.colors.primary : theme.colors.secondary,
              color: "white",
              fontWeight: 700,
              fontSize: 22,
              textAlign: "center",
              borderLeft: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {c.label} {c.highlight ? "⭐" : ""}
          </div>
        ))}
        {rows.map((r, ri) => (
          <FadeIn
            key={ri}
            delay={startDelay + ri * rowDelay}
            from="left"
            distance={20}
            style={{ display: "contents" }}
          >
            <div
              style={{
                padding: cellPad,
                fontWeight: 600,
                fontSize: 20,
                background: ri % 2 === 0 ? theme.colors.bgSoft : "white",
                color: theme.colors.secondary,
                gridColumn: 1,
              }}
            >
              {r.feature}
            </div>
            {columns.map((c) => (
              <div
                key={c.key}
                style={{
                  padding: cellPad,
                  fontSize: 20,
                  textAlign: "center",
                  background: c.highlight
                    ? "rgba(10,126,140,0.07)"
                    : ri % 2 === 0
                    ? theme.colors.bgSoft
                    : "white",
                  color: theme.colors.text,
                  borderLeft: `1px solid ${theme.colors.border}`,
                  fontWeight: c.highlight ? 700 : 500,
                }}
              >
                {r.values[c.key] ?? "—"}
              </div>
            ))}
          </FadeIn>
        ))}
      </div>
      <div style={{ height: 0, gridColumn: `span ${totalCols}` }} />
    </div>
  );
};
