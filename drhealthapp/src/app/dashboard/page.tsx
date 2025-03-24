'use client'

import {

    Button,
    useDisclosure,
} from "@heroui/react";
import RegistrationComponent from "./RegistrationComponent";

export default function page() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button onPress={onOpen}>Open Modal</Button>
            <RegistrationComponent onOpenChange={onOpenChange} isOpen={isOpen}></RegistrationComponent>

        </>
    );
}
