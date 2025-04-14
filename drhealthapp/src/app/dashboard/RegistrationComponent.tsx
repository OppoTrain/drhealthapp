'use client'
import { useRouter } from 'next/navigation'
import React, { FormEvent } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@heroui/modal'
import {
    Form,
    Input,
    Select,
    SelectItem,
    DatePicker,
    Button,
} from '@heroui/react'

type RegistrationProps = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
}

type ClientFormData = {
    name: string
    gender: string
    birthDate: string
    weight?: string
    length?: string
    diseases?: string
    phone: string
}

export default function RegistrationComponent({
    isOpen,
    onOpenChange,
}: RegistrationProps) {
    const router = useRouter()
    const [, setSubmitted] = React.useState<ClientFormData | null>(null)
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submit")
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData) as Record<string, string>

        const newErrors: Record<string, string> = {}
        if (!data.name) newErrors.name = 'Please enter full name'
        if (!data.gender) newErrors.gender = 'Please select gender'
        if (!data.birthDate) newErrors.birthDate = 'Please enter birth date'
        if (!data.phone) newErrors.phone = 'Please enter phone number'
        console.log(formData)
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setSubmitted(data as ClientFormData)
        const params = new URLSearchParams(data).toString()
        router.push(`/dashboard?${params}`)
    }

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size='4xl'
            className='p-8'
            radius='sm'
        >
            <ModalContent>
                <ModalHeader className="text-4xl font-bold justify-center">
                    Register client
                </ModalHeader>
                <ModalBody>
                    <Form
                        id="form"
                        className="w-full space-y-4"
                        onSubmit={onSubmit}
                        validationErrors={errors}
                    >
                        <Input
                            isRequired
                            name="name"
                            label="Full name"
                            placeholder="Enter full name"
                            labelPlacement="outside"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <Select
                                isRequired
                                name="gender"
                                label="Gender"
                                placeholder="Select one"
                                labelPlacement="outside"
                            >
                                <SelectItem key="male">Male</SelectItem>
                                <SelectItem key="female">Female</SelectItem>
                                <SelectItem key="other">Other</SelectItem>
                            </Select>

                            <DatePicker
                                isRequired
                                name="birthDate"
                                label="Birth date"
                                labelPlacement="outside"
                                placeholder="Pick a date"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <Input
                                name="weight"
                                label="Weight"
                                placeholder="Enter weight"
                                labelPlacement="outside"
                            />
                            <Input
                                name="length"
                                label="Length"
                                placeholder="Enter length"
                                labelPlacement="outside"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <Input
                                name="diseases"
                                label="Diseases"
                                placeholder="Enter diseases"
                                labelPlacement="outside"
                            />
                            <Input
                                isRequired
                                name="phone"
                                label="Phone number"
                                placeholder="Enter phone number"
                                labelPlacement="outside"
                            />
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit" form="form" className='px-24 py-6 text-md'>
                        Register client
                    </Button>
                </ModalFooter>


            </ModalContent>
        </Modal>
    )
}
