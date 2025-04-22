// src/components/SharedLayout.tsx or the file where ClientRootLayout is defined
"use client";
import Link from 'next/link'
export default function ClientRootLayout({ children,params}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <nav className='bg-gray-100 flex justify-around	p-4'>
        
        <Link href={`/patient/${params.id}`}>Profile information</Link>
        <Link href={`/patient/${params.id}/dietary_habits`}>Dietary habits</Link>
        <Link href={`/patient/${params.id}/medical_info`}>Medical information</Link>
      </nav>
      <div className='p-4'>
        {children}
      </div>
    </div>
  );
}
