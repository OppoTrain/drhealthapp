'use client';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import ProfileNavbar from './nav/navbar';


export default function Profile() {
  return (
    <div className="container-fluid flex flex-col">
      <div className='bg-ProfileBackGround h-[20vh]'>
        adsadsa
      </div>
      
      <div className='flex justify-between p-3 w-[95vw] mx-auto '>
            <div className="flex items-center gap-4">
                <div>
                <Avatar size="lg" />
                
                </div>
                
                <div>
                <h2 className="text-lg font-semibold">Sama Hasan</h2>
                <p className="text-sm text-gray-500">Nov 12, 2006 - 18 years</p>
                <p className="text-sm text-gray-600">Current diet plan: Keto diet</p>
                </div>
            </div>
        
            <div className="flex gap-2 mt-4 sm:mt-0">

                <Button className="bg-buttonProfile text-white rounded-2xl w-[90%] sm:w-[300px] h-10 sm:h-12 text-sm sm:text-base">
                    <img src='./Icons/list_alt.png' alt="Diet Icon" className="w-4 h-4 sm:w-5 sm:h-5"/>
                    <span> View diet plan </span>
                  </Button>
            </div>
      </div>

      <div>
        <ProfileNavbar/>
      </div>
          
    </div>
  );
}