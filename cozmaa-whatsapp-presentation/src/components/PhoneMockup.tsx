import React from "react";
import { theme } from "../theme";

export const PhoneMockup: React.FC<{
  label?: string;
  headerColor?: string;
  headerTitle?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({
  label,
  headerColor = "#075E54",
  headerTitle = "Cozmaa Clinic",
  children,
  width = 320,
  height = 620,
  style,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      <div
        style={{
          width,
          height,
          borderRadius: 44,
          background: "#111",
          padding: 12,
          boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 32,
            background: "#ECE5DD",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: headerColor,
              color: "white",
              padding: "18px 20px",
              fontWeight: 600,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              C
            </div>
            <div>
              <div>{headerTitle}</div>
              <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>online</div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              overflow: "hidden",
            }}
          >
            {children}
          </div>
        </div>
      </div>
      {label && (
        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            fontWeight: 600,
            color: theme.colors.secondary,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
