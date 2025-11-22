import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Award, DollarSign, GraduationCap } from "lucide-react";
import type { University } from "@shared/schema";

interface UniversityCardProps {
  university: University;
}

export function UniversityCard({ university }: UniversityCardProps) {
  return (
    <Link href={`/university/${university.slug}`}>
      <Card 
        className="group glass-effect hover-elevate active-elevate-2 overflow-visible cursor-pointer transition-all duration-250 hover:-translate-y-2 h-full rounded-3xl"
        data-testid={`card-university-${university.id}`}
      >
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-shrink-0">
              {university.logo ? (
                <img 
                  src={university.logo} 
                  alt={`${university.name} logo`}
                  className="w-16 h-16 rounded-lg object-contain bg-white/5 p-2"
                  data-testid={`img-logo-${university.id}`}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                  {university.name.substring(0, 2)}
                </div>
              )}
            </div>
            <Badge 
              variant="secondary" 
              className="bg-gradient-primary text-white border-0 text-sm font-bold px-3 py-1"
              data-testid={`badge-rank-${university.id}`}
            >
              <Award className="w-3 h-3 mr-1" />#{university.rating}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 
              className="text-xl font-semibold text-foreground line-clamp-2 group-hover:gradient-text transition-all"
              data-testid={`text-name-${university.id}`}
            >
              {university.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span data-testid={`text-location-${university.id}`}>
                {university.city}, {university.countryFull}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-foreground">
            <DollarSign className="w-4 h-4 text-accent" />
            <span className="font-semibold" data-testid={`text-tuition-${university.id}`}>
              ${university.tuitionAnnualUSD.toLocaleString()}/year
            </span>
            {university.hasGrant && (
              <Badge variant="outline" className="ml-2 text-xs border-accent/50 text-accent">
                Grants Available
              </Badge>
            )}
          </div>

          {university.strongMajors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {university.strongMajors.slice(0, 3).map((major, idx) => (
                <Badge 
                  key={idx}
                  variant="secondary" 
                  className="text-xs bg-secondary/50 border border-secondary-foreground/10"
                  data-testid={`badge-major-${university.id}-${idx}`}
                >
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {major}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-summary-${university.id}`}>
            {university.summary}
          </p>
        </div>
      </Card>
    </Link>
  );
}
