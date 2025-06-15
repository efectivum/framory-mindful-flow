
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useJournalEntries } from '@/hooks/useJournalEntries';

export const MiniCalendar: React.FC = () => {
  const { entries } = useJournalEntries();

  const entryDates = React.useMemo(() => 
    entries.map(entry => new Date(entry.created_at)),
    [entries]
  );
  
  const modifiers = {
    highlighted: entryDates,
  };

  const modifiersStyles = {
    highlighted: {
      backgroundColor: '#1d4ed8', // blue-700
      color: 'white',
      borderRadius: '9999px',
    },
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-green-300" />
          Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex justify-center">
        <Calendar
          mode="single"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="p-2"
          classNames={{
            month: "space-y-2",
            day: "h-8 w-8",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
            cell: "h-8 w-8 text-center text-sm p-0 relative",
            row: "flex w-full mt-1",
            caption_label: "text-sm font-medium text-white",
            nav_button: "h-6 w-6 text-white",
            day_selected: "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600 rounded-full",
            day_today: "bg-gray-700 text-white rounded-full",
          }}
        />
      </CardContent>
    </Card>
  );
};
