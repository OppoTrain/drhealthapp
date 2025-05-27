'use client';

import { useRouter, usePathname } from 'next/navigation';

function Page(){
    const router = useRouter();
    const pathname = usePathname();
    const id = pathname.split('/')[2]; // Changed from [3] to [2] to get the correct id

    return(
        <>
        
       <div className="w-[60%] m-[auto] p-6 flex flex-col items-center shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <div className="text-center mb-12">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Start building a custom diet plan!</h1>
                <p className="text-gray-600">Select an option below to create your client&apos;s ideal meal plan.</p>              
            </div>
            <div className="flex gap-8 w-full max-w-3xl">
                {/* Create Custom Meal Plan Card */}
                <div className="flex flex-col items-center p-6 bg-teal-500 text-white rounded-lg shadow-sm cursor-pointer hover:bg-teal-600 transition-colors w-1/2" onClick={() => router.push(`/Diet/${id}/RegesterDietPlan`)}>
                    <img className="w-14 h-14 mb-4" src="/Icons/fork_spoon.png" alt="Fork and Spoon Icon"/>
                    <p className="text-lg font-semibold mb-2">Create a custom meal plan</p>
                    <p className="text-sm text-center">Create a personalized diet plan from scratch to meet your client&apos;s needs.</p>
                </div>
                {/* Use Existing Diet Plan Card */}
                <div className="flex flex-col items-center p-6 bg-white text-gray-800 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors w-1/2">
                    <img className="w-14 h-14 mb-4" src="/Icons/menu_book.png" alt="Menu Book Icon"/>
                    <p className="text-lg font-semibold mb-2">Use an existing diet plan</p>
                    <p className="text-sm text-center">Pick from your previously designed meal plans, and modify them as needed.</p>
                </div>
            </div>
       </div>
        </>
    )
}

export default Page;
