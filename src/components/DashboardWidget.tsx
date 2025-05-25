
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
    <Card className={`bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        {value && (
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
        )}
        {description && (
          <p className="text-xs text-gray-400 mb-3">{description}</p>
        )}
        {children}
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-3 w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
