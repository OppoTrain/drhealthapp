"use client";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";

interface HeaderProps {
    userName: string;
    birthDate: string;
    age: number;
    dietPlan: string;
}

export default function Header({ userName, birthDate, age, dietPlan }: HeaderProps) {
    return (
        <header className="w-full">
            {/* Profile Background Banner */}
            <div className="bg-profile-background h-[10vh] w-full bg-[#CCE0E1]" />

            {/* Profile Info Section */}
            <div className="flex justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    <Avatar size="lg" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
                        <p className="text-sm text-gray-500">
                            {birthDate} - {age} years
                        </p>
                        <p className="text-sm text-gray-600">Current diet plan: {dietPlan}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Button
                        className="flex items-center justify-center gap-2 rounded-2xl bg-buttonProfile text-sm text-white sm:h-12 sm:w-[300px] sm:text-base"
                    >
                        <img
                            src="/Icons/list_alt.png"
                            alt="Diet Plan Icon"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                        />
                        <span>View diet plan</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}