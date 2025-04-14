"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOpenModal = () => {
    const button = document.querySelector(
      'button[aria-label="add-client"]'
    ) as HTMLElement;
    button?.click();
  };

  const initial = user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="w-[250px] bg-white border-r border-gray-100 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-4 pb-6">
        <Image
          src="/Logo.png"
          alt="Health Logo"
          width={300}
          height={200}
          className="mx-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="mt-4 text-base font-medium">
        <Link
          href="/dashboard"
          className={`block border-b border-gray-100 transition-all ${
            pathname === "/dashboard" || pathname === "/"
              ? "bg-teal-50 text-teal-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center px-4 py-4">
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
            Clients
          </div>
        </Link>

        <Link
          href="/diet-plans"
          className={`block border-b border-gray-100 transition-all ${
            pathname === "/diet-plans"
              ? "bg-teal-50 text-teal-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center px-4 py-4">
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none">
              <path
                d="M8.1 13.34L3.91 9.16C2.35 7.6 2.35 5.09 3.91 3.5C5.47 1.91 7.98 1.91 9.56 3.5L11.66 5.6L14.07 3.19C15.88 1.38 18.71 1.38 20.52 3.19C22.33 5 22.33 7.83 20.52 9.64L18.11 12.05L19.94 13.88C20.69 14.63 19.67 16.07 18.67 15.07L16.54 12.94L10.3 19.17C9.54 19.93 8.32 19.93 7.55 19.17C6.79 18.41 6.79 17.18 7.55 16.42L13.79 10.2L8.56 4.97L4.38 9.16C3.53 10.01 4.53 11.46 5.53 10.46L8.1 7.9C8.65 7.35 9.32 7.01 10.01 6.86L8.1 13.34Z"
                fill="currentColor"
              />
            </svg>
            Diet plans
          </div>
        </Link>
      </nav>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Footer */}
      <div className="bg-teal-600 text-white">
        <div className="flex items-center p-4">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white mr-3">
            {initial}
          </div>
          <div className="text-sm leading-tight overflow-hidden text-ellipsis">
            {user?.email || "Admin"}
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="w-full py-3 transition-all hover:bg-teal-700"
        >
          <div className="flex items-center px-4 text-sm">
            <svg
              className="w-5 h-5 mr-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM15 6C16.1 6 17 6.9 17 8C17 9.1 16.1 10 15 10C13.9 10 13 9.1 13 8C13 6.9 13.9 6 15 6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14ZM9 18C9.22 17.28 12.31 16 15 16C17.7 16 20.8 17.29 21 18H9ZM6 15V12H9V10H6V7H4V10H1V12H4V15H6Z"
                fill="currentColor"
              />
            </svg>
            Register client
          </div>
        </button>
      </div>
    </aside>
  );
}
