// src/components/SharedLayout.tsx or the file where ClientRootLayout is defined
"use client";
import Link from 'next/link';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import { createClient } from "@/lib/supabase/client";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";



const getTabClasses = (isActive) => 
  `py-4 px-1 border-b-2 font-medium text-sm ${
    isActive
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }`;

  export function formatDateWithAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    
    // Format the date (e.g., "Sep 14, 2003")
    const formattedDate = birthDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${formattedDate} - ${age} years`;
  }




export default function ClientRootLayout({ children,params}) {
  const [PatientInfo, setPatientInfo] = useState({});

  const supabase = createClient();

  const pathname = usePathname();
  const getActiveTab = () => {
    if (pathname.includes('/body_measurement')) return 'BodyMeasurement'
    if (pathname.includes('/dietary_habits')) return 'DietartyHabits';
    if (pathname.includes('/medical_info')) return 'MedicalInformation';
    return 'profile'; 
  };

  const activeTab = getActiveTab();
  useEffect(()=>{
    const getPatientInfo = async () => {
      try {
          const { data, error } = await supabase
              .from('patient')
              .select('patient_name, birth_date')
              .eq('patient_id', params.id)
              .single();

          if (error) {
              console.error('Error fetching body measurements:', error);
              return;
          }
          setPatientInfo({
              patient_name: data?.patient_name || '',
              birth_date: formatDateWithAge(data?.birth_date) || '',
          });
      } catch (err) {
          console.error('Unexpected error:', err);
      }
      
  };

  getPatientInfo();

  },[params.id]);



  
  return (
    <div className="flex flex-col h-screen">
        {/* <div className='bg-ProfileBackGround h-[10vh] sm:h-[12vh] md:h-[18vh] lg:h-[20vh]'>
          adsadsa
        </div> */}
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between p-3 w-full max-w-[95vw] mx-auto bg-ProfileBackGround'>
        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
          <div>
            <Avatar size="lg" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">{PatientInfo.patient_name}</h2>
            <p className="text-sm text-gray-500 truncate">{PatientInfo.birth_date}</p>
            <p className="text-sm text-gray-600 truncate">Current diet plan: Keto diet</p>
          </div>
        </div>
        
        <div className="flex justify-end sm:justify-center">
          <Button className="bg-buttonProfile text-white rounded-2xl w-full sm:w-auto min-w-[150px] h-10 text-sm">
            <img src='/Icons/list_alt.png' alt="Diet Icon" className="w-4 h-4"/>
            <span className="ml-2">View diet plan</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto sticky top-0 bg-white z-10">
        <nav className="flex space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 px-4 sm:px-8 min-w-max">
          <Link className={getTabClasses(activeTab === 'profile')} href={`/patient/${params.id}/profile_info`}>
            <span className="flex items-center space-x-1 sm:space-x-2 py-2">
              <img src="/Icons/account_circle.png" alt="profile Icon" className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-xs sm:text-base">Profile Info</span>
            </span>
          </Link>

          <Link className={getTabClasses(activeTab === 'BodyMeasurement')} href={`/patient/${params.id}/body_measurements`}>
            <span className="flex items-center space-x-1 sm:space-x-2 py-2">
              <img src="/Icons/accessibility_new.png" alt="BodyMeasurement Icon" className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-xs sm:text-base">Body Measurements</span>
            </span>
          </Link>

          <Link className={getTabClasses(activeTab === 'DietartyHabits')} href={`/patient/${params.id}/dietary_habits`}>
            <span className="flex items-center space-x-1 sm:space-x-2 py-2">
              <img src="/Icons/volunteer_activism.png" alt="Dietary Icon" className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-xs sm:text-base">Dietary Habits</span>
            </span>
          </Link>

          <Link className={getTabClasses(activeTab === 'MedicalInformation')} href={`/patient/${params.id}/medical_info`}>
            <span className="flex items-center space-x-1 sm:space-x-2 py-2">
              <img src="/Icons/medical_information.png" alt="Medical Icon" className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-xs sm:text-base">Medical Information</span>
            </span>
          </Link>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {children}
      </div>
    </div>
  );
}
