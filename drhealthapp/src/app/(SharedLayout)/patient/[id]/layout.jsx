// src/components/SharedLayout.tsx or the file where ClientRootLayout is defined
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';



const getTabClasses = (isActive) => 
  `py-4 px-1 border-b-2 font-medium text-sm ${
    isActive
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }`;





export default function ClientRootLayout({ children,params}) {
    const pathname = usePathname();
    const getActiveTab = () => {
      if (pathname.includes('/body_measurement')) return 'BodyMeasurement'
      if (pathname.includes('/dietary_habits')) return 'DietartyHabits';
      if (pathname.includes('/medical_info')) return 'MedicalInformation';
      return 'profile'; 
    };

    const activeTab = getActiveTab();



  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* <nav className='bg-gray-100 flex justify-around	p-4'>
        
        <Link href={`/patient/${params.id}`}>Profile information</Link>
        <Link href={`/patient/${params.id}/dietary_habits`}>Dietary habits</Link>
        <Link href={`/patient/${params.id}/medical_info`}>Medical information</Link>
      </nav> */}
      

      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-8 min-w-max sm:min-w-0 px-8 justify-between">
        
        <Link  className={getTabClasses(activeTab === 'profile')} href={`/patient/${params.id}`}>
          <span className="flex items-center space-x-2">
            <img src="/Icons/account_circle.png" alt="profile Icon" className="w-5 h-5" />
            <span>Profile Info </span>
          </span>
        </Link>



        <Link  className={getTabClasses(activeTab === 'BodyMeasurement')} href={`/patient/${params.id}/body_measurements`}>
          <span className="flex items-center space-x-2">
            <img src="/Icons/accessibility_new.png" alt="BodyMeasurement Icon" className="w-5 h-5" />
            <span>Body Measurements</span>
          </span>
        </Link>

        <Link  className={getTabClasses(activeTab === 'DietartyHabits')} href={`/patient/${params.id}/dietary_habits`}>
          <span className="flex items-center space-x-2">
            <img src="/Icons/volunteer_activism.png" alt="Dietary Icon" className="w-5 h-5" />
            <span>Dietary Habits</span>
          </span>
        </Link>

        <Link  className={getTabClasses(activeTab === 'MedicalInformation')} href={`/patient/${params.id}/medical_info`}>
          <span className="flex items-center space-x-2">
            <img src="/Icons/medical_information.png" alt="Medical Icon" className="w-5 h-5" />
            <span>Medical Information</span>
          </span>
        </Link>

        </nav>



      </div>
      <div className='p-4'>
        {children}
      </div>



    </div>
  );
}
