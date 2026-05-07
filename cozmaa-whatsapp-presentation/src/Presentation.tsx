import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FPS } from "./theme";
import { Slide01_Title } from "./slides/Slide01_Title";
import { Slide02_Problem } from "./slides/Slide02_Problem";
import { Slide03_WhatCustomersWant } from "./slides/Slide03_WhatCustomersWant";
import { Slide04_WhatWeWant } from "./slides/Slide04_WhatWeWant";
import { Slide05_SolutionOverview } from "./slides/Slide05_SolutionOverview";
import { Slide06_BusinessAPI } from "./slides/Slide06_BusinessAPI";
import { Slide07_RealityCheck } from "./slides/Slide07_RealityCheck";
import { Slide08_WhereToReply } from "./slides/Slide08_WhereToReply";
import { Slide09_PhoneNumber } from "./slides/Slide09_PhoneNumber";
import { Slide10_BSPs } from "./slides/Slide10_BSPs";
import { Slide11_BSPComparison } from "./slides/Slide11_BSPComparison";
import { Slide12_Costs } from "./slides/Slide12_Costs";
import { Slide13_ConversationFlow } from "./slides/Slide13_ConversationFlow";
import { Slide14_Benefits } from "./slides/Slide14_Benefits";
import { Slide15_SetupProcess } from "./slides/Slide15_SetupProcess";
import { Slide16_KeepInMind } from "./slides/Slide16_KeepInMind";
import { Slide17_Recommendation } from "./slides/Slide17_Recommendation";
import { Slide18_NextSteps } from "./slides/Slide18_NextSteps";

const SECONDS = (s: number) => Math.round(s * FPS);

const SCHEDULE: { Component: React.FC; seconds: number }[] = [
  { Component: Slide01_Title, seconds: 8 },
  { Component: Slide02_Problem, seconds: 12 },
  { Component: Slide03_WhatCustomersWant, seconds: 9 },
  { Component: Slide04_WhatWeWant, seconds: 9 },
  { Component: Slide05_SolutionOverview, seconds: 12 },
  { Component: Slide06_BusinessAPI, seconds: 11 },
  { Component: Slide07_RealityCheck, seconds: 13 },
  { Component: Slide08_WhereToReply, seconds: 11 },
  { Component: Slide09_PhoneNumber, seconds: 12 },
  { Component: Slide10_BSPs, seconds: 11 },
  { Component: Slide11_BSPComparison, seconds: 12 },
  { Component: Slide12_Costs, seconds: 13 },
  { Component: Slide13_ConversationFlow, seconds: 14 },
  { Component: Slide14_Benefits, seconds: 12 },
  { Component: Slide15_SetupProcess, seconds: 12 },
  { Component: Slide16_KeepInMind, seconds: 12 },
  { Component: Slide17_Recommendation, seconds: 10 },
  { Component: Slide18_NextSteps, seconds: 11 },
];

export const TOTAL_FRAMES = SCHEDULE.reduce((acc, s) => acc + SECONDS(s.seconds), 0);

export const Presentation: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      {SCHEDULE.map(({ Component, seconds }, i) => {
        const duration = SECONDS(seconds);
        const start = from;
        from += duration;
        return (
          <Sequence key={i} from={start} durationInFrames={duration}>
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
