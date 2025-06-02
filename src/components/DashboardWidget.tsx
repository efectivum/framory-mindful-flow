
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
    <Card className={`bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm min-h-[120px] lg:min-h-[140px]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-300 truncate pr-2">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </CardHeader>
      <CardContent className="pb-4">
        {value && (
          <div className="text-xl lg:text-2xl font-bold text-white mb-2 leading-tight">
            {value}
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            {description}
          </p>
        )}
        {children}
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-3 w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white text-xs"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
