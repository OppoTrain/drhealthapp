'use client';
import DynamicForm from '@/components/DynamicForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';

interface DietInfo {
  plan_name: string;
  plan_description: string;
  plan_calories: number;
}

interface PatientProfile {
  id: string;
  name: string;
  age: number;
  current_diet: string;
}

export default function DietPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [patient, setPatient] = useState<PatientProfile | null>(null);


  // Initialize form with empty values for a new entry
  const initialValues: DietInfo = { plan_name: '', plan_description: '', plan_calories: 0 };

  const formFields = useMemo(() => [
    {
      name: 'plan_name',
      label: 'Diet name',
      type: 'text',
      required: true,
      initialValue: initialValues.plan_name,
      maxLength: 50,
    },
    {
      name: 'plan_description',
      label: 'Description',
      type: 'textarea',
      required: true,
      initialValue: initialValues.plan_description,
    },
    {
      name: 'plan_calories',
      label: 'Total calories',
      type: 'number',
      required: true,
      initialValue: initialValues.plan_calories,
      min: 0,
    },
  ], [initialValues]);

  const handleSubmit = async (values: DietInfo) => {
    try {
      const { error } = await supabase
        .from('diet_plan')
        .insert({
          plan_name: values.plan_name,
          plan_description: values.plan_description,
          plan_calories: values.plan_calories,
          type: "Custom",
        });
      
      if (error) throw error;
      alert('Diet plan saved!');
      router.push(`/patient/${params.id}`);
    } catch (err) {
      console.error('Error saving diet plan:', err);
      alert('Failed to save diet plan.');
    }
  };

  const handleCancel = () => router.push('/dashboard');

  const formConfig = {
    title: patient ? `${patient.name}'s Profile` : 'Diet Plan',
    inputColumns: 1,
    fields: formFields,
    submitButtonText: 'Next',
    onSubmit: handleSubmit,
    onCancel: handleCancel,
  };

  return (
      <main className=" w-[90%] m-[auto]">
        <div className="w-[50%]  ">
          <DynamicForm formConfig={formConfig} />
        </div>
      </main>
  );
}