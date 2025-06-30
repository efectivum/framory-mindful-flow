
import React, { useState, useEffect } from 'react';
import { useMilestoneDetection, Milestone } from '@/hooks/useMilestoneDetection';
import { MilestoneCelebration } from '@/components/MilestoneCelebration';
import { MilestoneProgress } from '@/components/MilestoneProgress';
import { useToast } from '@/hooks/use-toast';

const SHOWN_MILESTONES_KEY = 'lumatori_shown_milestones';
const MILESTONE_COOLDOWN_HOURS = 1;

export const MilestoneManager: React.FC = () => {
  const { 
    recentlyAchieved, 
    nextMilestones, 
    totalAchieved, 
    totalMilestones, 
    overallProgress 
  } = useMilestoneDetection();
  
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);
  const { toast } = useToast();

  // Load shown milestones from localStorage
  const getShownMilestones = (): Record<string, number> => {
    try {
      const stored = localStorage.getItem(SHOWN_MILESTONES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading shown milestones:', error);
      return {};
    }
  };

  // Save shown milestones to localStorage
  const saveShownMilestone = (milestoneId: string) => {
    try {
      const shownMilestones = getShownMilestones();
      shownMilestones[milestoneId] = Date.now();
      localStorage.setItem(SHOWN_MILESTONES_KEY, JSON.stringify(shownMilestones));
      console.log(`Milestone ${milestoneId} marked as shown`);
    } catch (error) {
      console.error('Error saving shown milestone:', error);
    }
  };

  // Check if milestone should be shown (not shown recently)
  const shouldShowMilestone = (milestone: Milestone): boolean => {
    const shownMilestones = getShownMilestones();
    const lastShown = shownMilestones[milestone.id];
    
    if (!lastShown) {
      return true; // Never shown before
    }

    // Check cooldown period
    const cooldownMs = MILESTONE_COOLDOWN_HOURS * 60 * 60 * 1000;
    const isInCooldown = (Date.now() - lastShown) < cooldownMs;
    
    console.log(`Milestone ${milestone.id}: lastShown=${new Date(lastShown).toISOString()}, inCooldown=${isInCooldown}`);
    
    return !isInCooldown;
  };

  // Show celebration for newly achieved milestones
  useEffect(() => {
    console.log('MilestoneManager: Checking for new milestones to show');
    console.log('Recently achieved milestones:', recentlyAchieved);

    if (celebratingMilestone) {
      console.log('Already celebrating a milestone, skipping');
      return;
    }

    // Find the first milestone that should be shown
    const milestoneToShow = recentlyAchieved.find(milestone => 
      shouldShowMilestone(milestone)
    );

    if (milestoneToShow) {
      console.log('Showing milestone celebration for:', milestoneToShow.id);
      setCelebratingMilestone(milestoneToShow);
      saveShownMilestone(milestoneToShow.id);
      
      // Also show a toast notification
      toast({
        title: `🎉 ${milestoneToShow.title}`,
        description: milestoneToShow.description,
        duration: 3000,
      });
    } else {
      console.log('No new milestones to show');
    }
  }, [recentlyAchieved, celebratingMilestone, toast]);

  const handleDismissCelebration = () => {
    console.log('Dismissing milestone celebration');
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
