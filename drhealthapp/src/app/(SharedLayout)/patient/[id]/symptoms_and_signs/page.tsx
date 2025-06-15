"use client";
import { createClient } from "@/lib/supabase/client";
import Card from "./symptomsCard";
import { useEffect, useState } from "react";
import { SymptomCategory } from "./types";

interface PatientSymptomResponse {
  symptoms: {
    id: number;
    symptoms_categories: {
      id: number;
    };
  };
}

export default function SymptomsAndSigns({ params }: { params: { id: string } }) {
  const [data, setData] = useState<SymptomCategory[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<number, number | string[]>>({});
  const supabase = createClient();

  useEffect(() => {
    // Fetch all symptoms categories and their symptoms
    const fetchSymptomsData = async () => {
      const { data, error } = await supabase
        .from("symptoms_categories")
        .select("*, symptoms(*)")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching symptoms categories:", error);
      } else {
        setData(data);
      }
    };

    fetchSymptomsData();
  }, []);

  useEffect(() => {
    const fetchPatientSymptoms = async () => {
      const { data: patientData, error } = await supabase
        .from("patient_symptoms")
        .select("symptoms(id,symptoms_categories(id))")
        .eq("patient_id", params.id);

      if (error) {
        console.error("Error fetching patient symptoms:", error);
      } else {
        console.log("Raw patient data:", JSON.stringify(patientData, null, 2));
        if (patientData) {
          // Group symptoms by category
          const symptomsByCategory: Record<number, string[]> = {};

          (patientData as unknown as PatientSymptomResponse[]).forEach(item => {
            if (!item.symptoms?.id || !item.symptoms?.symptoms_categories?.id) {
              console.warn('Invalid symptom data structure:', JSON.stringify(item, null, 2));
              return;
            }

            const categoryId = item.symptoms.symptoms_categories.id;
            const symptomId = item.symptoms.id.toString();

            if (!symptomsByCategory[categoryId]) {
              symptomsByCategory[categoryId] = [];
            }

            symptomsByCategory[categoryId].push(symptomId);
          });

          // Set all symptoms at once
          setSelectedSymptoms(symptomsByCategory);
        }
      }
    };

    fetchPatientSymptoms();
  }, [params.id, supabase]);

  const deleteExcisted = async () => {
    await supabase
      .from("patient_symptoms")
      .delete()
      .eq("patient_id", params.id);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await deleteExcisted();
    const payload = Object.values(selectedSymptoms).flatMap(value => {
      if (Array.isArray(value)) {
        return value.map((id) => ({
          patient_id: params.id,
          symptom_id: Number(id),
        }));
      } else {
        return [{
          patient_id: params.id,
          symptom_id: Number(value),
        }];
      }
    });

    const { error } = await supabase
      .from("patient_symptoms")
      .insert(payload);
    if (error) {
      console.error("Error saving symptoms:", error.message);
    } else {
      console.log("Saved symptoms:", selectedSymptoms);
    }
  };

  return (
    <form onSubmit={handleSave} className="w-5/6 mx-auto py-12">
      <div className="grid gap-y-6 content-center justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {data.map((category) => (
          <Card
            key={category.id}
            cardData={category}
            selectedSymptoms={selectedSymptoms}
            setSelectedSymptoms={setSelectedSymptoms}
          />
        ))}
      </div>
      <div className="flex lg:justify-end md:justify-center sm:justify-center gap-[48px] px-[24px] py-[50px]">
        <button
          type="button"
          className="
            w-[260px] h-[50px] 
            border border-[#09868A] rounded-[12px]
            transition-transform duration-200 ease-in-out
            hover:scale-105 hover:opacity-90
            active:scale-95
          "
          onClick={() => setSelectedSymptoms({})}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="
            w-[260px] h-[50px] 
            bg-[#09868A] text-white rounded-[12px]
            transition-transform duration-200 ease-in-out
            hover:scale-105 hover:opacity-90
            active:scale-95
          "
        >
          Save
        </button>
      </div>
    </form>
  );
}
