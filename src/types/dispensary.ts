export interface HoursRange {
  open: string;
  close: string;
}

export interface Dispensary {
  slug: string;
  ccbLicenseNumber: string;
  name: string;
  dba?: string;

  address: string;
  city: string;
  town: string;
  county: string;
  state: "VT";
  zip: string;
  lat: number;
  lng: number;
  neighborhoodNote?: string;

  phone?: string;
  email?: string;
  website?: string;
  menuUrl?: string;
  instagramHandle?: string;

  hours: {
    monday: HoursRange | null;
    tuesday: HoursRange | null;
    wednesday: HoursRange | null;
    thursday: HoursRange | null;
    friday: HoursRange | null;
    saturday: HoursRange | null;
    sunday: HoursRange | null;
  };

  licenseType: "recreational" | "medical" | "both";
  licenseStatus: "active" | "inactive";
  licenseExpiry?: string;

  features: {
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
  };

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
