"use client";
import { createClient } from "../../../../lib/supabase/client";
import Card from "../../../../components/symptoms/symptomsCard";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react"; 
import { SymptomCategory,Symptom } from "./types";
import { object } from "zod";


export default function SymptomsAndSigns() {
  const [data, setData] = useState<SymptomCategory[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<number, number | string[]>>({});
  const supabase = createClient();
  console.log(selectedSymptoms)
  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from("symptoms_categories")
        .select("*, symptoms(*)")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Fetched data:", data);
        setData(data);
      }
    };

    getData();
  }, []);

  

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload=Object.values(selectedSymptoms).flatMap(value=> {
        if (Array.isArray(value)) {
          return value.map((id) => ({
            patient_id: "10e7bfd4-d8b0-49ca-8d3f-a6e98befb8f8",
            symptom_id: Number(id),
          }));
        } else {
          return [{
            patient_id: "10e7bfd4-d8b0-49ca-8d3f-a6e98befb8f8",
            symptom_id: Number(value),
          }];
      }})

    const { data, error } = await supabase
      .from("patient_symptoms")
      .insert(payload);
    if (error) {
      console.error("Error saving symptoms:", error.message);
    } else {
      console.log("Saved symptoms:", selectedSymptoms);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className=" grid gap-y-6
                       lg:w-[1332px] lg:grid-cols-4 lg:mx-auto lg:py-6 
                       md:w-[700px] md:grid-cols-2  md:mx-auto md:py-4
                       sm:w-[300px] sm:grid-cols-1 sm:mx-auto ">
        {data.map((category) => (
          <Card
            key={category.id}
            cardData={category}
            setSelectedSymptoms={setSelectedSymptoms}
          />
        ))}
      </div>
      <div className="flex justify-end gap-[48px] px-[24px]">
        <button type="button" className="w-[260px] h-[50px] border border-[#09868A] rounded-[12px]">
          Cancel
        </button>
        <button type="submit" className="w-[260px] h-[50px] bg-[#09868A] rounded-[12px]">Save</button>
      </div>
    </form>
  );
}