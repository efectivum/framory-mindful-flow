import { motion } from 'framer-motion';

interface MoodGradientProps {
  mood: number; // 1-7 scale
  className?: string;
}

export const MoodGradient = ({ mood, className = "" }: MoodGradientProps) => {
  // Map mood to gradient colors
  const getGradient = (mood: number) => {
    const gradients = {
      1: 'linear-gradient(135deg, hsl(0, 80%, 20%), hsl(0, 60%, 10%))', // Terrible - dark red
      2: 'linear-gradient(135deg, hsl(20, 70%, 25%), hsl(20, 50%, 15%))', // Poor - dark orange
      3: 'linear-gradient(135deg, hsl(40, 60%, 30%), hsl(40, 40%, 20%))', // Low - dark yellow
      4: 'linear-gradient(135deg, hsl(60, 50%, 35%), hsl(60, 30%, 25%))', // Okay - muted yellow
      5: 'linear-gradient(135deg, hsl(120, 40%, 30%), hsl(120, 30%, 20%))', // Good - green
      6: 'linear-gradient(135deg, hsl(200, 50%, 35%), hsl(200, 40%, 25%))', // Great - blue
      7: 'linear-gradient(135deg, hsl(280, 60%, 40%), hsl(280, 50%, 30%))', // Awesome - purple
    };
    return gradients[mood as keyof typeof gradients] || gradients[4];
  };

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        background: getGradient(mood),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};