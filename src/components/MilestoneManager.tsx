
import React, { useState, useEffect } from 'react';
import { useMilestoneDetection, Milestone } from '@/hooks/useMilestoneDetection';
import { MilestoneProgress } from '@/components/MilestoneProgress';
import { useToast } from '@/hooks/use-toast';

const SHOWN_MILESTONES_KEY = 'lumatori_shown_milestones';

export const MilestoneManager: React.FC = () => {
  const { 
    recentlyAchieved, 
    nextMilestones, 
    totalAchieved, 
    totalMilestones, 
    overallProgress 
  } = useMilestoneDetection();
  
  const { toast } = useToast();

  // Load shown milestones from localStorage
  const getShownMilestones = (): string[] => {
    try {
      const stored = localStorage.getItem(SHOWN_MILESTONES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading shown milestones:', error);
      return [];
    }
  };

  // Save shown milestone to localStorage (permanently)
  const saveShownMilestone = (milestoneId: string) => {
    try {
      const shownMilestones = getShownMilestones();
      if (!shownMilestones.includes(milestoneId)) {
        shownMilestones.push(milestoneId);
        localStorage.setItem(SHOWN_MILESTONES_KEY, JSON.stringify(shownMilestones));
        console.log(`Milestone ${milestoneId} marked as permanently shown`);
      }
    } catch (error) {
      console.error('Error saving shown milestone:', error);
    }
  };

  // Show toast notification for newly achieved milestones (only once)
  useEffect(() => {
    console.log('MilestoneManager: Checking for new milestones to show');
    console.log('Recently achieved milestones:', recentlyAchieved);

    const shownMilestones = getShownMilestones();

    // Find milestones that haven't been shown yet
    const newMilestones = recentlyAchieved.filter(milestone => 
      !shownMilestones.includes(milestone.id)
    );

    if (newMilestones.length > 0) {
      // Show the most recent milestone
      const latestMilestone = newMilestones[0];
      console.log('Showing milestone toast for:', latestMilestone.id);
      
      toast({
        title: `🎉 Achievement Unlocked!`,
        description: `${latestMilestone.icon} ${latestMilestone.title} - ${latestMilestone.description}`,
        duration: 5000,
      });
      
      // Mark as permanently shown
      saveShownMilestone(latestMilestone.id);
    } else {
      console.log('No new milestones to show');
    }
  }, [recentlyAchieved, toast]);

  return (
    <>
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
