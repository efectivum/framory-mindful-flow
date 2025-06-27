
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Tag, Calendar, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SearchFilter {
  type: 'tag' | 'mood' | 'date' | 'emotion';
  value: string;
  label: string;
}

interface SmartSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onClear: () => void;
  placeholder?: string;
  availableTags?: string[];
  availableEmotions?: string[];
  className?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearch,
  onClear,
  placeholder = "Search your sanctuary...",
  availableTags = [],
  availableEmotions = [],
  className
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    ...availableTags.map(tag => ({ type: 'tag' as const, value: tag, label: `#${tag}` })),
    ...availableEmotions.map(emotion => ({ type: 'emotion' as const, value: emotion, label: `@${emotion}` })),
    { type: 'date' as const, value: 'today', label: 'Today' },
    { type: 'date' as const, value: 'week', label: 'This week' },
    { type: 'date' as const, value: 'month', label: 'This month' },
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery, filters);
  };

  const addFilter = (filter: SearchFilter) => {
    const newFilters = [...filters, filter];
    setFilters(newFilters);
    onSearch(query, newFilters);
    setShowFilters(false);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const clearAll = () => {
    setQuery('');
    setFilters([]);
    onClear();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowFilters(false);
      inputRef.current?.blur();
    }
  };

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'tag': return <Tag className="w-3 h-3" />;
      case 'emotion': return <Smile className="w-3 h-3" />;
      case 'date': return <Calendar className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowFilters(true)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-8 w-8 p-0 hover:bg-gray-600/50",
              filters.length > 0 && "text-purple-300"
            )}
          >
            <Filter className="w-4 h-4" />
          </Button>
          {(query || filters.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 w-8 p-0 hover:bg-gray-600/50 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.map((filter, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-purple-300 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20"
            >
              {getFilterIcon(filter.type)}
              {filter.label}
              <button
                onClick={() => removeFilter(index)}
                className="ml-1 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Suggestions */}
      {showFilters && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 app-card-organic animate-fade-in">
          <CardContent className="p-3">
            <div className="text-sm text-gray-400 mb-2">Quick filters:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 8).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addFilter(suggestion)}
                  className="flex items-center gap-1 px-2 py-1 text-sm rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-colors"
                >
                  {getFilterIcon(suggestion.type)}
                  {suggestion.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
