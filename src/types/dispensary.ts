export interface HoursRange {
  open: string;
  close: string;
}

export interface WeeklyHours {
  monday: HoursRange | null;
  tuesday: HoursRange | null;
  wednesday: HoursRange | null;
  thursday: HoursRange | null;
  friday: HoursRange | null;
  saturday: HoursRange | null;
  sunday: HoursRange | null;
}

export interface Features {
  delivery: boolean;
  onlineOrdering: boolean;
  medicalProgram: boolean;
  veteranDiscount: boolean;
  seniorDiscount: boolean;
  firstTimeDiscount: boolean;
  loyaltyProgram: boolean;
  atm: boolean;
  parking: boolean;
  accessible: boolean;
  cashOnly: boolean;
  debitAccepted: boolean;
}

export interface Dispensary {
  slug: string;
  ccbLicenseNumber: string;
  name: string;
  dba?: string;

  // null = not yet verified against a real source
  address: string | null;
  city: string;
  town: string;
  county: string;
  state: "VT";
  zip: string | null;
  lat: number | null;
  lng: number | null;
  neighborhoodNote?: string;

  phone?: string;
  email?: string;
  website?: string;
  menuUrl?: string;
  instagramHandle?: string;

  // null = hours not verified. Never render or emit schema for unverified hours.
  hours: WeeklyHours | null;

  licenseType: "recreational" | "medical" | "both";
  licenseStatus: "active" | "inactive";
  licenseExpiry?: string;

  // null = features not verified.
  features: Features | null;

  menuProvider?: "dutchie" | "jane" | "iheartjane" | "leafly" | "other";
  menuEmbedId?: string;

  description?: string;
  editorialNote?: string;
  tags?: string[];
  heroImageUrl?: string;
  lastVerified?: string;

  isSponsor: boolean;
  sponsorTier?: "bronze" | "silver" | "gold";
  affiliateTarget?: string;
  cannatrailParticipant: boolean;
}
