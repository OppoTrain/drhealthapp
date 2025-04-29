"use client";
import { createClient } from "@/lib/supabase/client";
import Card from "./symptomsCard";
import { useEffect, useState } from "react";
import { SymptomCategory } from "./types";


export default function SymptomsAndSigns({ params }: { params: { id: string } }) {
  const [data, setData] = useState<SymptomCategory[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<number, number | string[]>>({});
  const supabase = createClient();

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

  
  const deleteExcisted =async()=>{
    const {data,error} = await supabase
      .from("patient_symptoms")
      .delete()
      .eq("patient_id", params.id);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    deleteExcisted()
    const payload=Object.values(selectedSymptoms).flatMap(value=> {
        if (Array.isArray(value)) {
          return value.map((id) => ({
            patient_id: params.id,
            symptom_id: Number(id),
          }));
        } else {
          return [{
            patient_id: params.id,
            symptom_id: Number(value),
          }];
      }})

    const { error } = await supabase
      .from("patient_symptoms")
      .insert(payload);
    if (error) {
      console.error("Error saving symptoms:", error.message);
    } else {
      console.log("Saved symptoms:", selectedSymptoms);
    }
  };

  return (
    <form onSubmit={handleSave} className="w-5/6 mx-auto py-12" >
      <div className="grid gap-y-6
                      content-center 
                      justify-items-center
                      sm:grid-cols-1 
                      md:grid-cols-2 
                      lg:grid-cols-4">

        {data.map((category) => (
          <Card
            key={category.id}
            cardData={category}
            selectedSymptoms={selectedSymptoms}
            setSelectedSymptoms={setSelectedSymptoms}
          />
        ))}
      </div>
      <div className="flex  lg:justify-end  md:justify-center  sm:justify-center gap-[48px] px-[24px] py-[50px]">
        <button type="button" 
                className="w-[260px] h-[50px] border border-[#09868A] rounded-[12px] "
                onClick={() => setSelectedSymptoms({})}>
          Cancel
        </button>
        <button type="submit" className="w-[260px] h-[50px] bg-[#09868A] rounded-[12px]">Save</button>
      </div>
    </form>
  );
}