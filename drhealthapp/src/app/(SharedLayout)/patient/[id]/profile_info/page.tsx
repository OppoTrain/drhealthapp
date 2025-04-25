'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DynamicForm from "@/components/DynamicForm";
import { pattern } from "framer-motion/client";



export default function PatientProfileForm({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [initialValuesProfileInfo, setInitialValuesProfileInfo] = useState({});
    const [initialValues, setInitialValues] = useState({});
    const [areas, setAreas] = useState([]);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data ,errorOne } = await supabase
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
                        pregnancy_weeks
                    )
                `)
                .eq('patient_id', params.id)
                .single();
                    console.log('Fetched patient data:', data);
                    console.log('id' , params.id);
                    if (errorOne) {
                        console.error('Error fetching patient:', errorOne);
                        return;
                    }

                    setInitialValues({
                        patient_name: data.patient_name || '',
                        gender: data.gender || '',
                        phone_number: data.phone_number || '',
                        birth_date: data.birth_date || '',
                        ...(data.patient_profile? {
                          national_id: data.patient_profile[0].national_id || '',
                          first_visit: data.patient_profile[0].first_visit || '',
                          marital_status: data.patient_profile[0].marital_status || '',
                          bedtime: data.patient_profile[0].bedtime || '',
                          sleep_hours: data.patient_profile[0].sleep_hours || '',
                          children_number: data.patient_profile[0].children_number || '',
                          previos_births: data.patient_profile[0].previos_births || '',
                          pregnance_status: data.patient_profile[0].pregnance_status || '',
                          pregnancy_weeks: data.patient_profile[0].pregnancy_weeks || ''
                        } : {})
                      });

                      console.log('type of data..',typeof(data.patient_profile[0].sleep_hours));

                      console.log('is equal two : ' , data.gender==="Male");
                      console.log('is equal one notation : ' , data.gender==='Male');



                      // console.log('Gender values:', {
                      //   fromDB: data.gender,  // Should be 'Male'/'Female'/'Other'
                      //   options: ['Male', 'Female', 'Other'], // Should match exactly
                      //   isEqual: initialValues?.gender === "Male", // Verify case
                      //   type: typeof(data.patient_profile[0].pregnancy_weeks)
                      // });


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
            name: 'patient_name',
            label: 'Patient name',
            type: 'text',
            required: true,
            initialValue: initialValues?.patient_name || ''
          },
          {
            name: 'phone_number',
            label: 'Phone number',
            type: 'tel',
            required: true,
            initialValue: initialValues?.phone_number || ''
          },
          {
            name: 'birth_date',
            label: 'Birth date',
            type: 'date',
            required: true,
            initialValue: initialValues?.birth_date || ''
          },
          {
            name: 'gender',
            label: 'Gender',
            type: 'textGender',            
            required: true,
            initialValue: initialValues?.gender || '',
            pattern: '^(Male|Female)$', 
            patternMessage: 'Must be either "Male" or "Female"'
         
          },
          {
            name: 'national_id',
            label: 'National ID number',
            type: 'text',
            required: true,
            initialValue: initialValues?.national_id || ''
          },
          {
            name: 'first_visit',
            label: 'First visit date',
            type: 'date',
            required: true,
            initialValue: initialValues?.first_visit || ''
          },
          {
            name: 'marital_status',
            label: 'Marital status',
             type: 'textMaritalState',
            required: true,
            initialValue: initialValues?.marital_status || '',
            pattern:'^(Married|Single|Armal)$',
            patternMessage: 'Must be either "Married" or "Single" or "Armal"'

          },
          {
            name: 'bedtime',
            label: 'Bedtime',
            type: 'time',
            initialValue: initialValues?.bedtime || ''
          },
          {
            name: 'sleep_hours',
            label: 'Number of hours sleep',
            type: 'number',
            min: 0,
            max: 24,
            initialValue: initialValues?.sleep_hours || ''
          },
          {
            name: 'children_number',
            label: 'Number of children',
            type: 'number',
            min: 0,
            initialValue: initialValues?.children_number || 0
          },
          {
            name: 'previous_births',
            label: 'Number of previous births',
            type: 'number',
            min: 0,
            initialValue: initialValues?.previos_births || 0
          },
          {
            name: 'pregnancy_status',
            label: 'Are you pregnant?',
            type: 'radio',
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ],
            initialValue: initialValues?.pregnance_status ? 'true' : 'false',
            transform: (value) => value === 'true'
          },
          {
            name: 'pregnancy_weeks',
            label: 'Number of weeks of pregnancy',
            type: 'number',
            min: 0,
            max: 42,
            initialValue: initialValues?.pregnancy_weeks || 0,
            // hidden: !initialValues?.pregnance_status,
            
          }
        ],
        submitButtonText: 'Save',
        onSubmit: async (values) => {
          try {
            // Format values before submission
            const formattedValues = {
              ...values,
              sleep_hours: values.sleep_hours ? Number(values.sleep_hours) : null,
              children_number: values.children_number ? Number(values.children_number) : null,
              previous_births: values.previous_births ? Number(values.previous_births) : null,
              pregnancy_weeks: values.pregnancy_weeks ? Number(values.pregnancy_weeks) : null,
              pregnance_status: Boolean(values.pregnancy_status),
              first_visit: values.first_visit || null,
              bedtime: values.bedtime || null
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
      
            // Handle patient profile (upsert)
            const { error: profileError } = await supabase
              .from('patient_profile')
              .upsert({
                patient_id: params.id,
                ...formattedValues
              });
      
            if (profileError) throw profileError;
      
            alert('Patient data saved successfully!');
            router.push('/patients');
          } catch (err) {
            console.error('Error saving patient data:', err);
            alert('Failed to save patient data');
          }
        },
        onCancel: () => router.push('/patients')
      };

    if (loading) return <div>Loading...</div>;

    return <DynamicForm formConfig={{ ...formConfig, initialValuesProfileInfo }} />;
}