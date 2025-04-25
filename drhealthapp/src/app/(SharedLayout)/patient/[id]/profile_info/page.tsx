'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DynamicForm from "@/components/DynamicForm";

export default function PatientProfileForm({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({});
    const [areas, setAreas] = useState([]);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch patient data
                const { data: patientData } = await supabase
                    .from('patient_profile')
                    .select('*')
                    .eq('patient_id', params.id)
                    .single();

                // Fetch areas for dropdown
                const { data: areaData } = await supabase
                    .from('area')
                    .select('id,name')
                    .order('name');

                setInitialValues(patientData || {});
                setAreas(areaData || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const formConfig = {
        inputColumns: 2,
        fields: [
            {
                name: 'name',
                label: 'Patient name',
                type: 'textarea',
                required: true,
                initialValue: initialValues?.name
            },
            {
                name: 'phone',
                label: 'Phone number',
                type: 'tel',
                required: true,
                initialValue: initialValues?.phone
            },
            {
                name: 'birth_date',
                label: 'Birth date',
                type: 'date',
                required: true,
                initialValue: initialValues?.birth_date
            },
            {
                name: 'gender',
                label: 'Gender',
                type: 'select',
                options: [
                    { value: 'Female', label: 'Female' },
                    { value: 'Male', label: 'Male' },
                ],
                required: true,
                initialValue: initialValues?.gender
            },
            {
                name: 'area_id',
                label: 'Residential area',
                type: 'select',
                options: areas.map(area => ({ value: area.id, label: area.name })),
                required: true,
                initialValue: initialValues?.area_id
            },
            {
                name: 'national_id',
                label: 'National ID number',
                type: 'textarea',
                required: true,
                initialValue: initialValues?.national_id
            },
            {
                name: 'first_visit',
                label: 'First visit date',
                type: 'date',
                required: true,
                initialValue: initialValues?.first_visit
            },
            {
                name: 'marital_status',
                label: 'Married status',
                type: 'select',
                options: [
                    { value: 'Single', label: 'Single' },
                    { value: 'Married', label: 'Married' },
                ],
                required: true,
                initialValue: initialValues?.marital_status
            },
            {
                name: 'bedtime',
                label: 'Bedtime',
                type: 'time',
                initialValue: initialValues?.bedtime
            },
            {
                name: 'sleep_hours',
                label: 'Number of hours sleep',
                type: 'number',
                min: 0,
                max: 24,
                initialValue: initialValues?.sleep_hours
            },
            {
                name: 'children_number',
                label: 'Number of children',
                type: 'number',
                min: 0,
                initialValue: initialValues?.children_number
            },
            {
                name: 'previous_births',
                label: 'Number of previous births',
                type: 'number',
                min: 0,
                initialValue: initialValues?.previous_births
            },
            {
                name: 'pregnancy_status',
                label: 'Are you pregnant?',
                type: 'radio',
                options: [
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                ],
                initialValue: initialValues?.pregnancy_status
            },
            {
                name: 'pregnancy_weeks',
                label: 'Number of weeks of pregnancy',
                type: 'number',
                min: 0,
                max: 42,
                initialValue: initialValues?.pregnancy_weeks,
                hidden: !initialValues?.pregnancy_status // Only show if pregnant
            }
        ],
        submitButtonText: 'Save',
        onSubmit: async (values) => {
            try {
                const hasInitialValues = Object.keys(initialValues).length > 0;
                // Convert data types where needed
                const formattedValues = {
                    ...values,
                    sleep_hours: values.sleep_hours ? Number(values.sleep_hours) : null,
                    children_number: values.children_number ? Number(values.children_number) : null,
                    previous_births: values.previous_births ? Number(values.previous_births) : null,
                    pregnancy_weeks: values.pregnancy_weeks ? Number(values.pregnancy_weeks) : null,
                    pregnancy_status: values.pregnancy_status === 'true' || values.pregnancy_status === true
                };

                if (hasInitialValues) {
                    // Update existing record
                    const { error } = await supabase
                        .from('patient_profile')
                        .update(formattedValues)
                        .eq('patient_id', params.id);

                    if (error) throw error;
                    alert('Profile updated successfully!');
                }
                else{
                    const { error } = await supabase
                        .from('patient_profile')
                        .insert({
                            patient_id: params.id,
                            ...formattedValues
                        });

                    if (error) throw error;
                    alert('Profile created successfully!');
                }
            
            } catch (err) {
                console.error('Error saving profile:', err);
                alert('Failed to save profile');
            }
        },
        onCancel: () => router.push('/dashboard')
    };

    if (loading) return <div>Loading...</div>;

    return <DynamicForm formConfig={{ ...formConfig, initialValues }} />;
}