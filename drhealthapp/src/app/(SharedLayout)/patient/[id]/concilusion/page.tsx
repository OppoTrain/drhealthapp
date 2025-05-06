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

  // Let's try separating the form configuration from values and handlers
  const formFields = useMemo(() => [
    {
      name: 'conclusion',
      label: 'Conclusion',
      type: 'text',
      required: true,
      initialValue: initialValues.conclusion,
    }
  ], [initialValues.conclusion]);

  const handleSubmit = async (values: MedicalInfo) => {
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
  };

  const handleCancel = () => router.push('/dashboard');

  // Simplified form configuration
  const formConfig = {
    fields: formFields,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    title: 'Conclusion',
    submitButtonText: 'Save',
    columns: 2,  // Instead of inputColumns (this is a guess)
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return <DynamicForm formConfig={formConfig} />;
}
