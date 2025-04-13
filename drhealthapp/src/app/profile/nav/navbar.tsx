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

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab('profile')} className={getTabClasses(activeTab === 'profile')}>
            Profile information
          </button>



          <button onClick={() => setActiveTab('measurements')} className={getTabClasses(activeTab === 'measurements')}>
            Body measurements
          </button>


          <button onClick={() => setActiveTab('MedicalInformation')} className={getTabClasses(activeTab === 'MedicalInformation')}>
          MedicalInformation
          </button>
          <button onClick={() => setActiveTab('DietartyHabits')} className={getTabClasses(activeTab === 'DietartyHabits')}>
          DietartyHabits
          </button>
          <button onClick={() => setActiveTab('SymptomsAndSigns')} className={getTabClasses(activeTab === 'SymptomsAndSigns')}>
          SymptomsAndSigns
          </button>
          <button onClick={() => setActiveTab('MedicalReports')} className={getTabClasses(activeTab === 'MedicalReports')}>
          MedicalReports
          </button>
          <button onClick={() => setActiveTab('Conclusion')} className={getTabClasses(activeTab === 'Conclusion')}>
          Conclusion
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