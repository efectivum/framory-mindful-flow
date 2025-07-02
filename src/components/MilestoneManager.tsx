
import React, { useState, useEffect } from 'react';
import { useMilestoneDetection, Milestone } from '@/hooks/useMilestoneDetection';
import { MilestoneProgress } from '@/components/MilestoneProgress';
import { useToast } from '@/hooks/use-toast';

const SHOWN_MILESTONES_KEY = 'lumatori_shown_milestones';

// Safe localStorage operations with error handling
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  }
};

export const MilestoneManager: React.FC = () => {
  const { 
    recentlyAchieved, 
    nextMilestones, 
    totalAchieved, 
    totalMilestones, 
    overallProgress,
    isLoading 
  } = useMilestoneDetection();
  
  const { toast } = useToast();
  const [hasShownToasts, setHasShownToasts] = useState<Set<string>>(new Set());

  // Load shown milestones from localStorage with error handling
  const getShownMilestones = (): string[] => {
    try {
      const stored = safeLocalStorage.getItem(SHOWN_MILESTONES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading shown milestones:', error);
      return [];
    }
  };

  // Save shown milestone to localStorage with error handling
  const saveShownMilestone = (milestoneId: string): boolean => {
    try {
      const shownMilestones = getShownMilestones();
      if (!shownMilestones.includes(milestoneId)) {
        shownMilestones.push(milestoneId);
        const success = safeLocalStorage.setItem(SHOWN_MILESTONES_KEY, JSON.stringify(shownMilestones));
        if (success) {
          console.log(`Milestone ${milestoneId} marked as permanently shown`);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error saving shown milestone:', error);
      return false;
    }
  };

  // Show toast notification for newly achieved milestones (only once)
  useEffect(() => {
    // Don't show toasts while data is still loading
    if (isLoading || recentlyAchieved.length === 0) {
      return;
    }

    console.log('MilestoneManager: Checking for new milestones to show');
    console.log('Recently achieved milestones:', recentlyAchieved);

    try {
      const shownMilestones = getShownMilestones();

      // Find milestones that haven't been shown yet and aren't in current session
      const newMilestones = recentlyAchieved.filter(milestone => 
        !shownMilestones.includes(milestone.id) && 
        !hasShownToasts.has(milestone.id)
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
        
        // Mark as shown in current session
        setHasShownToasts(prev => new Set([...prev, latestMilestone.id]));
        
        // Mark as permanently shown
        saveShownMilestone(latestMilestone.id);
      } else {
        console.log('No new milestones to show');
      }
    } catch (error) {
      console.error('Error in milestone toast logic:', error);
    }
  }, [recentlyAchieved, toast, isLoading, hasShownToasts]);

  // Don't render anything while loading to prevent layout shifts
  if (isLoading) {
    return null;
  }

  // Only render if we have milestone data
  if (totalMilestones === 0) {
    return null;
  }

  return (
    <>
      {/* Milestone Progress Component with error boundary */}
      <MilestoneProgress
        nextMilestones={nextMilestones}
        totalAchieved={totalAchieved}
        totalMilestones={totalMilestones}
        overallProgress={overallProgress}
      />
    </>
  );
};
