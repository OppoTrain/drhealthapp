"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface ClientProps {
  patient: {
    patient_id: string;
    patient_name: string;
    gender: string;
    birth_date: string;
    disases: string;
  };
  onDelete?: () => void;
}

export default function ClientCard({ patient, onDelete }: ClientProps) {
  const supabase = createClient();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getAvatarSrc = () =>
    patient.gender?.toLowerCase() === "female"
      ? "/female-avatar.png"
      : "/male-avatar.png";

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patient.birth_date);

  const handleDelete = async () => {
    const { error } = await supabase
      .from("patient")
      .delete()
      .eq("patient_id", patient.patient_id);

    if (error) {
      console.error("Delete failed", error);
    } else {
      setShowConfirm(false);
      onDelete?.(); // refresh client list
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        showMenu
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-white rounded-lg shadow relative overflow-hidden">
      {/* 3-dot menu button */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-500 hover:text-gray-800"
        >
          ⋮
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
            <button
              className="block px-4 py-2 w-full text-left hover:bg-gray-100 flex items-center"
              onClick={() => {
                setShowMenu(false);
                //redirect(/profile-page)
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M16.5 3.5L20.5 7.5L8.5 19.5H4.5V15.5L16.5 3.5Z"
                  stroke="#667085"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
            <button
              className="block px-4 py-2 w-full text-left hover:bg-red-50 text-red-600 flex items-center"
              onClick={() => {
                setShowConfirm(true);
                setShowMenu(false);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M3 6H5H21"
                  stroke="#E53935"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                  stroke="#E53935"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Client info - EXACTLY as in original code */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <Image
              src={getAvatarSrc()}
              alt={patient.patient_name}
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{patient.patient_name}</h3>
            <p className="text-gray-500 text-sm">Gender: {patient.gender}</p>
            <p className="text-gray-500 text-sm">Age: {age}</p>
          </div>
        </div>
        {patient.disases && (
          <div className="text-sm text-gray-600">
            <p>Diseases: {patient.disases}</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog that matches the image exactly */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-center pt-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-red-200"
                >
                  <path
                    d="M20 9H4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V9Z"
                    fill="#FFCDD2"
                    stroke="#FFCDD2"
                    strokeWidth="2"
                  />
                  <path
                    d="M10 13V17M14 13V17M16 5H18M8 5H16M8 5C8 5 9 3 10 3H14C15 3 16 5 16 5M8 5H6M16 9H8V21H16V9Z"
                    stroke="#E53935"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center px-6 pt-4 pb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Delete Client
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete this client? This action cannot
                be undone.
              </p>
            </div>

            <div className="flex p-4 border-t border-gray-100">
              <button
                className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 mr-3"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
