export interface MedicineAlternative {
  name: string;
  type: string;
  description: string;
}

export interface Availability {
  forms: string[];
  prescriptionRequired: boolean;
  availabilityStatus: string;
  countries: string[];
  priceRangePKR: string;
}

export interface GenericVsBrand {
  genericName: string;
  brandName: string;
  genericPricePKR: number;
  brandPricePKR: number;
  genericManufacturer: string;
  brandManufacturer: string;
  bioavailability: string;
  approvalStatus: string;
  recommendation: string;
}

export interface MedicineDetails {
  brandName: string;
  genericName: string;
  type?: string;
  drugClass?: string;
  overview?: string;
  category?: string; // fallback
  chemicalFormula: string;
  activeSalts?: string;
  composition?: string; // fallback
  uses: string;
  dosage: string;
  sideEffects: string;
  contraindications: string;
  drugInteractions: string;
  storageInstructions: string;
  pregnancyCategory: string;
  knownInteractions?: string[];
  manufacturer: string;
  summary?: string; // fallback
  availability?: Availability;
  genericVsBrand?: GenericVsBrand;
  alternatives: MedicineAlternative[];
}

export interface InteractionResult {
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  description: string;
  recommendation: string;
}

export interface PrescriptionAnalysis {
  patientName: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    purpose: string;
  }>;
  specialInstructions: string;
  warnings: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}
