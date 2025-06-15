
import React from "react";
import { AppStatCard } from "@/components/ui/AppStatCard";

interface StatCardRowProps {
  statCards: Array<any>;
  className?: string;
}

export const StatCardRow: React.FC<StatCardRowProps> = ({ statCards, className }) => (
  // On mobile: a flex container that scrolls horizontally.
  // -mx-4 px-4 makes it bleed to edges of a 1rem padded parent.
  // On desktop (md+): it becomes a standard grid. `md:contents` makes the children of this div behave as if they are direct children of the parent grid.
  <div className={`md:grid md:grid-cols-5 md:gap-4 ${className || ""}`}>
    <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 md:contents [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {statCards.map((props, idx) => (
            <AppStatCard
                key={idx}
                {...props}
            />
        ))}
    </div>
  </div>
);
