import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Filter } from "lucide-react";
import type { FilterOptions } from "@shared/schema";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCountries: string[];
  availableMajors: string[];
  onClose?: () => void;
}

export function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  availableCountries,
  availableMajors,
  onClose 
}: FilterSidebarProps) {
  const [tuitionRange, setTuitionRange] = useState<[number, number]>(
    filters.tuitionRange || [0, 100000]
  );

  useEffect(() => {
    if (filters.tuitionRange) {
      setTuitionRange(filters.tuitionRange);
    }
  }, [filters.tuitionRange]);

  const handleCountryToggle = (country: string) => {
    const current = filters.countries || [];
    const updated = current.includes(country)
      ? current.filter(c => c !== country)
      : [...current, country];
    onFiltersChange({ ...filters, countries: updated });
  };

  const handleDegreeLevelToggle = (level: string) => {
    const current = filters.degreeLevels || [];
    const updated = current.includes(level)
      ? current.filter(l => l !== level)
      : [...current, level];
    onFiltersChange({ ...filters, degreeLevels: updated });
  };

  const handleMajorToggle = (major: string) => {
    const current = filters.majors || [];
    const updated = current.includes(major)
      ? current.filter(m => m !== major)
      : [...current, major];
    onFiltersChange({ ...filters, majors: updated });
  };

  const handleTuitionRangeChange = (value: number[]) => {
    setTuitionRange([value[0], value[1]]);
  };

  const handleTuitionRangeCommit = () => {
    onFiltersChange({ ...filters, tuitionRange });
  };

  const handleReset = () => {
    setTuitionRange([0, 100000]);
    onFiltersChange({
      countries: [],
      tuitionRange: [0, 100000],
      degreeLevels: [],
      majors: [],
      hasGrant: false,
    });
  };

  const hasActiveFilters = 
    (filters.countries?.length || 0) > 0 ||
    (filters.degreeLevels?.length || 0) > 0 ||
    (filters.majors?.length || 0) > 0 ||
    filters.hasGrant ||
    (filters.tuitionRange && (filters.tuitionRange[0] > 0 || filters.tuitionRange[1] < 100000));

  return (
    <div className="glass-effect-strong rounded-3xl p-6 h-full flex flex-col" data-testid="sidebar-filters">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              data-testid="button-reset-filters"
            >
              Reset
            </Button>
          )}
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="lg:hidden"
              data-testid="button-close-filters"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-4 block">Tuition Range (USD/year)</Label>
            <div className="px-2">
              <Slider
                value={tuitionRange}
                onValueChange={handleTuitionRangeChange}
                onValueCommit={handleTuitionRangeCommit}
                min={0}
                max={100000}
                step={1000}
                className="mb-3"
                data-testid="slider-tuition"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span data-testid="text-tuition-min">${tuitionRange[0].toLocaleString()}</span>
                <span data-testid="text-tuition-max">${tuitionRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold mb-4 block">Degree Level</Label>
            <div className="space-y-3">
              {["Bachelor", "Master", "PhD"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`degree-${level}`}
                    checked={filters.degreeLevels?.includes(level)}
                    onCheckedChange={() => handleDegreeLevelToggle(level)}
                    data-testid={`checkbox-degree-${level.toLowerCase()}`}
                  />
                  <Label
                    htmlFor={`degree-${level}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="has-grant"
                checked={filters.hasGrant || false}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, hasGrant: checked as boolean })
                }
                data-testid="checkbox-scholarships"
              />
              <Label
                htmlFor="has-grant"
                className="text-base font-semibold cursor-pointer"
              >
                Scholarships Available
              </Label>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold mb-4 block">Countries (Top 20)</Label>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {availableCountries.slice(0, 20).map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={filters.countries?.includes(country)}
                      onCheckedChange={() => handleCountryToggle(country)}
                      data-testid={`checkbox-country-${country.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label
                      htmlFor={`country-${country}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold mb-4 block">Strong Majors (Top 15)</Label>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {availableMajors.slice(0, 15).map((major) => (
                  <div key={major} className="flex items-center space-x-2">
                    <Checkbox
                      id={`major-${major}`}
                      checked={filters.majors?.includes(major)}
                      onCheckedChange={() => handleMajorToggle(major)}
                      data-testid={`checkbox-major-${major.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label
                      htmlFor={`major-${major}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {major}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
