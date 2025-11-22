import { z } from "zod";

// University deadline schema
export const deadlineSchema = z.object({
  level: z.string(),
  term: z.string(),
  roundName: z.string(),
  deadlineDate: z.string().nullable(),
  notes: z.string(),
  link: z.string(),
});

// Alumni case schema
export const caseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  link: z.string(),
});

// Admission requirements schema
export const admissionRequirementsSchema = z.object({
  bachelor: z.object({
    gpa: z.string(),
    standardizedTests: z.string(),
    englishProficiency: z.string(),
    additionalRequirements: z.string(),
    applicationDeadline: z.string(),
  }),
  master: z.object({
    gpa: z.string(),
    standardizedTests: z.string(),
    englishProficiency: z.string(),
    additionalRequirements: z.string(),
    applicationDeadline: z.string(),
  }),
});

// University schema
export const universitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  country: z.string(),
  countryFull: z.string(),
  city: z.string(),
  founded: z.number().nullable(),
  rating: z.number(),
  tuitionAnnual: z.number(),
  tuitionAnnualUSD: z.number(),
  currency: z.string(),
  hasGrant: z.boolean(),
  languages: z.array(z.string()),
  degreeLevels: z.array(z.string()),
  majors: z.array(z.string()),
  strongMajors: z.array(z.string()),
  summary: z.string(),
  tagline: z.string(),
  website: z.string(),
  logo: z.string(),
  employmentRate: z.number().nullable(),
  internationalStudentsPercent: z.number(),
  cases: z.array(caseSchema),
  deadlines: z.array(deadlineSchema),
  admissionRequirements: admissionRequirementsSchema,
});

export type University = z.infer<typeof universitySchema>;
export type Deadline = z.infer<typeof deadlineSchema>;
export type Case = z.infer<typeof caseSchema>;
export type AdmissionRequirements = z.infer<typeof admissionRequirementsSchema>;

// Chat message schema
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Filter options
export interface FilterOptions {
  countries?: string[];
  tuitionRange?: [number, number];
  degreeLevels?: string[];
  majors?: string[];
  hasGrant?: boolean;
}

// Sort options
export type SortOption = "ranking" | "tuition-low" | "tuition-high" | "intl-students" | "best-fit";
