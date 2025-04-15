import React from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
} from '@heroui/modal'
import DynamicForm from './DynamicForm'
import { createClient } from '@/lib/supabase/client'

export default function RegistrationComponent({ isOpen, onOpenChange, onClientAdded }) {
    const supabase = createClient()

    const formConfig = {
        title: 'Register Client',
        inputColumns:2,
        fields: [
            {
                name: 'patient_name',
                label: 'Full name',
                type: 'text',
                required: true,
                minLength: 2,
                placeholder: 'Enter full name',
                columnTakes:2
            },
            {
                name: 'gender',
                label: 'Gender',
                type: 'select',
                required: true,
                options: [
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                ],
                placeholder: 'Select one',
            },
            {
                name: 'birth_date',
                label: 'Birth date',
                type: 'date',
                required: true,
                placeholder: 'Pick a date',
            },
            {
                name: 'weight',
                label: 'Weight (kg)',
                type: 'text',
                placeholder: 'Enter weight',
            },
            {
                name: 'height',
                label: 'Height (cm)',
                type: 'text',
                placeholder: 'Enter height',
            },
            {
                name: 'disases',
                label: 'Diseases',
                type: 'text',
                placeholder: 'Enter diseases',
            },
            {
                name: 'phone_number',
                label: 'Phone number',
                type: 'text',
                required: true,
                placeholder: 'Enter phone number',
            },
        ],
        submitButtonText: 'Register client',
        onSubmit: async (data) => {
            try {
                // Step 1: Insert into patient table
                const { data: patientData, error: patientError } = await supabase
                    .from('patient')
                    .insert({
                        patient_name: data.patient_name,
                        gender: data.gender,
                        birth_date: data.birth_date,
                        disases: data.disases,
                        phone_number: data.phone_number,
                        doctor_id: (await supabase.auth.getSession()).data.session?.user.id,
                    })
                    .select()
                    .single()
                    
                if (patientError?.code) throw patientError

                // Step 2: Insert into body_measurement table if any measurement is provided
                if (data.weight || data.height ) {
                    console.log( patientData.patient_id,)
                    const { error: bodyError } = await supabase
                        .from('body_measurement')
                        .insert({
                            patient_id: patientData.patient_id,
                            weight: parseInt(data.weight) ,
                            height: parseInt(data.height),
                        }).select().single()
                    if (bodyError?.code) throw patientError
                }
                onOpenChange(false)
                onClientAdded()
            } catch (error) {
                console.error('Error adding client:', error)
            }
        },
        onCancel: () => {
            onOpenChange(false)
        },
    }

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="4xl"
            className="p-8"
            radius="sm"
        >
            <ModalContent>
                <ModalHeader className="text-4xl font-bold justify-center">
                    Register Client
                </ModalHeader>
                <div>
                    <DynamicForm formConfig={formConfig} />
                </div>

            </ModalContent>
        </Modal>
    )
}