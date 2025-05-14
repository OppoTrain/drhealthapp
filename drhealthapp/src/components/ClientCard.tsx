"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface ClientProps {
  patient: {
    patient_id: string;
    first_name: string;
    last_name: string;
    gender: string;
    birth_date: string;
    disases: string;
    body_measurement?: {
      weight: number | null;
      height: number | null;
    };
  };
  onClientDeleted?: () => void;
}

export default function ClientCard({ patient, onClientDeleted }: ClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const menuRef = useRef<HTMLDivElement>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fullName = `${patient.first_name} ${patient.last_name}`;
  const avatarSrc =
    patient.gender?.toLowerCase() === "female"
      ? "/female-avatar.png"
      : "/male-avatar.png";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

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
    setIsDeleting(true);
    try {
      await supabase
        .from("body_measurement")
        .delete()
        .eq("patient_id", patient.patient_id);
      const { error } = await supabase
        .from("patient")
        .delete()
        .eq("patient_id", patient.patient_id);
      if (error) throw error;
      onClientDeleted?.();
    } catch (error) {
      alert("Failed to delete client. Try again.");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow relative">
      {/* Enhanced 3-dots menu */}
      <div className="absolute top-3 right-3 z-20" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Menu options"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        {/* Enhanced dropdown menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md text-sm w-36 z-50 border border-gray-100 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(
                  `/patient/${patient.patient_id}/profile_info?edit=true`
                );
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
            >
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit</span>
            </button>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Delete Patient Record
              </h3>
            </div>

            <p className="mb-1 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-medium">{fullName}</span>?
            </p>
            <p className="mb-5 text-sm text-gray-500">
              This action cannot be undone. All data associated with this
              patient will be permanently removed.
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Patient"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Body (unchanged) */}
      <div
        className="p-6 cursor-pointer"
        onClick={() =>
          router.push(`/patient/${patient.patient_id}/profile_info`)
        }
      >
        <div className="flex items-center mb-4">
          <Image
            src={avatarSrc}
            alt={fullName}
            width={60}
            height={60}
            className="rounded-full mr-4"
          />
          <div>
            <h3 className="font-medium text-lg">{fullName}</h3>
            <p className="text-sm text-gray-500">Gender: {patient.gender}</p>
            <p className="text-sm text-gray-500">Age: {age}</p>
            {patient.disases && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="text-amber-600 font-medium">Conditions:</span>{" "}
                {patient.disases}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
