import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, X, Award, DollarSign, Users, GraduationCap, 
  Calendar, CheckCircle2, TrendingUp 
} from "lucide-react";
import type { University } from "@shared/schema";

export default function Compare() {
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("comparison");
    if (stored) {
      setUniversities(JSON.parse(stored));
    }
  }, []);

  const handleRemove = (id: string) => {
    const updated = universities.filter(u => u.id !== id);
    setUniversities(updated);
    localStorage.setItem("comparison", JSON.stringify(updated));
  };

  const handleClear = () => {
    setUniversities([]);
    localStorage.removeItem("comparison");
  };

  if (universities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md glass-effect rounded-3xl p-12">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-empty-title">No Universities to Compare</h1>
          <p className="text-muted-foreground mb-8" data-testid="text-empty-description">
            Add universities from the search results to start comparing them side by side.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-gradient-primary" data-testid="button-browse">
              Browse Universities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getBestValue = (field: keyof University, isLowerBetter = false) => {
    const values = universities.map(u => u[field] as number).filter(v => typeof v === "number");
    if (values.length === 0) return null;
    return isLowerBetter ? Math.min(...values) : Math.max(...values);
  };

  const bestRanking = getBestValue("rating", true);
  const lowestTuition = getBestValue("tuitionAnnualUSD", true);
  const highestIntlStudents = getBestValue("internationalStudentsPercent");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" className="mb-4" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <h1 className="text-4xl font-extrabold gradient-text" data-testid="text-page-title">
              Compare Universities
            </h1>
            <p className="text-muted-foreground mt-2">
              Comparing {universities.length} {universities.length === 1 ? "university" : "universities"}
            </p>
          </div>
          <Button variant="outline" onClick={handleClear} data-testid="button-clear-all">
            Clear All
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="min-w-max">
            <div className="grid gap-6" style={{ gridTemplateColumns: `300px repeat(${universities.length}, 280px)` }}>
              <div className="sticky left-0 z-10 bg-background/95 backdrop-blur">
                <Card className="glass-effect-strong h-full p-6">
                  <h3 className="font-bold text-lg mb-4">Comparison Criteria</h3>
                </Card>
              </div>

              {universities.map((university) => (
                <Card 
                  key={university.id} 
                  className="glass-effect p-6 relative"
                  data-testid={`comparison-card-${university.id}`}
                >
                  <button
                    onClick={() => handleRemove(university.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-destructive/20 rounded-full transition-colors"
                    data-testid={`button-remove-${university.id}`}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>

                  {university.logo && (
                    <img
                      src={university.logo}
                      alt=""
                      className="w-16 h-16 rounded-lg object-contain bg-white/5 p-2 mb-4"
                    />
                  )}
                  <h3 className="font-bold text-lg mb-2 pr-6">{university.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {university.city}, {university.countryFull}
                  </p>
                </Card>
              ))}
            </div>

            <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: `300px repeat(${universities.length}, 280px)` }}>
              <ComparisonRow 
                label="QS Ranking"
                icon={<Award className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell 
                    key={u.id}
                    isBest={u.rating === bestRanking}
                    testId={`cell-ranking-${u.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-primary text-white border-0">
                        #{u.rating}
                      </Badge>
                      {u.rating === bestRanking && (
                        <TrendingUp className="w-4 h-4 text-accent" />
                      )}
                    </div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Annual Tuition"
                icon={<DollarSign className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell 
                    key={u.id}
                    isBest={u.tuitionAnnualUSD === lowestTuition}
                    testId={`cell-tuition-${u.id}`}
                  >
                    <div>
                      <div className="font-semibold">
                        ${u.tuitionAnnualUSD.toLocaleString()}
                      </div>
                      {u.tuitionAnnualUSD === lowestTuition && (
                        <Badge variant="secondary" className="mt-1 text-xs bg-accent/20 text-accent">
                          Lowest
                        </Badge>
                      )}
                    </div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Scholarships"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell 
                    key={u.id} 
                    isBest={u.hasGrant}
                    testId={`cell-grants-${u.id}`}
                  >
                    {u.hasGrant ? (
                      <Badge className="bg-accent/20 text-accent border-accent/50">
                        Available
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Not specified</span>
                    )}
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="International Students"
                icon={<Users className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell 
                    key={u.id}
                    isBest={u.internationalStudentsPercent === highestIntlStudents}
                    testId={`cell-intl-${u.id}`}
                  >
                    <div>
                      <div className="font-semibold">{u.internationalStudentsPercent}%</div>
                      {u.internationalStudentsPercent === highestIntlStudents && (
                        <Badge variant="secondary" className="mt-1 text-xs bg-accent/20 text-accent">
                          Highest
                        </Badge>
                      )}
                    </div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Degree Levels"
                icon={<GraduationCap className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell key={u.id} testId={`cell-degrees-${u.id}`}>
                    <div className="flex flex-wrap gap-1">
                      {u.degreeLevels.map((level, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Strong Majors"
                icon={<GraduationCap className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell key={u.id} testId={`cell-majors-${u.id}`}>
                    <div className="space-y-1">
                      {u.strongMajors.slice(0, 3).map((major, idx) => (
                        <div key={idx} className="text-sm">{major}</div>
                      ))}
                      {u.strongMajors.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{u.strongMajors.length - 3} more
                        </div>
                      )}
                    </div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Bachelor's GPA"
                icon={<Calendar className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell key={u.id} testId={`cell-bachelor-gpa-${u.id}`}>
                    <div className="text-sm">{u.admissionRequirements.bachelor.gpa}</div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Bachelor's Tests"
                icon={<Calendar className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell key={u.id} testId={`cell-bachelor-tests-${u.id}`}>
                    <div className="text-sm">{u.admissionRequirements.bachelor.standardizedTests}</div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Master's GPA"
                icon={<Calendar className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell key={u.id} testId={`cell-master-gpa-${u.id}`}>
                    <div className="text-sm">{u.admissionRequirements.master.gpa}</div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>

              <ComparisonRow 
                label="Master's Tests"
                icon={<Calendar className="w-4 h-4" />}
              >
                {universities.map((u) => (
                  <ComparisonCell key={u.id} testId={`cell-master-tests-${u.id}`}>
                    <div className="text-sm">{u.admissionRequirements.master.standardizedTests}</div>
                  </ComparisonCell>
                ))}
              </ComparisonRow>
            </div>
          </div>
        </ScrollArea>

        <div className="mt-8 flex gap-4 justify-center">
          {universities.map((university) => (
            <Link key={university.id} href={`/university/${university.slug}`}>
              <Button variant="outline" data-testid={`button-view-${university.id}`}>
                View {university.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ 
  label, 
  icon, 
  children 
}: { 
  label: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <>
      <Card className="glass-effect p-4 flex items-center gap-2 sticky left-0 z-10 bg-background/95 backdrop-blur">
        {icon}
        <span className="font-semibold text-sm">{label}</span>
      </Card>
      {children}
    </>
  );
}

function ComparisonCell({ 
  children, 
  isBest = false,
  testId
}: { 
  children: React.ReactNode; 
  isBest?: boolean;
  testId?: string;
}) {
  return (
    <Card 
      className={`glass-effect p-4 relative overflow-hidden ${isBest ? "border-accent/50" : ""}`}
      data-testid={testId}
    >
      {isBest && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
}
