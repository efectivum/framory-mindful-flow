import { useMemo, useEffect } from "react";

export type TimeOfDayMode = "morning" | "midday" | "evening" | "night";

export function useTimeOfDay(timezone?: string): {
  mode: TimeOfDayMode;
  greeting: string;
  dayProgress: number;
} {
  const now = new Date();
  let hour = now.getHours();

  let mode: TimeOfDayMode;
  if (hour >= 5 && hour < 11) {
    mode = "morning";
  } else if (hour >= 11 && hour < 17) {
    mode = "midday";
  } else if (hour >= 17 && hour < 21) {
    mode = "evening";
  } else {
    mode = "night";
  }

  const greetingMap: Record<TimeOfDayMode, string> = {
    morning: "Good morning",
    midday: "Good afternoon",
    evening: "Good evening",
    night: "Time to rest",
  };

  const greeting = greetingMap[mode];
  const dayProgress = Math.round(((hour * 60 + now.getMinutes()) / (24 * 60)) * 100);

  // Set data-time attribute on document for CSS theming
  useEffect(() => {
    document.documentElement.setAttribute('data-time', mode);
    return () => {
      document.documentElement.removeAttribute('data-time');
    };
  }, [mode]);

  return useMemo(() => ({ mode, greeting, dayProgress }), [mode, greeting, dayProgress]);
}
