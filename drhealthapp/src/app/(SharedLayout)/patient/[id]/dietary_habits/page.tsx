'use client'

import DynamicForm from "@/components/DynamicForm";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

// Import or define the FormConfig type to match DynamicForm's requirements
interface FormField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    initialValue: string | number;
}

interface FormConfig {
    inputColumns: number;
    title: string;
    fields: FormField[];
    submitButtonText: string;
    onSubmit: (values: any) => Promise<void>;
    
}

interface DietaryInfo {
    dietaryHabits: string | number;
    socialEmotional: string | number;
}

interface FormValues {
    dietary_habits: string;
    social_and_emotional_considerations: string;
}

export default function Page({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<DietaryInfo>({
        dietaryHabits: '',
        socialEmotional: '',
    });
    const supabase = createClient();
    
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

    const formConfig: FormConfig = {
        title: 'Dietary Habits',
        inputColumns: 2,
        fields: [
            {
                name: 'dietary_habits',
                label: 'Dietary Habits and Preferences',
                type: 'text',
                required: true,
                initialValue: initialValues.dietaryHabits,
            },
            {
                name: 'social_and_emotional_considerations',
                label: 'Social and Emotional Considerations',
                type: 'text',
                required: true,
                initialValue: initialValues.socialEmotional,
            },
        ],
        submitButtonText: 'Save',
        onSubmit: async (values: FormValues) => {
            try {
                const hasInitialValues = initialValues.dietaryHabits !== '' || initialValues.socialEmotional !== '';

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
       
    };

    if (loading) {
        return <p>loading ... </p>;
    }

   return <DynamicForm formConfig={formConfig as any} />;

}
