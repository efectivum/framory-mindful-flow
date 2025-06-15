
import React from "react";
import { AppStatCard } from "@/components/ui/AppStatCard";

interface StatCardRowProps {
  statCards: Array<any>;
  className?: string;
}

export const StatCardRow: React.FC<StatCardRowProps> = ({ statCards, className }) => (
  <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className || ""}`}>
    {statCards.map((props, idx) => (
        <AppStatCard
            key={idx}
            {...props}
        />
    ))}
  </div>
);
