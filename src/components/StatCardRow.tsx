
import React from "react";
import { AppStatCard } from "@/components/ui/AppStatCard";

interface StatCardRowProps {
  statCards: Array<any>;
  className?: string;
}

export const StatCardRow: React.FC<StatCardRowProps> = ({ statCards, className }) => (
  <div className={`
    flex gap-3 overflow-x-auto pb-4
    [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
    ${className || ""}
  `}>
    {statCards.map((props, idx) => (
        <AppStatCard
            key={idx}
            {...props}
        />
    ))}
  </div>
);
