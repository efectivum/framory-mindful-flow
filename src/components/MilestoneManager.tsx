
import React, { useState, useEffect } from 'react';
import { useMilestoneDetection, Milestone } from '@/hooks/useMilestoneDetection';
import { MilestoneCelebration } from '@/components/MilestoneCelebration';
import { MilestoneProgress } from '@/components/MilestoneProgress';
import { useToast } from '@/hooks/use-toast';

export const MilestoneManager: React.FC = () => {
  const { 
    recentlyAchieved, 
    nextMilestones, 
    totalAchieved, 
    totalMilestones, 
    overallProgress 
  } = useMilestoneDetection();
  
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);
  const [shownMilestones, setShownMilestones] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Show celebration for newly achieved milestones
  useEffect(() => {
    const newMilestone = recentlyAchieved.find(milestone => 
      !shownMilestones.has(milestone.id)
    );

    if (newMilestone && !celebratingMilestone) {
      setCelebratingMilestone(newMilestone);
      setShownMilestones(prev => new Set([...prev, newMilestone.id]));
      
      // Also show a toast notification
      toast({
        title: `🎉 ${newMilestone.title}`,
        description: newMilestone.description,
        duration: 3000,
      });
    }
  }, [recentlyAchieved, shownMilestones, celebratingMilestone, toast]);

  const handleDismissCelebration = () => {
    setCelebratingMilestone(null);
  };

  return (
    <>
      {/* Celebration Overlay */}
      {celebratingMilestone && (
        <MilestoneCelebration
          milestone={celebratingMilestone}
          onDismiss={handleDismissCelebration}
          autoHide={true}
          duration={6000}
        />
      )}

      {/* Milestone Progress Component */}
      <MilestoneProgress
        nextMilestones={nextMilestones}
        totalAchieved={totalAchieved}
        totalMilestones={totalMilestones}
        overallProgress={overallProgress}
      />
    </>
  );
};
