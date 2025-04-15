'use client'

import DynamicForm from "@/components/DynamicForm";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({});
    const supabase = createClient();
    const router = useRouter()
    useEffect(() => {
        const getClientDietaryInfo = async () => {
            try {
                const { data, error } = await supabase
                    .from('dietary_habits')
                    .select('dietary_habits, social_and_emotional_considerations')
                    .eq('patient_id', params.id)
                    .single();

                if (error) {
                    console.error('Error fetching dietary info:', error);
                    return;
                }
                setInitialValues({
                    dietaryHabits: data?.dietary_habits || '',
                    socialEmotional: data?.social_and_emotional_considerations || '',
                });
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };

        getClientDietaryInfo();
    }, [params.id]);

    const formConfig = {
        inputColumns: 2,
        title: 'Dietary Habits',
        fields: [
            {
                name: 'dietary_habits',
                label: 'Dietary Habits and Preferences',
                type: 'text',
                required: true,
                initialValue: initialValues?.dietaryHabits,
            },
            {
                name: 'social_and_emotional_considerations',
                label: 'Social and Emotional Considerations',
                type: 'text',
                required: true,
                initialValue: initialValues?.socialEmotional,
            },
        ],
        submitButtonText: 'Save',
        onSubmit: async (values) => {
            try {
                const hasInitialValues = Object.keys(initialValues).length > 0;

                if (hasInitialValues) {
                    const { error } = await supabase
                        .from('dietary_habits')
                        .update({
                            dietary_habits: values.dietary_habits,
                            social_and_emotional_considerations: values.social_and_emotional_considerations,
                        })
                        .eq('patient_id', params.id);

                    if (error) throw error;
                    console.log('Dietary Habits updated:', values);
                    alert('Dietary Habits updated!');
                } else {
                    const { error } = await supabase
                        .from('dietary_habits')
                        .insert({
                            patient_id: params.id,
                            dietary_habits: values.dietary_habits,
                            social_and_emotional_considerations: values.social_and_emotional_considerations,
                        });

                    if (error) throw error;
                    console.log('Dietary Habits inserted:', values);
                    alert('Dietary Habits saved!');
                }
            } catch (err) {
                console.error('Error saving dietary info:', err);
                alert('Failed to save dietary information.');
            }
        },
        onCancel: () => {
            router.push('/dashboard')

        },
    };

    if (loading) {
        return <p>loading ... </p>;
    }

    return <DynamicForm formConfig={{ ...formConfig, initialValues }} />;
}