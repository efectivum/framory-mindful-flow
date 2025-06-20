
import { Filter, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JournalFilters, FilterStatus, DateFilter } from '@/hooks/useJournalFiltering';

interface JournalFilterDropdownProps {
  filters: JournalFilters;
  availableTags: string[];
  availableEmotions: string[];
  activeFilterCount: number;
  onFilterChange: (key: keyof JournalFilters, value: any) => void;
  onClearAll: () => void;
}

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Entries' },
  { value: 'analyzed', label: 'Analyzed' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
];

const dateOptions: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
];

export const JournalFilterDropdown = ({
  filters,
  availableTags,
  availableEmotions,
  activeFilterCount,
  onFilterChange,
  onClearAll,
}: JournalFilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/50 text-gray-300"
        >
          <Filter className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-600 text-white"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 bg-gray-800 border-gray-700 text-gray-200" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="text-gray-200 font-medium">Filters</DropdownMenuLabel>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Status Filter */}
        <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider">Status</DropdownMenuLabel>
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFilterChange('status', option.value)}
            className="flex items-center justify-between hover:bg-gray-700/50"
          >
            <span>{option.label}</span>
            {filters.status === option.value && <Check className="w-4 h-4 text-blue-400" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Date Filter */}
        <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider">Date</DropdownMenuLabel>
        {dateOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFilterChange('dateFilter', option.value)}
            className="flex items-center justify-between hover:bg-gray-700/50"
          >
            <span>{option.label}</span>
            {filters.dateFilter === option.value && <Check className="w-4 h-4 text-blue-400" />}
          </DropdownMenuItem>
        ))}

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider">Tags</DropdownMenuLabel>
            {availableTags.slice(0, 6).map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={filters.selectedTags.includes(tag)}
                onCheckedChange={(checked) => {
                  const newTags = checked
                    ? [...filters.selectedTags, tag]
                    : filters.selectedTags.filter(t => t !== tag);
                  onFilterChange('selectedTags', newTags);
                }}
                className="hover:bg-gray-700/50"
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
            {availableTags.length > 6 && (
              <DropdownMenuItem className="text-xs text-gray-400 italic">
                +{availableTags.length - 6} more tags
              </DropdownMenuItem>
            )}
          </>
        )}

        {/* Emotions Filter */}
        {availableEmotions.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider">Emotions</DropdownMenuLabel>
            {availableEmotions.slice(0, 6).map((emotion) => (
              <DropdownMenuCheckboxItem
                key={emotion}
                checked={filters.selectedEmotions.includes(emotion)}
                onCheckedChange={(checked) => {
                  const newEmotions = checked
                    ? [...filters.selectedEmotions, emotion]
                    : filters.selectedEmotions.filter(e => e !== emotion);
                  onFilterChange('selectedEmotions', newEmotions);
                }}
                className="hover:bg-gray-700/50 capitalize"
              >
                {emotion.toLowerCase()}
              </DropdownMenuCheckboxItem>
            ))}
            {availableEmotions.length > 6 && (
              <DropdownMenuItem className="text-xs text-gray-400 italic">
                +{availableEmotions.length - 6} more emotions
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
