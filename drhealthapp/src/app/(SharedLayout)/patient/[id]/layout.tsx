"use client";
import NavHeader from "./NavHeader";
import Header from"./Header";


interface ClientRootLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default function ClientRootLayout({ children, params }: ClientRootLayoutProps) {  

  const userName = "John Doe"; // Example: Fetch from API or params

  return (
    <>

      <Header userName={userName} birthDate="1-1-2002" age={23} dietPlan="keto" />
      <NavHeader patientId={params.id}/>

      {children}
    </>
  );
}