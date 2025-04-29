export interface Symptom {
  id: number;
  created_at: string;
  category_id: number;
  symptom_name: string;
  patient_symptoms?: PatientSymptom[];
}

export interface SymptomCategory {
  id: number;
  name: string;
  type: string; 
  symptoms: Symptom[];
}
export interface PatientSymptom {
  patient_id: string;
}

export interface SymptomsCardProps {
  cardData: SymptomCategory;
  selectedSymptoms: Record<number, number | string[]>;
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<Record<number, number | string[]>>>;
}