
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';
import { useHabitAnalytics } from '@/hooks/useHabitAnalytics';
import type { Habit } from '@/hooks/useHabits';

interface HabitAnalyticsChartsProps {
  habit?: Habit;
  days?: number;
}

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-2))",
  },
  streak: {
    label: "Streak",
    color: "hsl(var(--chart-3))",
  },
};

export const HabitAnalyticsCharts: React.FC<HabitAnalyticsChartsProps> = ({ 
  habit, 
  days = 30 
}) => {
  const { analytics, isLoading } = useHabitAnalytics(habit?.id, days);

  if (isLoading) {
    return (
      <div className="mobile-admin-grid-1 mobile-admin-grid-2 mobile-gap-lg">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-card/50 border-border">
            <CardContent className="mobile-card-content-lg">
              <div className="h-48 bg-muted/30 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="bg-card/50 border-border">
        <CardContent className="mobile-card-content-xl mobile-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="mobile-h3 text-foreground mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground">
            {habit ? 'Complete this habit a few times to see analytics' : 'Complete some habits to see analytics'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['hsl(142, 76%, 36%)', 'hsl(346, 87%, 43%)', 'hsl(221, 83%, 53%)', 'hsl(262, 83%, 58%)'];

  return (
    <div className="mobile-flow-lg">
      {/* Summary Stats */}
      <div className="mobile-admin-grid-1 mobile-admin-grid-3">
        <Card className="bg-gradient-to-br from-success/10 to-success-variant/10 border-border/50">
          <CardContent className="mobile-card-content">
            <div className="mobile-flex mobile-flex-between mobile-flex-center">
              <div className="mobile-flow-tight">
                <p className="mobile-text-sm text-muted-foreground">Completion Rate</p>
                <p className="mobile-h2 text-foreground">
                  {analytics.completionRate.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary-variant/10 border-border/50">
          <CardContent className="mobile-card-content">
            <div className="mobile-flex mobile-flex-between mobile-flex-center">
              <div className="mobile-flow-tight">
                <p className="mobile-text-sm text-muted-foreground">Best Week</p>
                <p className="mobile-h2 text-foreground">
                  {Math.max(...analytics.weeklyCompletions.map(w => w.completed), 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent-variant/10 border-border/50">
          <CardContent className="mobile-card-content">
            <div className="mobile-flex mobile-flex-between mobile-flex-center">
              <div className="mobile-flow-tight">
                <p className="mobile-text-sm text-muted-foreground">Most Active Day</p>
                <p className="mobile-h2 text-foreground">
                  {analytics.completionsByDay.reduce((max, day) => 
                    day.completions > max.completions ? day : max
                  ).day}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="mobile-admin-grid-1 mobile-admin-grid-2 mobile-gap-lg">
        {/* Weekly Progress */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground mobile-flex mobile-flex-center mobile-gap-sm">
              <BarChart3 className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={analytics.weeklyCompletions}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Pattern */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground mobile-flex mobile-flex-center mobile-gap-sm">
              <Calendar className="w-5 h-5" />
              Daily Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <PieChart>
                <Pie
                  data={analytics.completionsByDay}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="completions"
                  nameKey="day"
                >
                  {analytics.completionsByDay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Streak Activity */}
        <Card className="bg-card/50 border-border mobile-admin-full-span">
          <CardHeader>
            <CardTitle className="text-foreground mobile-flex mobile-flex-center mobile-gap-sm">
              <TrendingUp className="w-5 h-5" />
              Recent Activity (Last 2 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <LineChart data={analytics.streakHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="streak" 
                  stroke="var(--color-streak)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-streak)", strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
