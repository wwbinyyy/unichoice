import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { UniversityCard } from "@/components/UniversityCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, ArrowUpDown } from "lucide-react";
import { Link } from "wouter";
import type { University, FilterOptions, SortOption } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    countries: [],
    tuitionRange: [0, 100000],
    degreeLevels: [],
    majors: [],
    hasGrant: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>("ranking");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: universities = [], isLoading } = useQuery<University[]>({
    queryKey: ["/api/universities"],
  });

  const { data: searchSuggestions = [] } = useQuery<University[]>({
    queryKey: ["/api/universities/search", searchQuery],
    queryFn: async () => {
      const response = await fetch(`/api/universities/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: searchQuery.length > 0,
  });

  const availableCountries = useMemo(() => {
    const countries = new Set(universities.map(u => u.countryFull));
    return Array.from(countries).sort();
  }, [universities]);

  const availableMajors = useMemo(() => {
    const majors = new Set(universities.flatMap(u => u.strongMajors));
    return Array.from(majors).sort();
  }, [universities]);

  const filteredUniversities = useMemo(() => {
    let result = universities;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.city.toLowerCase().includes(query) ||
        u.countryFull.toLowerCase().includes(query)
      );
    }

    if (filters.countries && filters.countries.length > 0) {
      result = result.filter(u => filters.countries!.includes(u.countryFull));
    }

    if (filters.tuitionRange) {
      result = result.filter(u =>
        u.tuitionAnnualUSD >= filters.tuitionRange![0] &&
        u.tuitionAnnualUSD <= filters.tuitionRange![1]
      );
    }

    if (filters.degreeLevels && filters.degreeLevels.length > 0) {
      result = result.filter(u =>
        filters.degreeLevels!.some(level => u.degreeLevels.includes(level))
      );
    }

    if (filters.majors && filters.majors.length > 0) {
      result = result.filter(u =>
        filters.majors!.some(major => u.strongMajors.includes(major))
      );
    }

    if (filters.hasGrant) {
      result = result.filter(u => u.hasGrant);
    }

    switch (sortBy) {
      case "ranking":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "tuition-low":
        result.sort((a, b) => a.tuitionAnnualUSD - b.tuitionAnnualUSD);
        break;
      case "tuition-high":
        result.sort((a, b) => b.tuitionAnnualUSD - a.tuitionAnnualUSD);
        break;
      case "intl-students":
        result.sort((a, b) => b.internationalStudentsPercent - a.internationalStudentsPercent);
        break;
      case "best-fit":
        result.sort((a, b) => {
          const rankScore = (u: University) => Math.max(0, 100 - u.rating) * 2;
          const tuitionScore = (u: University) => Math.max(0, (100000 - u.tuitionAnnualUSD) / 1000);
          const grantScore = (u: University) => u.hasGrant ? 30 : 0;
          const intlScore = (u: University) => u.internationalStudentsPercent;
          const majorScore = (u: University) => u.strongMajors.length * 5;
          
          const scoreA = rankScore(a) + tuitionScore(a) + grantScore(a) + intlScore(a) + majorScore(a);
          const scoreB = rankScore(b) + tuitionScore(b) + grantScore(b) + intlScore(b) + majorScore(b);
          return scoreB - scoreA;
        });
        break;
    }

    return result;
  }, [universities, searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-extrabold gradient-text leading-tight" data-testid="text-hero-title">
            Find Your Perfect University
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Explore 1000+ universities worldwide with AI-powered recommendations, detailed rankings, and comprehensive admission information
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={setSearchQuery}
              suggestions={searchSuggestions.slice(0, 5)}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/compare">
              <Button size="lg" className="bg-gradient-primary" data-testid="button-compare-universities">
                Compare Universities
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="glass-effect" data-testid="button-view-all">
              View All Universities
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2" data-testid="text-results-count">
              {filteredUniversities.length} Universities Found
            </h2>
            <p className="text-muted-foreground">
              {searchQuery && `Showing results for "${searchQuery}"`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-48 glass-effect border-0" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranking">QS Ranking</SelectItem>
                  <SelectItem value="tuition-low">Tuition: Low to High</SelectItem>
                  <SelectItem value="tuition-high">Tuition: High to Low</SelectItem>
                  <SelectItem value="intl-students">International Students %</SelectItem>
                  <SelectItem value="best-fit">AI Best Fit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden glass-effect" data-testid="button-mobile-filters">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableCountries={availableCountries}
                  availableMajors={availableMajors}
                  onClose={() => setShowMobileFilters(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                availableCountries={availableCountries}
                availableMajors={availableMajors}
              />
            </div>
          </aside>

          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="glass-effect rounded-3xl p-8 space-y-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="text-center py-24 glass-effect rounded-3xl" data-testid="text-no-results">
                <p className="text-xl text-muted-foreground mb-4">No universities found</p>
                <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                <Button onClick={() => {
                  setFilters({
                    countries: [],
                    tuitionRange: [0, 100000],
                    degreeLevels: [],
                    majors: [],
                    hasGrant: false,
                  });
                  setSearchQuery("");
                }} data-testid="button-clear-all-filters">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="grid-universities">
                {filteredUniversities.map((university) => (
                  <UniversityCard key={university.id} university={university} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
