import React ,{ useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputFactory from './InputFactory';
import { FiEdit ,FiSave} from 'react-icons/fi'; // Import the edit icon

// Define interfaces for form configuration
interface FieldOption {
  label: string;
  value: string | number;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'select' | 'checkbox' | 'radio' | 'textGender' | 'textMaritalState';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: FieldOption[];
  initialValue?: string | number | boolean;
  columnTakes?: number;
}

interface FormConfig {
  title: string;
  inputColumns: number;
  fields: FormField[];
  submitButtonText?: string;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

// Define the form data type based on fields
type FormData = Record<string, any>;

// Define areas array (this was missing in original code)
const areas: { id: number; [key: string]: any }[] = [];

// Map field types to Zod validation rules
const getZodSchema = (fields: FormField[]) => {
    // Add safety check to prevent the TypeError
    if (!fields || !Array.isArray(fields)) {
        console.warn("getZodSchema called with invalid fields:", fields);
        return z.object({});
    }

    const schemaShape = fields.reduce((acc, field) => {
        let schema;
        if(field.required){
            field.minLength = field.minLength || 1;
        }
        switch (field.type) {
            case 'number':
                schema = z.coerce.number();
                if (field.min !== undefined) {
                schema = schema.min(field.min, `${field.label} must be at least ${field.min}`);
                }
                if (field.max !== undefined) {
                schema = schema.max(field.max, `${field.label} must be at most ${field.max}`);
                }
                break;
            case 'select':
                // if (field.name === 'residential_area') {
                //     schema = z.coerce.number() // Ensure number type
                //       .refine(val => areas.some((area: any) => area.id === val), {
                //         message: `Please select a valid ${field.label}`
                //       });
                // } else {
                //     schema = z.string();
                //     if (field.required) {
                //         schema = schema.min(1, `${field.label} is required`);
                //     }
                // }
                // break;

                schema = z.string();
                    if (field.required) {
                        schema = schema.min(1, `${field.label} is required`);
                    }
                break;
            case 'text':
            case 'textarea':
                schema = z.string();
                if (field.minLength) {
                    schema = schema.min(field.minLength, `${field.label} must be at least ${field.minLength} characters`);
                }
                if (field.maxLength) {
                    schema = schema.max(field.maxLength, `${field.label} must be at most ${field.maxLength} characters`);
                }
                break;
            case 'date':
                schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');
                break;
            case 'email':
                schema = z.string().email(`Invalid ${field.label.toLowerCase()} format`);
                break;
            case 'password':
                schema = z.string().min(8, `${field.label} must be at least 8 characters`)
                break;
            case 'tel':
                schema = z.string()
                    .min(10, `${field.label} must be at least 10 digits`)
                    .max(15, `${field.label} must be at most 15 digits`)
                    .regex(/^[0-9+() -]*$/, {
                        message: `${field.label} must contain only numbers and phone symbols (+, -, (, ))`
                    });
                break;
            case 'textGender':
                schema = z.string()
                .refine(value => ['Male', 'Female'].includes(value), {
                message: 'Gender must be either "Male" or "Female"'
                });
                break;
            case 'textMaritalState':
                schema = z.string()
                .refine(value => ['Married', 'Single' , 'Armal'].includes(value), {
                message: 'Must be either "Married" or "Single" or "Armal"'
                });
                break;
            case 'radio':
                if (field.name === 'pregnance_status') {
                    schema = z.enum(['true', 'false'], {
                      errorMap: () => ({ message: `Please select pregnancy status` })
                    });
                } else {
                    schema = z.string();
                }
                break;
            case 'checkbox':
                schema = z.boolean();
                break;
            default:
                schema = z.string();
        }

        return {
            ...acc,
            [field.name]: schema,
        };
    }, {} as Record<string, z.ZodTypeAny>);

    return z.object(schemaShape);
};

const DynamicForm: React.FC<{ formConfig: FormConfig }> = ({ formConfig }) => {
    // Move the validation after hooks to avoid conditional hook calls
    const [isEditing, setIsEditing] = useState(false);//////////////////////////////////////////////
    const fields = formConfig?.fields || [];
    const schema = getZodSchema(fields);

    // const {
    //     control,
    //     handleSubmit,
    //     formState: { errors, isSubmitting },
    //     reset,
    // } = useForm<FormData>({
    //     resolver: zodResolver(schema),
    //     defaultValues: fields.reduce((acc, field) => ({
    //         ...acc,
    //         [field.name]: field.initialValue ?? (field.type === 'checkbox' ? false : ''),
    //     }), {} as Record<string, any>),
    // });

    // // After hooks are called, we can do conditional rendering
    // if (!formConfig) {
    //     console.error("DynamicForm: formConfig is undefined");
    //     return <div className="p-6 bg-white">Form configuration is missing</div>;
    // }

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: fields.reduce((acc, field) => ({
            ...acc,
            [field.name]: field.initialValue ?? (field.type === 'checkbox' ? false : ''),
        }), {} as Record<string, any>),
    });

    if (!formConfig) {
        console.error("DynamicForm: formConfig is undefined");
        return <div className="p-6 bg-white">Form configuration is missing</div>;
    }

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset();
        formConfig.onCancel?.();
    };


     return (
        <div className="p-6 bg-white relative"> {/* Added relative positioning */}
            <div className="flex justify-between items-start mb-6"> {/* Header container */}
                <h2 className="text-2xl font-bold text-gray-800">{formConfig.title}</h2>
                {!isEditing && (
                    <button
                            type="button"
                            onClick={handleEdit}
                            className="
                                px-3 py-1.5                   
                                sm:px-4 sm:py-2                  
                                md:px-5 md:py-2.5                
                                border border-[#09868A]           
                                text-[#09868A]                    
                                hover:bg-[#09868A]/10            
                                active:bg-[#09868A]/20           
                                rounded-md                       
                                text-sm sm:text-base              
                                flex items-center gap-1.5 sm:gap-2 
                                transition-all duration-200       
                                font-medium                                   
                                "
                    >
                        <FiEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" /> {/* Responsive icon */}
                        <span>Edit</span>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit(formConfig.onSubmit)} className="space-y-6">
                <div className={`grid grid-cols-1 md:grid-cols-${formConfig.inputColumns} gap-6`}>
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2" style={{
                            gridColumnStart: 'auto',
                            gridColumnEnd: `span ${field.columnTakes || 1}`,
                        }}>
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <InputFactory
                                config={{
                                    ...field,
                                    disabled: !isEditing
                                }}
                                control={control}
                                errors={errors as FieldErrors<FormData>}
                            />
                            {field.type === 'checkbox' && errors[field.name] && (
                                <div className="text-red-500 text-sm mt-1">
                                    {(errors as any)[field.name]?.message?.toString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-[#09868A]           
                                text-[#09868A]                    
                                hover:bg-[#09868A]/10            
                                active:bg-[#09868A]/20    rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[#09868A] text-white rounded-md hover:bg-[#09868A]/90 flex items-center gap-2"
                        >
                            <FiSave className="w-4 h-4" />
                            {isSubmitting ? 'Submitting...' : formConfig.submitButtonText || 'Submit'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default DynamicForm;