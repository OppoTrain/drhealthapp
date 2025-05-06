'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DynamicForm from "@/components/DynamicForm";
import { label, option } from "framer-motion/client";



export default function PatientProfileForm({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
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
                        pregnancy_weeks,
                        residential_area
                    )
                `)
                .eq('patient_id', params.id)
                .single();
                      console.log('Fetched patient data.......:', data);
                    // console.log('id' , params.id);
                    if (errorOne) {
                        console.error('Error fetching patient:', errorOne);
                        return;
                    }

                    setInitialValues({
                        patient_name: data.patient_name || '',
                        gender: data.gender || '',
                        phone_number: data.phone_number || '',
                        birth_date: data.birth_date || '',
                        ...(data.patient_profile && data.patient_profile.length > 0 ?{
                          national_id: data.patient_profile[0].national_id || '',
                          first_visit: data.patient_profile[0].first_visit || '',
                          marital_status: data.patient_profile[0].marital_status || '',
                          bedtime: data.patient_profile[0].bedtime || '',
                          sleep_hours: data.patient_profile[0].sleep_hours || '',
                          children_number: data.patient_profile[0].children_number || '',
                          previos_births: data.patient_profile[0].previos_births || '',
                          pregnance_status: data.patient_profile[0].pregnance_status || false,
                          pregnancy_weeks: data.patient_profile[0].pregnancy_weeks || '',
                          residential_area:data.patient_profile[0].residential_area || '',
                        } : {})
                      });
                      console.log('Initial residential_area value:', initialValues?.residential_area);

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
          // console.log('areas from db' , data);
        if (error) {
          console.error('Error fetching areas:', error);
        } else {
        const transformedData = data.map(item => ({
          id: item.id,
          name: item.name
        }));

        setAreas(transformedData);
         
         console.log('transformedData',typeof(transformedData[0]?.id) );
         console.log('transformedData',transformedData);



        }
      };
      fetchAreas();
    }, []);

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
          // {
          //   name: 'gender',
          //   label: 'Gender',
          //   type: 'textGender',            
          //   required: true,
          //   initialValue: initialValues?.gender || '',
          //   pattern: '^(Male|Female)$', 
          //   patternMessage: 'Must be either "Male" or "Female"'
         
          // },
          {
              name: 'gender',
              label: 'Gender',
              type: 'select',
              options:[
                {value : 'Female' , label:"Female"},
                {value : 'Male' , label:"Male"},
              ],            
              required: true,
              initialValue: initialValues?.gender || '',           
          },


          {
              name: 'residential_area',
              label: 'Residential area',
              type: 'select',
               options: areas.map(area => ({ value:area.id, label: area.name })),
              required: true,
               initialValue:2            
              ? Number(initialValues.residential_area) // Force number type
              : undefined
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
          // {
          //   name: 'marital_status',
          //   label: 'Marital status',
          //    type: 'textMaritalState',
          //   required: true,
          //   initialValue: initialValues?.marital_status || '',
          //   pattern:'^(Married|Single|Armal)$',
          //   patternMessage: 'Must be either "Married" or "Single" or "Armal"'

          // },

          {
              name: 'marital_status',
              label: 'Marital status',
              type: 'select',
              options:[
                {value : 'Single' , label:"Single"},
                {value : 'Married' , label:"Married"},
              ],      
              required: true,
              initialValue: initialValues?.marital_status || '',  
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
            name: 'pregnance_status',
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
            const formattedValues = {
              national_id: values.national_id,
              first_visit: values.first_visit || null,
              marital_status: values.marital_status,
              bedtime: values.bedtime || null,
              sleep_hours: values.sleep_hours ? Number(values.sleep_hours) : null,
              children_number: values.children_number ? Number(values.children_number) : null,
              previos_births: values.previous_births ? Number(values.previous_births) : null,
              pregnance_status: values.pregnance_status === "true",
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

              // First check if any profile exists for this patient
            const { data: existingProfiles, error: fetchError } = await supabase
            .from('patient_profile')
            .select('id')
            .eq('patient_id', params.id);

            if (fetchError) throw fetchError;


            if (existingProfiles && existingProfiles.length > 0) {
              // Update all matching profiles (though there should ideally be just one)
              const { error: updateError } = await supabase
                .from('patient_profile')
                .update(formattedValues)
                .eq('patient_id', params.id);
          
              if (updateError) throw updateError;
            }

            else {
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



            

          } catch (err) {
            console.error('Error saving patient data:', err);
            alert('Failed to save patient data');
          }
        },
        onCancel: () => router.push('/dashboard')
      };

    if (loading) return <div>Loading...</div>;

    return <DynamicForm formConfig={{ ...formConfig, initialValues }} />;
}