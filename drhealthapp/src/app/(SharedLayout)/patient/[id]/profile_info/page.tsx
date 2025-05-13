'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DynamicForm from "@/components/DynamicForm";

type FieldType = 'text' | 'time' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date' | 'email' | 'password' | 'radio' | 'tel' | 'textGender' | 'textMaritalState';

interface FormField {
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    initialValue?: string | number;
    options?: Array<{ value: string; label: string }>; // Add this line
    min?: number; // Add these if you're using them
    max?: number;
    transform?: (value: string) => any; // Add this for your radio transform
}

interface FormConfig {
    inputColumns: number;
    title: string;
    fields: FormField[];
    submitButtonText: string;
    onSubmit: (values: any) => Promise<void> | void;
    onCancel?: () => void;
}




interface PatientProfile {
  national_id?: string;
  first_visit?: string;
  marital_status?: string;
  bedtime?: string;
  sleep_hours?: number;
  children_number?: number;
  previos_births?: number;
  pregnance_status?: boolean;
  pregnancy_weeks?: number;
  residential_area?: number;
}

interface PatientData {
  patient_name?: string;
  gender?: string;
  phone_number?: string;
  birth_date?: string;
  patient_profile?: PatientProfile[];
}

interface Area {
  id: number;
  name: string;
}

interface InitialValues extends Omit<PatientData, 'patient_profile'> {
  national_id?: string;
  first_visit?: string;
  marital_status?: string;
  bedtime?: string;
  sleep_hours?: number;
  children_number?: number;
  previos_births?: number;
  pregnance_status?: boolean;
  pregnancy_weeks?: number;
  residential_area?: number;
}

