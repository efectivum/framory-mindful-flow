
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Loader2 } from "lucide-react";

const tones = [
  { key: "calm", label: "Calm" },
  { key: "motivational", label: "Motivational" },
  { key: "supportive", label: "Supportive" },
  { key: "direct", label: "Direct" },
  { key: "gentle", label: "Gentle" },
];

const focuses = [
  { key: "habits", label: "Habits" },
  { key: "mindfulness", label: "Mindfulness" },
  { key: "goals", label: "Goals" },
  { key: "journaling", label: "Journaling" },
];

const freqChoices = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "custom", label: "Custom" },
  { key: "none", label: "None" },
];

const Onboarding = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences, isUpdating } = useUserPreferences();
  const [step, setStep] = useState(0);
  const [tone, setTone] = useState<string>(preferences?.tone_of_voice ?? "");
  const [focus, setFocus] = useState<string>(preferences?.growth_focus ?? "");
  const [frequency, setFrequency] = useState<string>(preferences?.notification_frequency ?? "daily");
  const [time, setTime] = useState<string>(preferences?.notification_time ?? "08:00");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  // If onboarding is already done, redirect
  if (preferences && preferences.tone_of_voice && preferences.growth_focus && preferences.notification_frequency) {
    setTimeout(() => navigate("/"), 500);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <span className="text-white animate-pulse">Redirecting to your dashboard...</span>
      </div>
    );
  }

  const handleSubmit = async () => {
    updatePreferences(
      {
        tone_of_voice: tone as "calm" | "motivational" | "supportive" | "direct" | "gentle",
        growth_focus: focus as "habits" | "mindfulness" | "goals" | "journaling",
        notification_frequency: frequency as "daily" | "weekly" | "custom" | "none",
        notification_time: time,
        push_notifications_enabled: frequency !== "none",
        whatsapp_enabled: false,
      },
      {
        onSuccess: () => {
          setDone(true);
          setTimeout(() => navigate("/"), 1200);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-lg bg-gray-800/60 border-gray-700/60 backdrop-blur-md shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome to Framory!</h1>
            <p className="text-gray-400">Let's set up your personalized experience</p>
          </div>
          {step === 0 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-4">What's your main growth focus?</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {focuses.map((f) => (
                  <button
                    key={f.key}
                    className={`py-4 rounded-lg text-white font-medium border transition ${focus === f.key ? "bg-blue-600 border-blue-600" : "bg-gray-700/60 border-gray-700 hover:bg-gray-700/80"}`}
                    onClick={() => setFocus(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                disabled={!focus}
                onClick={() => setStep(1)}
              >
                Next
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-4">What's your preferred coaching tone?</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {tones.map((t) => (
                  <button
                    key={t.key}
                    className={`py-4 rounded-lg text-white font-medium border transition ${tone === t.key ? "bg-blue-600 border-blue-600" : "bg-gray-700/60 border-gray-700 hover:bg-gray-700/80"}`}
                    onClick={() => setTone(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-white border-gray-600" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!tone}
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-4">Set up daily reminders?</h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  {freqChoices.map(f => (
                    <button
                      key={f.key}
                      className={`flex-1 py-3 rounded-lg font-medium border transition ${frequency === f.key ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-700/60 border-gray-700 text-gray-300 hover:bg-gray-700/80"}`}
                      onClick={() => setFrequency(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                {frequency !== "none" && (
                  <div className="flex items-center gap-2">
                    <label className="text-gray-200 text-sm">Time:</label>
                    <input
                      type="time"
                      className="bg-gray-700/70 border border-gray-600 rounded px-3 py-2 text-white w-32 focus:outline-none"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-white border-gray-600" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isUpdating}
                  onClick={handleSubmit}
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Finish"}
                </Button>
              </div>
            </>
          )}
          {done && (
            <div className="flex flex-col items-center mt-8 animate-fade-in">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
              <span className="text-blue-300 text-lg">Onboarding complete! Redirecting...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Onboarding;
