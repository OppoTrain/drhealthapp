"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RegisterClientModalProps {
  onClose: () => void;
  onClientAdded: () => void;
}

export default function RegisterModal({
  onClose,
  onClientAdded,
}: RegisterClientModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    birth_date: "",
    weight: "",
    length: "",
    diseases: "",
    phone_number: "",
  });
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.gender || !formData.birth_date) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Get session to retrieve doctor ID
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        throw new Error("Session error. Please re-login.");
      }

      const doctor_id = session.user.id;

      // Insert into patient table
      const { data: patientData, error: patientError } = await supabase
        .from("patient")
        .insert([
          {
            patient_name: formData.full_name,
            gender: formData.gender,
            birth_date: formData.birth_date,
            disases: formData.diseases,
            phone_number: formData.phone_number,
            doctor_id,
          },
        ])
        .select()
        .single();

      if (patientError || !patientData) throw patientError;

      // Insert into body_measurement table
      const { error: bodyError } = await supabase
        .from("body_measurement")
        .insert([
          {
            patient_id: patientData.patient_id,
            weight: formData.weight ? parseInt(formData.weight) : null,
            height: formData.length ? parseInt(formData.length) : null,
          },
        ]);

      if (bodyError) throw bodyError;

      onClientAdded();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add client.";
      console.error("Registration error:", err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium text-center w-full">
            Register client
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 m-4 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none"
                required
              >
                <option value="">Select one</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Birth date
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Weight</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Length</label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Diseases
              </label>
              <input
                type="text"
                name="diseases"
                value={formData.diseases}
                onChange={handleChange}
                placeholder="If any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
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
