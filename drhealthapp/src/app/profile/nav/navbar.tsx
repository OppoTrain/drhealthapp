'use client';

import { useState } from 'react';

import { ProfileInfo } from './ProfileInfo/profileInfo';
import { Measurements } from './Measurements/measurements';
import {MedicalReports} from './MedicalReports/medicalReports'
import{MedicalInformation} from './MedicalInformation/medicalInformation'
import {DietartyHabits} from './DietaryHabits/dietartyHabits'
import {Conclusion} from './Conclusion/conclusion'
import {SymptomsAndSigns} from './SymptomsAndSigns/symptoms'

const getTabClasses = (isActive: boolean): string => 
    `py-4 px-1 border-b-2 font-medium text-sm ${
      isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

export default function ProfileNavbar() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>

<div className="border-b border-gray-200 overflow-x-auto">
  <nav className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-8 min-w-max sm:min-w-0 px-8 justify-between">
    <button onClick={() => setActiveTab('profile')} className={getTabClasses(activeTab === 'profile')}>
      <span className="flex items-center space-x-2">
        <img src="/Icons/account_circle.png" alt="profile Icon" className="w-5 h-5" />
        <span>Profile information</span>
      </span>
    </button>

    <button onClick={() => setActiveTab('measurements')} className={getTabClasses(activeTab === 'measurements')}>
      <span className="flex items-center space-x-2">
        <img src="/Icons/accessibility_new.png" alt="Measurements Icon" className="w-5 h-5" />
        <span>Body measurements</span>
      </span>
    </button>

    <button onClick={() => setActiveTab('MedicalInformation')} className={getTabClasses(activeTab === 'MedicalInformation')}>
      <span className="flex items-center space-x-2">
        <img src="/Icons/medical_information.png" alt="Medical Icon" className="w-5 h-5" />
        <span>Medical Information</span>
      </span>
    </button>

    <button onClick={() => setActiveTab('DietartyHabits')} className={getTabClasses(activeTab === 'DietartyHabits')}>
      
      <span className="flex items-center space-x-2">
        <img src="/Icons/volunteer_activism.png" alt="Dietary Icon" className="w-5 h-5" />
        <span>Dietary Habits</span>
      </span>
    </button>

    <button onClick={() => setActiveTab('SymptomsAndSigns')} className={getTabClasses(activeTab === 'SymptomsAndSigns')}>
      
      <span className="flex items-center space-x-2">
        <img src="/Icons/conditions.png" alt="Symptoms Icon" className="w-5 h-5" />
        <span>Symptoms & Signs</span>
      </span>
    </button>

    <button onClick={() => setActiveTab('MedicalReports')} className={getTabClasses(activeTab === 'MedicalReports')}>
      
      <span className="flex items-center space-x-2">
        <img src="/Icons/upload.png" alt="Reports Icon" className="w-5 h-5" />
        <span>Medical Reports</span>
      </span>
    </button>

    <button onClick={() => setActiveTab('Conclusion')} className={getTabClasses(activeTab === 'Conclusion')}>
      <span className="flex items-center space-x-2">
        <img src="/Icons/summarize.png" alt="Conclusion Icon" className="w-5 h-5" />
        <span> Conclusion  </span>
      </span>
    </button>
  </nav>
</div>


      <div className="py-6">
      {activeTab === 'profile' && <ProfileInfo />}
      {activeTab ==='measurements' && <Measurements/>}

      {activeTab ==='MedicalInformation' && <MedicalInformation/>}


      {activeTab ==='DietartyHabits' && <DietartyHabits/>}


      {activeTab ==='SymptomsAndSigns' && <SymptomsAndSigns/>}
      {activeTab ==='MedicalReports' && <MedicalReports/>}
      {activeTab ==='Conclusion' && <Conclusion/>}
      </div>



    </div>
  );
}