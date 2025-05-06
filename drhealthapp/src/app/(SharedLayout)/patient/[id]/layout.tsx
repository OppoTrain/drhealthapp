"use client";
import NavHeader from "./NavHeader";
import Header from "./Header";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface DietPlan {
  plan_name: string;
}

interface MealsPlan {
  diet_plan: DietPlan; 
}

interface Patient {
  patient_id: string;
  created_at: string;
  doctor_id: string;
  patient_name: string;
  disease: string; 
  gender: string;
  phone_number: string;
  birth_date: string;
  conclusion: string | null;
  plan_id: number;
  meals_plan: MealsPlan | null; 
}

interface ClientRootLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default function ClientRootLayout({ children, params }: ClientRootLayoutProps) {
  const supabase = createClient();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClient(params.id);
  }, [params.id]);

  const fetchClient = async (patientId: string) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from("patient")
        .select("*, meals_plan(diet_plan(plan_name))")
        .eq("patient_id", patientId)
        .single();

      if (error) throw error;
      setPatient(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";
      console.error("Error fetching patient:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return <div className="text-center py-4">Loading patient data...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (!patient) {
    return <div className="text-center py-4 text-red-500">Patient not found.</div>;
  }

  const dietPlanName = patient.meals_plan?.diet_plan?.plan_name ?? "No diet plan available";

  return (
    <>
      <Header
        userName={patient.patient_name}
        birthDate={patient.birth_date}
        age={calculateAge(patient.birth_date)}
        dietPlan={dietPlanName}
      />
      <NavHeader patientId={params.id} />
      {children}
    </>
  );
}