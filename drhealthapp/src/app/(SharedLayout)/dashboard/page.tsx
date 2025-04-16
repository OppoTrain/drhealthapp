"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ClientCard from "@/components/ClientCard";
import RegisterClientModal from "@/components/RegisterModal";
interface Patient {
  patient_id: string;
  patient_name: string;
  gender: string;
  birth_date: string;
  disases: string;
  phone_number: string;
  created_at: string;
}

export default function Dashboard() {
  const supabase = createClient();

  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [clients, setClients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUserId(session.user.id);
      setSessionChecked(true);
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetchClients(userId);
    }
  }, [userId]);

  const fetchClients = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("patient")
        .select("*") // ✅ JUST SELECT FROM patient
        .eq("doctor_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";
      console.error("Error fetching patients:", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientAdded = async () => {
    setIsModalOpen(false);
    if (userId) {
      await fetchClients(userId);
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const filteredClients = searchQuery.trim()
    ? clients.filter((client) =>
        client.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clients;

  if (!sessionChecked) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header section - title only */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-medium text-gray-800">Clients</h1>
          </div>
        </div>
      </div>

      {/* Search and Add Client controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border border-gray-300 rounded-md px-3 py-2 pr-10 w-64 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="add-client"
            className="bg-teal-600 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-1">+</span> Add client
          </button>
        </div>
      </div>

      {/* Content section */}
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
                onDelete={() => fetchClients(userId!)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <RegisterClientModal
          onClose={() => setIsModalOpen(false)}
          onClientAdded={handleClientAdded}
        />
      )}
    </div>
  );
}
