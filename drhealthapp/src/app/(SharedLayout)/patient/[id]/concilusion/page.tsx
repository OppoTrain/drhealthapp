'use client';
import DynamicForm from '@/components/DynamicForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

interface MedicalInfo {
  conclusion: string;
}

export default function MedicalInfoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [initialValues, setInitialValues] = useState<MedicalInfo>({ conclusion: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        if (data) {
          setInitialValues({ conclusion: data.conclusion });
        }
      } catch (err) {
        console.error('Error fetching medical info:', err);
        setError('Failed to load conclusion data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMedicalInfo();
  }, [params.id, supabase]);

  const formConfig = useMemo(() => ({
    inputColumns: 2,
    title: 'Conclusion',
    fields: [
      {
        name: 'conclusion',
        label: 'Conclusion',
        type: 'text',
        required: true,
        initialValue: initialValues.conclusion,
      },
    ],
    submitButtonText: 'Save',
    onSubmit: async (values: MedicalInfo) => {
      try {
        const { error } = await supabase
          .from('patient')
          .update({ conclusion: values.conclusion })
          .eq('patient_id', params.id);
        
        if (error) throw error;
        alert('Conclusion saved!');
      } catch (err) {
        console.error('Error saving conclusion:', err);
        alert('Failed to save conclusion.');
      }
    },
    onCancel: () => router.push('/dashboard'),
  }), [initialValues.conclusion, params.id, router, supabase]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Fixed: Removed the initialValues property since it's not part of FormConfig
  return <DynamicForm formConfig={formConfig} />;
}
