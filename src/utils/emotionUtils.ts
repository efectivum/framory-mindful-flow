
const emotionColors: Record<string, string> = {
  joy: 'bg-yellow-400',
  happiness: 'bg-yellow-400',
  gratitude: 'bg-green-400',
  love: 'bg-pink-400',
  excitement: 'bg-orange-400',
  peace: 'bg-blue-300',
  hope: 'bg-purple-300',
  anxiety: 'bg-red-400',
  stress: 'bg-red-500',
  sadness: 'bg-blue-600',
  anger: 'bg-red-600',
  frustration: 'bg-orange-600',
  worry: 'bg-yellow-600',
  fear: 'bg-gray-600',
  loneliness: 'bg-indigo-600',
  confusion: 'bg-gray-500',
  neutral: 'bg-gray-400',
  calm: 'bg-blue-200',
  contentment: 'bg-green-300',
  pride: 'bg-purple-400',
};

const emotionInsights: Record<string, { description: string; patterns: string; growth: string }> = {
  joy: {
    description: "Joy represents moments of pure happiness and celebration in your life. It often emerges from achievements, connections with others, or experiencing something meaningful.",
    patterns: "Joy typically appears during social interactions, accomplishments, or when engaging in activities you're passionate about. It tends to be more frequent on weekends and during positive life events.",
    growth: "Cultivating joy involves recognizing and savoring positive moments, practicing gratitude, and engaging in activities that bring you genuine happiness."
  },
  happiness: {
    description: "Happiness reflects your overall sense of well-being and contentment. It's a broader emotional state that encompasses satisfaction with life's various aspects.",
    patterns: "Happiness often correlates with periods of stability, progress toward goals, and meaningful relationships. It tends to be sustained rather than momentary.",
    growth: "Building happiness involves aligning your actions with your values, nurturing relationships, and finding purpose in your daily activities."
  },
  anxiety: {
    description: "Anxiety indicates your mind's response to uncertainty or perceived threats. While challenging, it can also signal that you care deeply about outcomes.",
    patterns: "Anxiety often emerges before important events, during transitions, or when facing unfamiliar situations. It may be more prominent during busy periods or when feeling overwhelmed.",
    growth: "Managing anxiety involves developing coping strategies, practicing mindfulness, and gradually facing fears in manageable steps."
  },
  sadness: {
    description: "Sadness is a natural response to loss, disappointment, or difficult circumstances. It allows for processing and healing from challenging experiences.",
    patterns: "Sadness may appear during significant changes, losses, or when reflecting on past experiences. It often comes in waves and can be triggered by memories or anniversaries.",
    growth: "Processing sadness healthily involves allowing yourself to feel it, seeking support when needed, and finding meaning in difficult experiences."
  },
  stress: {
    description: "Stress reflects your response to pressure and demands. While some stress can be motivating, chronic stress signals the need for better balance and coping strategies.",
    patterns: "Stress often peaks during deadlines, conflicts, or when juggling multiple responsibilities. It may be more intense during certain times of day or specific situations.",
    growth: "Managing stress involves identifying triggers, developing healthy coping mechanisms, and creating boundaries to protect your well-being."
  }
};

export const getEmotionColor = (emotion: string) => {
  return emotionColors[emotion.toLowerCase()] || 'bg-gray-400';
};

export const getEmotionAnalysis = (emotion: string, emotions: Record<string, number>) => {
  const intensity = emotions[emotion];
  const maxIntensity = Math.max(...Object.values(emotions));
  const insight = emotionInsights[emotion.toLowerCase()] || {
    description: `${emotion} is an important emotion that reflects your inner experiences and responses to life events.`,
    patterns: `This emotion appears in your journal entries with varying frequency, often connected to specific situations or contexts.`,
    growth: `Understanding and working with this emotion can contribute to your personal growth and emotional awareness.`
  };

  return {
    frequency: intensity,
    maxFrequency: maxIntensity,
    percentage: Math.round((intensity / maxIntensity) * 100),
    ...insight
  };
};
