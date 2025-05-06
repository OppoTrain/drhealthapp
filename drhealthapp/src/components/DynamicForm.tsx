import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputFactory from './InputFactory';

// Map field types to Zod validation rules
const getZodSchema = (fields) => {
    const schemaShape = fields.reduce((acc, field) => {
        let schema;
        if(field.required){
            field.minLength=1
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
                if (field.name === 'residential_area') {
                    schema = z.coerce.number() // Ensure number type
                      .refine(val => areas.some(area => area.id === val), {
                        message: `Please select a valid ${field.label}`
                      });
                  } 
                // if (field.name === 'residential_area') {
                //     schema = z.coerce.number()  // Will convert string inputs to numbers
                //       .refine(val => field.options.some(opt => opt.value === val), {
                //         message: `Please select a valid ${field.label}`
                //       });
                    
                //     if (field.required) {
                //       schema = schema.min(1, { message: `${field.label} is required` });
                //     }
                //   }
                //   break;
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
    }, {});

    return z.object(schemaShape);
};

const DynamicForm = ({ formConfig }) => {
    const schema = getZodSchema(formConfig.fields);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: formConfig.fields.reduce((acc, field) => ({
            ...acc,
            
            [field.name]: 
                // field.type === 'select' && field.name === 'residential_area' 
                // ? Number(field.initialValue) || undefined // Convert to number
                // : field.initialValue ?? (field.type === 'checkbox' ? false : ''),

            // field.type === 'select' 
            // ? field.initialValue || '' // Keep as string or whatever type your options use
             field.initialValue ?? (field.type === 'checkbox' ? false : ''),
        }), {}),
    });


    return (
        <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{formConfig.title}</h2>
            <form onSubmit={handleSubmit(formConfig.onSubmit)} className="space-y-6">
                <div className={`grid grid-cols-1 md:grid-cols-${formConfig.inputColumns} gap-6`}>
                    {formConfig.fields.map((field) => (
                        <div key={field.name} className="space-y-2" style={{
                            gridColumnStart: 'auto', // Let grid auto-place columns
                            gridColumnEnd: `span ${field.columnTakes || 1}`, // Span columns based on columnTakes
                        }}>
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <InputFactory
                                config={field}
                                control={control}
                                errors={errors}
                                


                                
                            />
                            {field.type === 'checkbox' && errors[field.name] && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors[field.name]?.message}
                                </div>
                            )}

                            







                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    {   
                        formConfig.onCancel&&
                        <button
                            type="button"
                            onClick={() => {
                                formConfig.onCancel?.();
                                reset();
                            }}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    }
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Submitting...' : formConfig.submitButtonText || 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DynamicForm;