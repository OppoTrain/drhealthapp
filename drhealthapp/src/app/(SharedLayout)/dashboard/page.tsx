"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ClientCard from "@/components/ClientCard";
import RegisterModal from "@/components/RegisterModal";
import { useDisclosure } from "@heroui/modal";

interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  disases: string;
  phone_number: string;
  created_at: string;
  body_mesurment?: {
    weight: number | null;
    height: number | null;
  };
}

export default function Dashboard() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [clients, setClients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
        fetchClients(session.user.id);
      }
    });
  }, []);

  const fetchClients = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient")
        .select(
          `
  patient_id,
  first_name,
  last_name,
  gender,
  birth_date,
  disases,
  phone_number,
  created_at,
  body_measurement(weight, height)
`
        )
        .eq("doctor_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(
        (data || []).map((patient) => ({
          ...patient,
          body_measurement: Array.isArray(patient.body_measurement)
            ? patient.body_measurement[0]
            : patient.body_measurement,
        }))
      );
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientAdded = async () => {
    if (userId) await fetchClients(userId);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const filteredClients = searchQuery.trim()
    ? clients.filter((client) =>
        `${client.first_name} ${client.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : clients;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-[25px] font-black text-[#333434]">Clients</h1>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end items-center gap-2">
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="px-3 py-2 w-64 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-teal-600 px-3 text-white flex items-center justify-center"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          <button
            onClick={onOpen}
            aria-label="add-client"
            className="bg-teal-600 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-1">+</span> Add client
          </button>
        </div>
      </div>

      {/* Client Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery.trim()
              ? "No clients match your search."
              : "No clients found. Add your first client above."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.patient_id}
                patient={client}
                onClientDeleted={() =>
                  setClients((prev) =>
                    prev.filter((p) => p.patient_id !== client.patient_id)
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <RegisterModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
