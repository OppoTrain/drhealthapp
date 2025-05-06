'use client'

import DynamicForm from "@/components/DynamicForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MedicalInfo {
    chronicDiseases: string | number;
    recentSurgeries: string | number;
    allergies: string | number;
    medications: string | number;
}

interface FormValues {
    chronic_diseases: string;
    recent_surgeries_hospitalizations: string;
    allergies_intolerances: string;
    medications: string;
}

export default function Page({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<MedicalInfo>({
        chronicDiseases: '',
        recentSurgeries: '',
        allergies: '',
        medications: '',
    });
    const supabase = createClient();
    const router = useRouter()

    useEffect(() => {
        const getClientMedicalInfo = async () => {
            try {
                const { data, error } = await supabase
                    .from('medical_informations')
                    .select('chronic_diseases, recent_surgeries_hospitalizations, allergies_intolerances, medications')
                    .eq('patient_id', params.id)
                    .single();

                if (error) {
                    console.error('Error fetching medical info:', error);
                    return;
                }
                setInitialValues({
                    chronicDiseases: data?.chronic_diseases || '',
                    recentSurgeries: data?.recent_surgeries_hospitalizations || '',
                    allergies: data?.allergies_intolerances || '',
                    medications: data?.medications || '',
                });
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };

        getClientMedicalInfo();
    }, [params.id]);

    const formConfig = {
        inputColumns: 2,
        title: 'Medical Info',
        fields: [
            {
                name: 'chronic_diseases',
                label: 'Chronic Diseases',
                type: 'text',
                required: true,
                initialValue: initialValues.chronicDiseases
            },
            {
                name: 'recent_surgeries_hospitalizations',
                label: 'Recent Surgeries or Hospitalizations',
                type: 'text',
                required: true,
                initialValue: initialValues.recentSurgeries
            },
            {
                name: 'allergies_intolerances',
                label: 'Known Allergies or Intolerances',
                type: 'text',
                required: true,
                initialValue: initialValues.allergies
            },
            {
                name: 'medications',
                label: 'Medications or Supplements',
                type: 'text',
                required: true,
                initialValue: initialValues.medications
            },
        ],
        submitButtonText: 'Save',
        onSubmit: async (values:FormValues) => {
            try {
                const hasInitialValues = Object.values(initialValues).some(value => value !== '');
                if (hasInitialValues) {
                    const { error } = await supabase
                        .from('medical_informations')
                        .update({
                            chronic_diseases: values.chronic_diseases,
                            recent_surgeries_hospitalizations: values.recent_surgeries_hospitalizations,
                            allergies_intolerances: values.allergies_intolerances,
                            medications: values.medications,
                        })
                        .eq('patient_id', params.id);

                    if (error) throw error;
                    console.log('Medical Information updated:', values);
                    alert('Medical Information updated!');
                } else {
                    // Insert new record
                    const { error } = await supabase
                        .from('medical_informations')
                        .insert({
                            patient_id: params.id,
                            chronic_diseases: values.chronic_diseases,
                            recent_surgeries_hospitalizations: values.recent_surgeries_hospitalizations,
                            allergies_intolerances: values.allergies_intolerances,
                            medications: values.medications,
                        });

                    if (error) throw error;
                    console.log('Medical Information inserted:', values);
                    alert('Medical Information saved!');
                }
            } catch (err) {
                console.error('Error saving medical info:', err);
                alert('Failed to save medical information.');
            }
        },
        onCancel: () => {
            router.push('/dashboard')
        },
    };

    if (loading) {
        return <p>loading ... </p>;
    }

    return <DynamicForm formConfig={formConfig} />;
}
