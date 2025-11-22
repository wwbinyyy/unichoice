import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, Award, DollarSign, GraduationCap, Globe, 
  Calendar, Users, ExternalLink, ArrowLeft, Plus 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { University } from "@shared/schema";

export default function UniversityDetail() {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: university, isLoading } = useQuery<University>({
    queryKey: ["/api/universities", slug],
  });

  const handleAddToComparison = () => {
    if (!university) return;
    
    const existing = JSON.parse(localStorage.getItem("comparison") || "[]");
    if (existing.find((u: University) => u.id === university.id)) {
      toast({
        title: "Already in comparison",
        description: "This university is already added to your comparison list.",
      });
      return;
    }
    
    if (existing.length >= 4) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 4 universities at a time.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("comparison", JSON.stringify([...existing, university]));
    toast({
      title: "Added to comparison",
      description: `${university.name} has been added to your comparison list.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-96 bg-gradient-primary animate-pulse" />
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">University not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-96 bg-gradient-primary overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-white hover:bg-white/20" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <div className="flex items-start gap-6">
            {university.logo && (
              <img
                src={university.logo}
                alt={`${university.name} logo`}
                className="w-24 h-24 rounded-xl bg-white p-3 object-contain"
                data-testid="img-university-logo"
              />
            )}
            <div className="flex-1">
              <Badge className="bg-white/20 text-white border-0 mb-3" data-testid="badge-ranking">
                <Award className="w-3 h-3 mr-1" />
                QS Ranking #{university.rating}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2" data-testid="text-university-name">
                {university.name}
              </h1>
              <p className="text-xl text-white/90 flex items-center gap-2" data-testid="text-university-location">
                <MapPin className="w-5 h-5" />
                {university.city}, {university.countryFull}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleAddToComparison}
                className="bg-white text-primary hover:bg-white/90"
                data-testid="button-add-to-comparison"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Compare
              </Button>
              <a href={university.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white text-white hover:bg-white/20" data-testid="button-visit-website">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="glass-effect p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">Annual Tuition</h3>
            </div>
            <p className="text-3xl font-bold" data-testid="text-tuition">
              ${university.tuitionAnnualUSD.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {university.currency !== "USD" && `~${university.tuitionAnnual.toLocaleString()} ${university.currency}`}
            </p>
          </Card>

          <Card className="glass-effect p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">International Students</h3>
            </div>
            <p className="text-3xl font-bold" data-testid="text-intl-students">
              {university.internationalStudentsPercent}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">of student body</p>
          </Card>

          <Card className="glass-effect p-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {university.languages.map((lang, idx) => (
                <Badge key={idx} variant="secondary" data-testid={`badge-language-${idx}`}>
                  {lang}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="glass-effect mb-8">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="admissions" data-testid="tab-admissions">Admissions</TabsTrigger>
            <TabsTrigger value="programs" data-testid="tab-programs">Programs</TabsTrigger>
            <TabsTrigger value="deadlines" data-testid="tab-deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="alumni" data-testid="tab-alumni">Alumni Success</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-4">About {university.name}</h2>
              <p className="text-lg text-muted-foreground mb-6" data-testid="text-summary">
                {university.summary}
              </p>
              <p className="text-muted-foreground" data-testid="text-tagline">{university.tagline}</p>
            </Card>

            {university.hasGrant && (
              <Card className="glass-effect p-8 border-accent/50">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Scholarships & Grants Available
                </h3>
                <p className="text-muted-foreground">
                  This university offers scholarships and grants to eligible students. Contact admissions for details.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="admissions" className="space-y-6">
            <Card className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-6">Bachelor's Degree Requirements</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Academic Requirements</h4>
                  <p className="text-muted-foreground" data-testid="text-bachelor-gpa">{university.admissionRequirements.bachelor.gpa}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Standardized Tests</h4>
                  <p className="text-muted-foreground" data-testid="text-bachelor-tests">{university.admissionRequirements.bachelor.standardizedTests}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">English Proficiency</h4>
                  <p className="text-muted-foreground" data-testid="text-bachelor-english">{university.admissionRequirements.bachelor.englishProficiency}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Application Deadline</h4>
                  <p className="text-muted-foreground" data-testid="text-bachelor-deadline">{university.admissionRequirements.bachelor.applicationDeadline}</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Additional Requirements</h4>
                <p className="text-muted-foreground" data-testid="text-bachelor-additional">{university.admissionRequirements.bachelor.additionalRequirements}</p>
              </div>
            </Card>

            <Card className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-6">Master's Degree Requirements</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Academic Requirements</h4>
                  <p className="text-muted-foreground" data-testid="text-master-gpa">{university.admissionRequirements.master.gpa}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Standardized Tests</h4>
                  <p className="text-muted-foreground" data-testid="text-master-tests">{university.admissionRequirements.master.standardizedTests}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">English Proficiency</h4>
                  <p className="text-muted-foreground" data-testid="text-master-english">{university.admissionRequirements.master.englishProficiency}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Application Deadline</h4>
                  <p className="text-muted-foreground" data-testid="text-master-deadline">{university.admissionRequirements.master.applicationDeadline}</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Additional Requirements</h4>
                <p className="text-muted-foreground" data-testid="text-master-additional">{university.admissionRequirements.master.additionalRequirements}</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <Card className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-4">Degree Levels Offered</h2>
              <div className="flex flex-wrap gap-3 mb-8">
                {university.degreeLevels.map((level, idx) => (
                  <Badge key={idx} variant="secondary" className="text-base px-4 py-2" data-testid={`badge-degree-${idx}`}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {level}
                  </Badge>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-4">Strong Programs</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {university.strongMajors.map((major, idx) => (
                  <div 
                    key={idx} 
                    className="glass-effect p-4 rounded-lg border border-accent/30"
                    data-testid={`strong-major-${idx}`}
                  >
                    <p className="font-semibold text-accent">{major}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-4">All Available Majors</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {university.majors.map((major, idx) => (
                  <div 
                    key={idx}
                    className="glass-effect p-3 rounded-lg text-sm"
                    data-testid={`major-${idx}`}
                  >
                    {major}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4">
            {university.deadlines.map((deadline, idx) => (
              <Card key={idx} className="glass-effect p-6" data-testid={`deadline-${idx}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{deadline.level}</Badge>
                      <Badge variant="outline">{deadline.term}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{deadline.roundName} Round</h3>
                    {deadline.deadlineDate && (
                      <p className="text-lg font-semibold text-accent flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(deadline.deadlineDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {deadline.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{deadline.notes}</p>
                    )}
                  </div>
                  {deadline.link && (
                    <a href={deadline.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="alumni" className="space-y-4">
            {university.cases.map((alumniCase, idx) => (
              <Card key={idx} className="glass-effect p-6" data-testid={`case-${idx}`}>
                <h3 className="text-xl font-bold mb-2">{alumniCase.title}</h3>
                <p className="text-muted-foreground mb-4">{alumniCase.summary}</p>
                {alumniCase.link && (
                  <a href={alumniCase.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </a>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
