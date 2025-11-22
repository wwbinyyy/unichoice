import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { University } from "@shared/schema";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectUniversity?: (university: University) => void;
  suggestions: University[];
  className?: string;
}

export function SearchBar({ onSearch, onSelectUniversity, suggestions, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch(value);
    setShowSuggestions(value.length > 0);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = (university: University) => {
    setQuery(university.name);
    setShowSuggestions(false);
    onSelectUniversity?.(university);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search universities..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="glass-effect-strong h-14 pl-12 pr-12 text-base border-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:gradient-border transition-all"
          data-testid="input-search"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-clear-search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full mt-2 w-full glass-effect-strong rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto animate-slide-up"
          data-testid="dropdown-suggestions"
        >
          {suggestions.map((university) => (
            <button
              key={university.id}
              onClick={() => handleSelectSuggestion(university)}
              className="w-full px-4 py-3 text-left hover-elevate transition-all border-b border-border/50 last:border-0 flex items-center gap-3"
              data-testid={`suggestion-${university.id}`}
            >
              {university.logo && (
                <img 
                  src={university.logo} 
                  alt="" 
                  className="w-8 h-8 rounded object-contain bg-white/5 p-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">{university.name}</div>
                <div className="text-sm text-muted-foreground">
                  {university.city}, {university.countryFull}
                </div>
              </div>
              <div className="text-sm font-semibold text-primary">#{university.rating}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
