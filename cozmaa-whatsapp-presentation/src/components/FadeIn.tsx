import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Direction = "up" | "down" | "left" | "right" | "none";

export const FadeIn: React.FC<{
  delay?: number;
  duration?: number;
  from?: Direction;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, duration = 20, from = "up", distance = 30, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const opacity = interpolate(local, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.6 },
  });

  let tx = 0;
  let ty = 0;
  if (from === "up") ty = (1 - progress) * distance;
  if (from === "down") ty = (1 - progress) * -distance;
  if (from === "left") tx = (1 - progress) * distance;
  if (from === "right") tx = (1 - progress) * -distance;

  return (
    <div
      style={{
        opacity,
        transform: `translate(${tx}px, ${ty}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
