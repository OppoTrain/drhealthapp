"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RegisterClientModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClientAdded: () => void;
}

export default function RegisterModal({
  isOpen,
  onOpenChange,
  onClientAdded,
}: RegisterClientModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    birth_date: "",
    weight: "",
    height: "", // changed from length
    diseases: "",
    phone_number: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      first_name,
      middle_name,
      last_name,
      phone_number,
      gender,
      birth_date,
      diseases,
      weight,
      height,
    } = formData;

    if (!first_name || !middle_name || !last_name || !phone_number) {
      setError("Please fill out all required name and phone fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user) throw new Error("Session error");

      const doctor_id = session.user.id;

      // Check for duplicates first
      const { data: existing } = await supabase
        .from("patient")
        .select("patient_id")
        .match({
          first_name,
          middle_name,
          last_name,
          phone_number,
        })
        .maybeSingle();

      if (existing) {
        setError(
          "A client with this full name and phone number already exists."
        );
        return;
      }

      const { data: patientData, error: patientError } = await supabase
        .from("patient")
        .insert([
          {
            first_name,
            middle_name,
            last_name,
            gender,
            birth_date,
            disases: diseases,
            phone_number,
            doctor_id,
          },
        ])
        .select()
        .single();

      if (patientError || !patientData) throw patientError;

      await supabase.from("body_measurement").insert([
        {
          patient_id: patientData.patient_id,
          weight: weight ? parseInt(weight) : null,
          height: height ? parseInt(height) : null,
        },
      ]);

      onClientAdded();
      onOpenChange();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add client.";
      setError(msg);
      console.error("Register error:", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[750px] mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium text-center w-full">
            Register client
          </h2>
          <button
            onClick={onOpenChange}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 m-4 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          {/* First, Middle, Last Name */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                First name
              </label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Middle name
              </label>
              <input
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Last name
              </label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Gender + Birth date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select one</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Birth date
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Weight + Height */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Weight</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Height</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Diseases + Phone */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Diseases
              </label>
              <input
                name="diseases"
                value={formData.diseases}
                onChange={handleChange}
                placeholder="If any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Phone number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white py-2 px-6 rounded hover:bg-teal-700 disabled:bg-teal-300"
            >
              {isSubmitting ? "Registering..." : "Register client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
