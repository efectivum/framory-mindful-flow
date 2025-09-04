
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DashboardWidgetProps {
  title: string;
  value?: string | number;
  description?: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  gradient?: string;
  children?: React.ReactNode;
}

export const DashboardWidget = ({
  title,
  value,
  description,
  icon: Icon,
  action,
  gradient = 'from-blue-500/10 to-purple-600/10',
  children,
}: DashboardWidgetProps) => {
  return (
    <Card className={`bg-gradient-to-br ${gradient} border-border/50 backdrop-blur-sm min-h-[120px] lg:min-h-[140px]`}>
      <CardHeader className="mobile-flex mobile-flex-row mobile-flex-between mobile-flex-center space-y-0 pb-3">
        <CardTitle className="mobile-text-sm font-medium text-muted-foreground truncate pr-2">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="pb-4">
        {value && (
          <div className="mobile-h2 font-bold text-foreground mb-2 leading-tight">
            {value}
          </div>
        )}
        {description && (
          <p className="mobile-text-xs text-muted-foreground mb-3 leading-relaxed">
            {description}
          </p>
        )}
        {children}
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-3 w-full mobile-text-xs"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
