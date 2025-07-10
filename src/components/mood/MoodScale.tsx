import { motion } from 'framer-motion';

interface MoodScaleProps {
  selectedMood: number;
  onMoodChange: (mood: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const MoodScale = ({ selectedMood, onMoodChange, size = 'md' }: MoodScaleProps) => {
  const moodLevels = [
    { value: 1, label: 'Terrible', emoji: '😞' },
    { value: 2, label: 'Poor', emoji: '😔' },
    { value: 3, label: 'Low', emoji: '😕' },
    { value: 4, label: 'Okay', emoji: '😐' },
    { value: 5, label: 'Good', emoji: '😊' },
    { value: 6, label: 'Great', emoji: '😄' },
    { value: 7, label: 'Awesome', emoji: '🤩' },
  ];

  const sizeClasses = {
    sm: {
      container: 'gap-1',
      button: 'w-8 h-8 text-xs',
      emoji: 'text-sm',
      label: 'text-xs'
    },
    md: {
      container: 'gap-2',
      button: 'w-12 h-12 text-sm',
      emoji: 'text-lg',
      label: 'text-sm'
    },
    lg: {
      container: 'gap-3',
      button: 'w-16 h-16 text-base',
      emoji: 'text-2xl',
      label: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="space-y-4">
      {/* Scale buttons */}
      <div className={`flex justify-between items-center ${classes.container}`}>
        {moodLevels.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => onMoodChange(mood.value)}
            className={`
              ${classes.button} rounded-full flex items-center justify-center
              transition-all duration-200 border-2
              ${selectedMood === mood.value
                ? 'border-primary bg-primary/20 shadow-lg scale-110'
                : 'border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/10'
              }
            `}
            whileHover={{ scale: selectedMood === mood.value ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mood.value * 0.05 }}
          >
            <span className={classes.emoji}>{mood.emoji}</span>
          </motion.button>
        ))}
      </div>

      {/* Selected mood label */}
      <motion.div 
        className="text-center"
        key={selectedMood}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`font-medium text-foreground ${classes.label}`}>
          {moodLevels.find(m => m.value === selectedMood)?.label}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {selectedMood}/7
        </div>
      </motion.div>

      {/* Scale line */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-destructive via-warning via-primary to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((selectedMood - 1) / 6) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        
        {/* Scale markers */}
        <div className="absolute top-0 left-0 w-full h-2 flex justify-between">
          {moodLevels.map((mood) => (
            <div
              key={mood.value}
              className={`w-0.5 h-full ${
                selectedMood >= mood.value ? 'bg-transparent' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};