
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export const ProfileOverview = () => {
  const { user } = useAuth();

  return (
    <Card className="card-serene">
      <CardHeader className="text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-foreground">{user?.email?.split('@')[0] || 'User'}</CardTitle>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">47</div>
          <div className="text-muted-foreground text-sm">Days Active</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">127</div>
            <div className="text-muted-foreground text-xs">Journal Entries</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">8</div>
            <div className="text-muted-foreground text-xs">Active Goals</div>
          </div>
        </div>
        <Button variant="outline" className="w-full btn-serene">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};
