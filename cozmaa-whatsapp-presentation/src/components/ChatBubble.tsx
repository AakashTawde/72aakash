import React from "react";
import { theme } from "../theme";

export const ChatBubble: React.FC<{
  side?: "in" | "out";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ side = "in", children, style }) => {
  const isOut = side === "out";
  return (
    <div
      style={{
        alignSelf: isOut ? "flex-end" : "flex-start",
        maxWidth: "80%",
        background: isOut ? "#DCF8C6" : "#FFFFFF",
        color: theme.colors.text,
        padding: "16px 22px",
        borderRadius: 22,
        borderBottomRightRadius: isOut ? 4 : 22,
        borderBottomLeftRadius: isOut ? 22 : 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        fontSize: 24,
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
