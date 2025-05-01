'use client';

import DynamicForm from '@/components/DynamicForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MedicalInfo {
  conclusion: string;
}

export default function MedicalInfoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [initialValues, setInitialValues] = useState<MedicalInfo>({ conclusion: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicalInfo() {
      try {
        const { data, error } = await supabase
          .from('patient')
          .select('conclusion')
          .eq('patient_id', params.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data && data.conclusion) {
          setInitialValues({ conclusion: data.conclusion });
        }
      } catch (err) {
        console.error('Error fetching medical info:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicalInfo();
  }, [params.id, supabase]);

  const formConfig = {
    inputColumns: 2,
    title: 'Conclusion',
    fields: [
      {
        name: 'conclusion',
        label: 'Conclusion',
        type: 'text',
        required: true,
      },
    ],
    submitButtonText: 'Save',
    onSubmit: async (values: MedicalInfo) => {
      try {
        const hasInitialValues = initialValues.conclusion !== '';
        if (hasInitialValues) {
          const { error } = await supabase
            .from('patient')
            .update({ conclusion: values.conclusion })
            .eq('patient_id', params.id);

          if (error) throw error;
          alert('Conclusion updated!');
        } else {
          const { error } = await supabase
            .from('patient')
            .update({ conclusion: values.conclusion })
            .eq('patient_id', params.id);

          if (error) throw error;
          alert('Conclusion saved!');
        }
      } catch (err) {
        console.error('Error saving conclusion:', err);
        alert('Failed to save conclusion.');
      }
    },
    onCancel: () => router.push('/dashboard'),
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return <DynamicForm formConfig={{ ...formConfig, initialValues }} />;
}