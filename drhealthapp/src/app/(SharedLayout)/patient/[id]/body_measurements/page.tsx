'use client'

import DynamicForm from "@/components/DynamicForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({});
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getClientBodyMeasurements = async () => {
            try {
                const { data, error } = await supabase
                    .from('body_measurement')
                    .select('weight, height, waist_circumference, hip_circumference')
                    .eq('patient_id', params.id)
                    .single();

                if (error) {
                    console.error('Error fetching body measurements:', error);
                    return;
                }
                // console.log('Fetched body measurements:', data);
                setInitialValues({
                    weight: data?.weight || '',
                    height: data?.height || '',
                    waistCircumference: data?.waist_circumference || '',
                    hipCircumference: data?.hip_circumference || '',
                });
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
            
        };

        getClientBodyMeasurements();
    }, [params.id]);

    const formConfig = {
        inputColumns: 2,
        title: 'Body Measurements',
        fields: [
            {
                name: 'weight',
                label: 'Weight (kg)',
                type: 'number',
                min: 30,  // minimum value
                max: 300,
                required: true,
                initialValue: initialValues?.weight
            },
            {
                name: 'height',
                label: 'Height (cm)',
                min: 50,  // minimum value
                max: 200,
                type: 'number',
                required: true,
                initialValue: initialValues?.height
            },
            {
                name: 'waist_circumference',
                label: 'Waist Circumference (cm)',
                type: 'number',
                min: 30,  // minimum value
                max: 300,
                required: true,
                initialValue: initialValues?.waistCircumference
            },
            {
                name: 'hip_circumference',
                label: 'Hip Circumference (cm)',
                type: 'number',
                min: 30,  // minimum value
                max: 300,
                required: true,
                initialValue: initialValues?.hipCircumference
            },
        ],
        submitButtonText: 'Save',
        onSubmit: async (values) => {
            try {
                // Convert string inputs to numbers
                const numericValues = {
                    weight: Number(values.weight),
                    height: Number(values.height),
                    waist_circumference: Number(values.waist_circumference),
                    hip_circumference: Number(values.hip_circumference),
                };
        
                const hasInitialValues = Object.keys(initialValues).length > 0;
                
                if (hasInitialValues) {
                    const { error } = await supabase
                        .from('body_measurement')
                        .update(numericValues)
                        .eq('patient_id', params.id);
        
                    if (error) throw error;
                    alert('Body measurements updated!');
                } else {
                    const { error } = await supabase
                        .from('body_measurement')
                        .insert({
                            patient_id: params.id,
                            ...numericValues
                        });
        
                    if (error) throw error;
                    alert('Body measurements saved!');
                }
            } catch (err) {
                console.error('Error saving body measurements:', err.message);
                alert('Failed to save body measurements.');
            }
        },
        onCancel: () => {
            router.push('/dashboard')
        },
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return <DynamicForm formConfig={{ ...formConfig, initialValues }} />;
}