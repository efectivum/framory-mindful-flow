
import React from "react";
import { AppStatCard } from "@/components/ui/AppStatCard";

interface StatCardRowProps {
  statCards: Array<any>;
  className?: string;
}

export const StatCardRow: React.FC<StatCardRowProps> = ({ statCards, className }) => (
  <div className={`app-stats-scroll ${className || ""}`}>
    {statCards.map((props, idx) => (
      <AppStatCard
        key={idx}
        {...props}
        className="app-stat-card-compact"
      />
    ))}
  </div>
);
