
import { useState, useEffect } from "react";
import { useTimeOfDay, TimeOfDayMode } from "./useTimeOfDay";
import { useSmartPrompts } from "./useSmartPrompts";

/**
 * For now: intention is localStorage. Later, store in Supabase per user.
 */
function getTodayDateStr() {
  const d = new Date();
  // Returns YYYY-MM-DD for today
  return d.toISOString().split("T")[0];
}

const INTENTION_KEY = "lumatori_daily_intention_";

export function useTodayContent() {
  const { mode } = useTimeOfDay();
  const { smartPrompt, smartSuggestion, hasPersonalizedData } = useSmartPrompts();

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
  let suggestion: string;
  let showIntentionBox = false;
  let showReflectionSummary = false;
  let showHabits = false;
  let showMoodCheck = false;

  switch (mode) {
    case "morning":
      prompt = intention
        ? hasPersonalizedData 
          ? "Stay mindful of your intention as you move through today:"
          : "Stay mindful of your intention for today:"
        : smartPrompt;
      showIntentionBox = true;
      suggestion = smartSuggestion;
      break;
    case "midday":
      prompt = smartPrompt;
      showReflectionSummary = true;
      showMoodCheck = true;
      suggestion = smartSuggestion;
      break;
    case "evening":
      prompt = smartPrompt;
      showReflectionSummary = true;
      showHabits = true;
      showMoodCheck = true;
      suggestion = smartSuggestion;
      break;
    default:
      prompt = smartPrompt;
      suggestion = smartSuggestion;
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
    hasPersonalizedData,
  };
}
