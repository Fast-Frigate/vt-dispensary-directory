export interface Strain {
  slug: string;
  name: string;
  type: "sativa" | "indica" | "hybrid" | "cbd";
  subtype?: "sativa-dominant" | "indica-dominant" | "balanced";
  thcRange: { min: number; max: number };
  cbdRange?: { min: number; max: number };
  primaryTerpenes: string[];
  effects: string[];
  flavors: string[];
  lineage?: string[];
  description: string;
  bestFor: string[];
  vermontAvailability?: string;
}
