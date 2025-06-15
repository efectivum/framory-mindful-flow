
import { useState, useEffect } from "react";
import { useTimeOfDay, TimeOfDayMode } from "./useTimeOfDay";

/**
 * For now: intention is localStorage. Later, store in Supabase per user.
 */
function getTodayDateStr() {
  const d = new Date();
  // Returns YYYY-MM-DD for today
  return d.toISOString().split("T")[0];
}

const INTENTION_KEY = "framory_daily_intention_";

export function useTodayContent() {
  const { mode } = useTimeOfDay();

  // Intention management
  const [intention, setIntention] = useState<string>("");

  useEffect(() => {
    const key = INTENTION_KEY + getTodayDateStr();
    setIntention(localStorage.getItem(key) || "");
  }, []);

  const saveIntention = (intent: string) => {
    const key = INTENTION_KEY + getTodayDateStr();
    localStorage.setItem(key, intent);
    setIntention(intent);
  };

  // Context-appropriate prompt and components
  let prompt: string;
  let suggestion: string | undefined;
  let showIntentionBox = false;
  let showReflectionSummary = false;
  let showHabits = false;
  let showMoodCheck = false;

  switch (mode) {
    case "morning":
      prompt = intention
        ? "Stay mindful of your intention for today:"
        : "What's your one intention for today?";
      showIntentionBox = true;
      suggestion = "Set a simple intention and kickstart your day!";
      break;
    case "midday":
      prompt = "Take a breath. How is your day unfolding?";
      showReflectionSummary = true;
      showMoodCheck = true;
      suggestion = "You can log a quick reflection or update your habits.";
      break;
    case "evening":
      prompt = "Let's wind down and reflect on your day.";
      showReflectionSummary = true;
      showHabits = true;
      showMoodCheck = true;
      suggestion = "You can write a short journal or log your mood.";
      break;
    default:
      prompt = "Rest and recharge. Ready for tomorrow?";
      break;
  }

  return {
    mode,
    prompt,
    intention,
    suggestion,
    showIntentionBox,
    showHabits,
    showReflectionSummary,
    showMoodCheck,
    setIntention: saveIntention,
  };
}
