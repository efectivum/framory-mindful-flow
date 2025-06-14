
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useConversationalAI } from "@/hooks/useConversationalAI";
import { Loader2, Bot, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PrefKey = "growth_focus" | "tone_of_voice" | "notification_frequency" | "notification_time";

const botAvatar = (
  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
    <Bot className="w-5 h-5" />
  </div>
);

const userAvatar = (
  <div className="w-9 h-9 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">
    <User className="w-5 h-5" />
  </div>
);

// What we want to capture
const prefQuestions: { key: PrefKey; question: string }[] = [
  {
    key: "growth_focus",
    question: "Welcome to Framory! What's your main personal growth focus right now? (e.g. Habits, Mindfulness, Goals, Journaling)",
  },
  {
    key: "tone_of_voice",
    question: "Which coaching tone do you prefer for your guidance? (e.g. Calm, Motivational, Supportive, Direct, Gentle)",
  },
  {
    key: "notification_frequency",
    question: "How often would you like reminders for check-ins and insights? (Daily, Weekly, Custom, or None)",
  },
  {
    key: "notification_time",
    question: "At what time of day would you like your reminders? (e.g. 08:00 or 20:30, 24-hour format)",
  },
];

const toneChoices = ["calm", "motivational", "supportive", "direct", "gentle"];
const focusChoices = ["habits", "mindfulness", "goals", "journaling"];
const freqChoices = ["daily", "weekly", "custom", "none"];

function normalize<T extends string>(value: string, allowed: T[], fallback: T): T {
  if (!value) return fallback;
  const v = value.toLowerCase().trim();
  const found = allowed.find((opt) => v.includes(opt));
  return found || fallback;
}

export default function ConversationalOnboarding() {
  const { preferences, updatePreferences, isUpdating } = useUserPreferences();
  const { generateResponse, isGeneratingResponse } = useConversationalAI();
  const navigate = useNavigate();

  // For the chat UI
  const [messages, setMessages] = useState<Array<{ sender: "bot" | "user"; content: string }>>([]);
  const [step, setStep] = useState(0); // prefQuestions step
  const [input, setInput] = useState("");
  const [collected, setCollected] = useState<{
    growth_focus?: string;
    tone_of_voice?: string;
    notification_frequency?: string;
    notification_time?: string;
  }>({});
  const [confirming, setConfirming] = useState(false);
  const [complete, setComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // If onboarding is already done, redirect to dash after slight delay
  useEffect(() => {
    if (
      preferences &&
      preferences.tone_of_voice &&
      preferences.growth_focus &&
      preferences.notification_frequency &&
      preferences.notification_time
    ) {
      setTimeout(() => navigate("/"), 700);
    }
  }, [preferences, navigate]);

  // Initialize bot message on mount or step advance
  useEffect(() => {
    if (step < prefQuestions.length) {
      const msg = prefQuestions[step].question;
      setMessages((prev) =>
        prev.length === 0
          ? [{ sender: "bot", content: msg }]
          : [...prev, { sender: "bot", content: msg }]
      );
    }
    if (inputRef.current) inputRef.current.focus();
    // eslint-disable-next-line
  }, [step]);

  // Handle user sending input
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", content: userMsg }]);
    setInput("");

    // Step key and options
    const key = prefQuestions[step].key;

    // For demo: simple "AI" extraction
    let extracted = userMsg;

    // For more advanced: use OpenAI to extract
    if (key === "tone_of_voice") {
      extracted = normalize(userMsg, toneChoices, "supportive");
    }
    if (key === "growth_focus") {
      extracted = normalize(userMsg, focusChoices, "habits");
    }
    if (key === "notification_frequency") {
      extracted = normalize(userMsg, freqChoices, "daily");
    }
    if (key === "notification_time") {
      // Accept any valid HH:mm (do basic validation)
      const match = userMsg.match(/([01]\d|2[0-3]):([0-5]\d)/);
      extracted = match ? match[0] : "08:00";
    }
    // Save
    setCollected((prev) => ({ ...prev, [key]: extracted }));

    // Add an empathetic AI reply
    let followup = "";
    switch (key) {
      case "growth_focus":
        followup = `Great, focusing on "${extracted.charAt(0).toUpperCase() + extracted.slice(1)}" is a strong foundation for growth.`;
        break;
      case "tone_of_voice":
        followup = `Got it! I'll use a "${extracted.charAt(0).toUpperCase() + extracted.slice(1)}" coaching style for your insights.`;
        break;
      case "notification_frequency":
        followup =
          extracted === "none"
            ? "No reminders, understood! You can turn them on anytime in your preferences."
            : `Awesome. I'll remind you "${extracted}" for your check-ins.`;
        break;
      case "notification_time":
        followup = `Scheduled reminders for ${extracted}.`;
        break;
    }
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", content: followup }]);
      // Go to next step
      if (step < prefQuestions.length - 1) {
        setStep((s) => s + 1);
      } else {
        setTimeout(() => {
          setConfirming(true);
        }, 900);
      }
    }, 800);
  };

  // Save preferences
  const handleConfirm = async () => {
    if (
      !collected.growth_focus ||
      !collected.tone_of_voice ||
      !collected.notification_frequency ||
      !collected.notification_time
    )
      return;

    updatePreferences(
      {
        growth_focus: normalize(collected.growth_focus, focusChoices, "habits") as any,
        tone_of_voice: normalize(collected.tone_of_voice, toneChoices, "supportive") as any,
        notification_frequency: normalize(collected.notification_frequency, freqChoices, "daily") as any,
        notification_time: collected.notification_time,
        push_notifications_enabled: collected.notification_frequency !== "none",
        whatsapp_enabled: false,
      },
      {
        onSuccess: () => {
          setComplete(true);
          setTimeout(() => {
            navigate("/");
          }, 1200);
        },
      }
    );
  };

  // Allow pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // If confirming, show summary and confirm dialog
  if (confirming) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <Card className="w-full max-w-lg bg-gray-800/80 border-gray-700/60 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Just to confirm...</h2>
            <p className="text-gray-200 mb-4">
              <span className="block mb-2">Growth Focus: <b>{collected.growth_focus}</b></span>
              <span className="block mb-2">Coaching Tone: <b>{collected.tone_of_voice}</b></span>
              <span className="block mb-2">Reminder Frequency: <b>{collected.notification_frequency}</b></span>
              <span className="block mb-2">Reminder Time: <b>{collected.notification_time}</b></span>
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2"
              onClick={handleConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Looks Great! Finish"}
            </Button>
            <button
              className="w-full mt-2 text-gray-400 underline text-sm"
              onClick={() => {
                setConfirming(false);
                setStep(0);
                setCollected({});
                setMessages([]);
              }}
            >
              Start Over
            </button>
            {complete && (
              <div className="flex justify-center mt-6 animate-fade-in">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mr-2" />
                <span className="text-blue-300 text-lg">Onboarding complete! Redirecting...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-lg bg-gray-800/60 border-gray-700/60 backdrop-blur-md shadow-xl">
        <CardContent className="p-8 flex flex-col">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white mb-1 text-center">Welcome to Framory!</h1>
            <p className="text-gray-400 text-center mb-4">Let's chat and personalize your experience 🧠💬</p>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[340px] space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end mb-1 ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                {msg.sender === "bot" ? botAvatar : null}
                <span
                  className={`mx-2 px-4 py-2 rounded-2xl ${
                    msg.sender === "bot"
                      ? "bg-blue-600/90 text-white rounded-bl-[0.25rem]"
                      : "bg-gray-100 text-gray-900 rounded-br-[0.25rem]"
                  }`}
                  style={{ maxWidth: 280 }}
                >
                  {msg.content}
                </span>
                {msg.sender === "user" ? userAvatar : null}
              </div>
            ))}
            {(isGeneratingResponse || isUpdating) && (
              <div className="flex items-center gap-2 justify-start mt-2 animate-pulse">
                {botAvatar}
                <span className="bg-blue-500/70 text-white px-4 py-2 rounded-2xl">
                  {isGeneratingResponse ? "Thinking..." : "Saving..."}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              ref={inputRef}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Type your answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGeneratingResponse || isUpdating}
              maxLength={40}
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl"
              onClick={handleSend}
              disabled={!input.trim() || isGeneratingResponse || isUpdating}
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Your answers help personalize your coaching. You can change preferences anytime in your Profile.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