export default function PatientProfileForm({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<InitialValues>({});
    const [areas, setAreas] = useState<Area[]>([]); 
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                .from('patient')
                .select(`
                    patient_name,
                    gender,
                    phone_number,
                    birth_date,
                    patient_profile (
                        national_id,
                        first_visit,
                        marital_status,
                        bedtime,
                        sleep_hours,
                        children_number,
                        previos_births,
                        pregnance_status,
                        pregnancy_weeks,
                        residential_area
                    )
                `)
                .eq('patient_id', params.id)
                .single();

                if (error) {
                    console.error('Error fetching patient:', error);
                    return;
                }

                if (data) {
                    const profileData = data.patient_profile?.[0] || {};
                    setInitialValues({
                        patient_name: data.patient_name || '',
                        gender: data.gender || '',
                        phone_number: data.phone_number || '',
                        birth_date: data.birth_date || '',
                        national_id: profileData.national_id || '',
                        first_visit: profileData.first_visit || '',
                        marital_status: profileData.marital_status || '',
                        bedtime: profileData.bedtime || '',
                        sleep_hours: profileData.sleep_hours || 0,
                        children_number: profileData.children_number || 0,
                        previos_births: profileData.previos_births || 0,
                        pregnance_status: profileData.pregnance_status || false,
                        pregnancy_weeks: profileData.pregnancy_weeks || 0,
                        residential_area: profileData.residential_area || undefined
                    });
                }

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    useEffect(() => {
      const fetchAreas = async () => {
        const { data, error } = await supabase
          .from('area')
          .select('id, name')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching areas:', error);
        } else if (data) {
          setAreas(data.map(item => ({
            id: item.id,
            name: item.name
          })));
        }
      };
      fetchAreas();
    }, []);

    const getFormConfig :FormConfig={
        title: 'Patient Profile',
        inputColumns: 2,
        fields: [
          {
            name: 'patient_name',
            label: 'Patient name',
            type: 'text',
            required: true,
            initialValue: initialValues.patient_name || ''
          },
          {
            name: 'phone_number',
            label: 'Phone number',
            type: 'tel',
            required: true,
            initialValue: initialValues.phone_number || ''
          },
          {
            name: 'birth_date',
            label: 'Birth date',
            type: 'date',
            required: true,
            initialValue: initialValues.birth_date || ''
          },
          {
              name: 'gender',
              label: 'Gender',
              type: 'select',
              options:[
                {value: 'Female', label: "Female"},
                {value: 'Male', label: "Male"},
              ],            
              required: true,
              initialValue: initialValues.gender || '',           
          },
          {
              name: 'residential_area',
              label: 'Residential area',
              type: 'select',
              options: areas.map(area => ({ value: area.id.toString(), label: area.name })),
              required: true,
              initialValue: initialValues.residential_area?.toString() || '',
              transform: (value: string) => value ? Number(value) : null

          },
          {
            name: 'national_id',
            label: 'National ID number',
            type: 'text',
            required: true,
            initialValue: initialValues.national_id || ''
          },
          {
            name: 'first_visit',
            label: 'First visit date',
            type: 'date',
            required: true,
            initialValue: initialValues.first_visit || ''
          },
          {
              name: 'marital_status',
              label: 'Marital status',
              type: 'select',
              options:[
                {value: 'Single', label: "Single"},
                {value: 'Married', label: "Married"},
              ],      
              required: true,
              initialValue: initialValues.marital_status || '',  
          },
          {
            name: 'bedtime',
            label: 'Bedtime',
            type: 'time',
            required: true,
            initialValue: initialValues.bedtime || ''
          },
          {
            name: 'sleep_hours',
            label: 'Number of hours sleep',
            type: 'number',
            min: 0,
            max: 24,
            required: true,
            initialValue: initialValues.sleep_hours?.toString() || '0'
          },
          {
            name: 'children_number',
            label: 'Number of children',
            type: 'number',
            min: 0,
            required: true,
            initialValue: initialValues.children_number?.toString() || '0'
          },
          {
            name: 'previos_births',
            label: 'Number of previous births',
            type: 'number',
            min: 0,
            required: false,
            initialValue: initialValues.previos_births?.toString() || '0'
          },
          {
            name: 'pregnance_status',
            label: 'Are you pregnant?',
            type: 'radio',
            required: true,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ],
            initialValue: initialValues.pregnance_status ? 'true' : 'false',
            transform: (value: string) => value === 'true'
          },
          {
            name: 'pregnancy_weeks',
            label: 'Number of weeks of pregnancy',
            type: 'number',
            required: false,
            min: 0,
            max: 42,
            initialValue: initialValues.pregnancy_weeks?.toString() || '0',
          }
        ],
        submitButtonText: 'Save',

        onSubmit: async (values: Record<string, any>) => {
          try {
            // Convert radio button value to boolean properly
            const pregnanceStatus = values.pregnance_status === 'true';
        
            const formattedValues = {
              national_id: values.national_id,
              first_visit: values.first_visit || null,
              marital_status: values.marital_status,
              bedtime: values.bedtime || null,
              sleep_hours: values.sleep_hours ? Number(values.sleep_hours) : null,
              children_number: values.children_number ? Number(values.children_number) : null,
              previos_births: values.previous_births ? Number(values.previous_births) : null,
              pregnance_status: pregnanceStatus,
              pregnancy_weeks: values.pregnancy_weeks ? Number(values.pregnancy_weeks) : null,
              residential_area: values.residential_area ? Number(values.residential_area) : null,

            };
        
            // Update patient basic info
            const { error: patientError } = await supabase
              .from('patient')
              .update({
                patient_name: values.patient_name,
                phone_number: values.phone_number,
                birth_date: values.birth_date,
                gender: values.gender
              })
              .eq('patient_id', params.id);
        
            if (patientError) throw patientError;
        
            // Check for existing profile
            const { data: existingProfiles, error: fetchError } = await supabase
              .from('patient_profile')
              .select('id')
              .eq('patient_id', params.id);
        
            if (fetchError) throw fetchError;
        
            if (existingProfiles && existingProfiles.length > 0) {
              // Update existing profile
              const { error: updateError } = await supabase
                .from('patient_profile')
                .update(formattedValues)
                .eq('patient_id', params.id);
          
              if (updateError) throw updateError;
            } else {
              // Insert new profile
              const { error: insertError } = await supabase
                .from('patient_profile')
                .insert({
                  patient_id: params.id,
                  ...formattedValues
                });
        
              if (insertError) throw insertError;
            }
        
            alert('Patient profile saved successfully!');
            router.push('/dashboard'); // Consider redirecting after success
          } catch (err) {
            console.error('Error saving patient data:', err);
            alert('Failed to save patient data');
          }
        },
    
        onCancel: () => router.push('/dashboard')
    };

    if (loading) return <div>Loading...</div>;

    return <DynamicForm formConfig={getFormConfig as any} />;

}
