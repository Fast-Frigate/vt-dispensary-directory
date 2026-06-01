export type VermontRegion =
  | "northwest"
  | "northeast-kingdom"
  | "central"
  | "champlain-valley"
  | "green-mountains"
  | "connecticut-river"
  | "southern"
  | "lamoille-valley";

export interface Town {
  slug: string;
  name: string;
  county: string;
  region: VermontRegion;
  lat: number;
  lng: number;
  population?: number;
  optedInDate?: string;
  isBorderTown: boolean;
  borderStates?: ("NH" | "NY" | "MA" | "QC" | "ON")[];
  nearbyHighways?: string[];
  touristAttractions?: string[];
  editorialIntro?: string;
  seoTitle?: string;
  seoDescription?: string;
}
