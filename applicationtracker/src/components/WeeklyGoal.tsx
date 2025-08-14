import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Edit3 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    weeklyGoalData?: { goal?: string };
  }
}

interface WeeklyGoalProps {
  appliedWeekCount: number;
}

export function WeeklyGoal({ appliedWeekCount }: WeeklyGoalProps) {
  const navigate = useNavigate();
  // Load goal from localStorage or default to 10
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedGoal = localStorage.getItem('weeklyGoal');
      if (savedGoal) return parseInt(savedGoal);
      const windowGoal = window.weeklyGoalData?.goal;
      return windowGoal ? parseInt(windowGoal) : 10;
    }
    return 10;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(weeklyGoal);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.weeklyGoalData) {
        window.weeklyGoalData = {};
      }
      window.weeklyGoalData.goal = weeklyGoal.toString();
      localStorage.setItem('weeklyGoal', weeklyGoal.toString());
    }
  }, [weeklyGoal]);

  const progressPercentage = Math.min((appliedWeekCount / weeklyGoal) * 100, 100);
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const handleSaveGoal = () => {
    if (tempGoal > 0) {
      setWeeklyGoal(tempGoal);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempGoal(weeklyGoal);
    setIsEditing(false);
  };

  return (
    <Card className="rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-black flex items-center justify-between">
          Weekly Goal
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0 hover:bg-white/20"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto">
          <svg
            className="w-24 h-24 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#8B7EC8"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-black text-lg font-bold">
              {appliedWeekCount}/{weeklyGoal}
            </span>
          </div>
        </div>

        <p className="text-sm text-black/60">
          Applications this week
        </p>

        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <label className="text-sm text-black/80">Goal:</label>
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm text-center bg-white/30 border border-white/50 rounded"
                min="1"
                max="100"
              />
            </div>
            <div className="flex space-x-2 justify-center">
              <Button
                size="sm"
                onClick={handleSaveGoal}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-xs"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="bg-white/20 hover:bg-white/30 text-black border-white/30 px-3 py-1 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {appliedWeekCount >= weeklyGoal ? (
              <p className="text-green-600 text-sm font-medium">
                🎉 Goal achieved! Great job!
              </p>
            ) : (
              <p className="text-black/80 text-sm">
                {weeklyGoal - appliedWeekCount} more to go!
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-2 pt-2">
          <Button
            size="sm"
            className="w-full bg-secondary-foreground hover:bg-secondary-foreground/80 text-white text-xs py-2"
            onClick={() => navigate('/jobs')}
          >
            🎯 Find More Jobs
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="w-full bg-white/20 hover:bg-secondary-foreground/20 text-black border-secondary-foreground text-xs py-2"
          >
            Set New Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}