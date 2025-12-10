
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AdditionalSettings = () => {
  return (
    <Card className="card-serene border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <Palette className="w-5 h-5 text-accent-foreground" />
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-foreground font-medium text-sm mb-2">Timezone</label>
          <select className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
            <option>UTC-8 (Pacific Time)</option>
            <option>UTC-5 (Eastern Time)</option>
            <option>UTC+0 (GMT)</option>
            <option>UTC+1 (Central European Time)</option>
          </select>
        </div>
        <div>
          <label className="block text-foreground font-medium text-sm mb-2">Theme</label>
          <select className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
            <option>Auto (System)</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
