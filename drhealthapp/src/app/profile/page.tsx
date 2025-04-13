'use client';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import ProfileNavbar from './nav/navbar';


export default function Profile() {
  return (
    <div className="container-fluid ">
      <div className='bg-ProfileBackGround h-[20vh]'>
        adsadsa
      </div>
      
      <div className='flex justify-between p-5'>
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

                <Button className='bg-buttonProfile rounded w-[260px] h-[50px] text-white'>View diet plan</Button>
            </div>
      </div>

      <div>
        <ProfileNavbar/>
      </div>
          
    </div>
  );
}