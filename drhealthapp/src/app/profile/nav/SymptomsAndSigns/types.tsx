export interface Symptom {
    id: number;
    created_at: string;
    category_id: number;
    symptom_name: string;
  }
  
export interface SymptomCategory {
    id: number;
    name: string;
    type: string; 
    symptoms: Symptom[];
  }