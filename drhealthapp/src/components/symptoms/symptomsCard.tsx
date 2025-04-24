"use client";
import { useState } from "react";
import { RadioGroup, Radio } from "@heroui/react";
import { CheckboxGroup, Checkbox } from "@heroui/react";
import { SymptomCategory } from "@/app/profile/nav/SymptomsAndSigns/types";

interface SymptomsCardProps {
  cardData: SymptomCategory;
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<Record<number, number | string[]>>>;
}

export default function SymptomsCard({ cardData, setSelectedSymptoms }: SymptomsCardProps) {
  const [selected, setSelected] = useState<string | undefined>();
  const [groupSelected, setGroupSelected] = useState<string[]>([]);

  const handleRadioChange = (value: string) => {
    setSelected(value);
    setSelectedSymptoms((prev) => ({
      ...prev,
      [cardData.id]: parseInt(value), 
    }));
  };

  const handleCheckboxChange = (values: string[]) => {
    setGroupSelected(values);
    setSelectedSymptoms((prev) => ({
      ...prev,
      [cardData.id]: values
    }));
  };

  return (
    <div className="w-[280px] min-h-[220px] border-2 border-gray-300 shadow-md bg-white text-base p-5 rounded-[12px]">
      <h3 className="font-medium mb-3">{cardData.name}</h3>
      {cardData.type === "radio" ? (
        <RadioGroup value={selected} onValueChange={handleRadioChange}>
          {cardData.symptoms.map((symptom) => (
            <Radio
              key={symptom.id}
              value={symptom.id.toString()}
              className={selected === symptom.id.toString() ? "text-teal-500" : "text-black"}
            >
              {symptom.symptom_name}
            </Radio>
          ))}
        </RadioGroup>
      ) : (
        <div className="flex flex-col space-y-2">
          <CheckboxGroup value={groupSelected} onChange={handleCheckboxChange}>
            {cardData.symptoms.map((symptom) => (
              <Checkbox
                key={symptom.id}
                value={symptom.id.toString()}
                className={groupSelected.includes(symptom.id.toString()) ? "text-teal-500" : "text-black"}
              >
                {symptom.symptom_name}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      )}
    </div>
  );
}