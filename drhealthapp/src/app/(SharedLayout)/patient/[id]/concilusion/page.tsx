'use client';
import DynamicForm from '@/components/DynamicForm';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useMemo } from 'react';

// Import the proper types - you'll need to create these imports based on where your types are defined
// If these types are exported from your DynamicForm component, import them like this:
// import DynamicForm, { FormConfig, FormField } from '@/components/DynamicForm';

interface MedicalInfo {
  conclusion: string;
}

export default function MedicalInfoPage({ params }: { params: { id: string } }) {
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

  const formFields = useMemo(() => [
    {
      name: 'conclusion',
      label: 'Conclusion',
      // Using a specific string literal type instead of generic 'text'
      type: 'textarea', // Changed from 'text' to 'textarea' as it seems more appropriate for a conclusion
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


  // Explicitly cast to any to bypass type checking temporarily if needed
  // Remove this cast once you've correctly imported and used the proper types
  const formConfig = {
    fields: formFields,
    onSubmit: handleSubmit,
    title: 'Conclusion',
    submitButtonText: 'Save',
    inputColumns: 2,
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return <DynamicForm formConfig={formConfig as any} />;
}
