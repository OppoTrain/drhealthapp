// src/components/SharedLayout.tsx or the file where ClientRootLayout is defined
"use client";

import Sidebar from "@/components/Sidebar"; // Import your Sidebar component

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
