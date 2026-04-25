export interface MedicineAlternative {
  name: string;
  type: 'Generic' | 'Brand';
  note: string;
}

export interface MedicineDetails {
  brandName: string;
  genericName: string;
  category: string;
  chemicalFormula: string;
  composition: string;
  uses: string;
  dosage: string;
  sideEffects: string;
  contraindications: string;
  manufacturer: string;
  summary: string;
  alternatives: MedicineAlternative[];
}
