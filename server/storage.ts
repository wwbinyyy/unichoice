import { type University } from "@shared/schema";
import universityData from "../attached_assets/universities_enhanced (1)_1763850085712.json";

export interface IStorage {
  getAllUniversities(): Promise<University[]>;
  getUniversityBySlug(slug: string): Promise<University | undefined>;
  searchUniversities(query: string): Promise<University[]>;
}

export class MemStorage implements IStorage {
  private universities: University[];

  constructor() {
    this.universities = (universityData as { universities: University[] }).universities;
    console.log(`Loaded ${this.universities.length} universities into memory`);
  }

  async getAllUniversities(): Promise<University[]> {
    return this.universities;
  }

  async getUniversityBySlug(slug: string): Promise<University | undefined> {
    return this.universities.find(u => u.slug === slug);
  }

  async searchUniversities(query: string): Promise<University[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    return this.universities
      .filter(u =>
        u.name.toLowerCase().includes(searchTerm) ||
        u.city.toLowerCase().includes(searchTerm) ||
        u.countryFull.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10);
  }
}

export const storage = new MemStorage();
