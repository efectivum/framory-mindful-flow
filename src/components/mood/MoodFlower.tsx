import { motion } from 'framer-motion';

interface MoodFlowerProps {
  mood: number; // 1-7 scale
  size?: number;
}

export const MoodFlower = ({ mood, size = 120 }: MoodFlowerProps) => {
  // Map mood to flower properties
  const getFlowerProps = (mood: number) => {
    const configs = {
      1: { // Terrible
        petals: 4,
        petalColor: 'hsl(0, 80%, 45%)',
        centerColor: 'hsl(0, 60%, 30%)',
        scale: 0.6,
        rotation: -15,
        opacity: 0.7
      },
      2: { // Poor
        petals: 5,
        petalColor: 'hsl(20, 70%, 55%)',
        centerColor: 'hsl(20, 50%, 40%)',
        scale: 0.7,
        rotation: -10,
        opacity: 0.8
      },
      3: { // Low
        petals: 6,
        petalColor: 'hsl(40, 60%, 60%)',
        centerColor: 'hsl(40, 50%, 45%)',
        scale: 0.8,
        rotation: -5,
        opacity: 0.85
      },
      4: { // Okay
        petals: 7,
        petalColor: 'hsl(60, 70%, 65%)',
        centerColor: 'hsl(60, 60%, 50%)',
        scale: 0.9,
        rotation: 0,
        opacity: 0.9
      },
      5: { // Good
        petals: 8,
        petalColor: 'hsl(120, 60%, 60%)',
        centerColor: 'hsl(120, 70%, 45%)',
        scale: 1.0,
        rotation: 5,
        opacity: 0.95
      },
      6: { // Great
        petals: 9,
        petalColor: 'hsl(200, 70%, 65%)',
        centerColor: 'hsl(200, 80%, 50%)',
        scale: 1.1,
        rotation: 10,
        opacity: 1.0
      },
      7: { // Awesome
        petals: 10,
        petalColor: 'hsl(280, 80%, 70%)',
        centerColor: 'hsl(280, 90%, 55%)',
        scale: 1.2,
        rotation: 15,
        opacity: 1.0
      }
    };
    return configs[mood as keyof typeof configs] || configs[4];
  };

  const flowerProps = getFlowerProps(mood);
  const petalSize = size * 0.4;
  const centerSize = size * 0.2;

  // Create petals array
  const petals = Array.from({ length: flowerProps.petals }, (_, i) => {
    const angle = (360 / flowerProps.petals) * i;
    const radius = size * 0.25;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: petalSize,
          height: petalSize,
          background: `linear-gradient(45deg, ${flowerProps.petalColor}, ${flowerProps.centerColor})`,
          left: '50%',
          top: '50%',
          transformOrigin: '50% 50%',
        }}
        initial={{ 
          x: -petalSize / 2, 
          y: -petalSize / 2, 
          scale: 0,
          opacity: 0 
        }}
        animate={{
          x: x - petalSize / 2,
          y: y - petalSize / 2,
          scale: flowerProps.scale,
          opacity: flowerProps.opacity,
          rotate: flowerProps.rotation + (angle * 0.1)
        }}
        transition={{
          duration: 0.8,
          delay: i * 0.1,
          ease: "easeOut"
        }}
      />
    );
  });

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Glow effect for higher moods */}
      {mood >= 6 && (
        <motion.div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${flowerProps.petalColor}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Petals */}
      {petals}

      {/* Center */}
      <motion.div
        className="absolute rounded-full z-10"
        style={{
          width: centerSize,
          height: centerSize,
          background: `radial-gradient(circle, ${flowerProps.centerColor}, ${flowerProps.petalColor})`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: flowerProps.scale, 
          opacity: 1,
          rotate: flowerProps.rotation * 2
        }}
        transition={{
          duration: 0.6,
          delay: flowerProps.petals * 0.1,
          ease: "easeOut"
        }}
      />
    </div>
  );
};