"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';

const navItems = [
    {
        name: 'Profile Info',
        path: 'profile_info',
        icon: '/Icons/account_circle.png',
        tab: 'profile',
    },
    {
        name: 'Body Measurements',
        path: 'body_measurements',
        icon: '/Icons/accessibility_new.png',
        tab: 'BodyMeasurement',
    },
    {
        name: 'Dietary Habits',
        path: 'dietary_habits',
        icon: '/Icons/volunteer_activism.png',
        tab: 'DietaryHabits',
    },
    {
        name: 'Medical Information',
        path: 'medical_info',
        icon: '/Icons/medical_information.png',
        tab: 'MedicalInformation',
    },
    {
        name: 'Symptoms and Signs',
        path: 'symptoms_and_signs',
        icon: '/Icons/conditions.png',
        tab: 'SymptomsAndSigns',
    },
    {
        name:'Medical reports',
        path:"medical_reports",
        icon:'/Icons/upload.png',
        tap:'MedicalReports',
    }
];

const getTabClasses = (isActive: boolean) =>
    `py-4 px-1 border-b-2 font-medium text-sm ${isActive
        ? 'border-teal-500 text-teal-500'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

interface NavHeaderProps {
    patientId: string;
}

export default function NavHeader({ patientId }: NavHeaderProps) {
    const pathname = usePathname() || '';

    const getActiveTab = () => {
        const pathSegment = pathname.split('/').pop() || '';
        return navItems.find((item) => item.path === pathSegment)?.tab || 'profile';
    };

    const activeTab = getActiveTab();

    return (

            <nav className="grid grid-flow-col md:grid-flow-col lg:grid-rows-1 md:grid-rows-2 sm:grid-rows-3 gap-4 px-4 border-b border-gray-200 ">     
                {navItems.map((item) => (
                <Link
                    key={item.path}
                    className={getTabClasses(activeTab === item.tab)}
                    href={`/patient/${patientId}/${item.path}`}
                    aria-current={activeTab === item.tab ? 'page' : undefined}
                >
                    <span className="flex items-center space-x-2">
                        <img src={item.icon} alt={`${item.name} Icon`} className="w-5 h-5" />
                        <span>{item.name}</span>
                    </span>
                </Link>
            ))}
        </nav>
    );
}