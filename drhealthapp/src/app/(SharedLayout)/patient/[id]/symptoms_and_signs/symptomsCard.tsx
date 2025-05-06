"use client";
// import { useState } from "react";
import { RadioGroup, Radio } from "@heroui/react";
import { CheckboxGroup, Checkbox } from "@heroui/react";
import { SymptomCategory } from "@/app/(SharedLayout)/patient/[id]/symptoms_and_signs/types";



interface SymptomsCardProps {
  cardData: SymptomCategory;
  selectedSymptoms: Record<number, number | string[]>;
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<Record<number, number | string[]>>>;
}


export default function SymptomsCard({cardData,selectedSymptoms,setSelectedSymptoms,}: SymptomsCardProps) {

  const handleRadioChange = (value: string) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [cardData.id]: parseInt(value),
    }));
  };

  const handleCheckboxChange = (values: string[]) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [cardData.id]: values,
    }));
  };

  const selected = selectedSymptoms[cardData.id];
  const isRadio = cardData.type === "radio";

  return (
    <div className="w-5/6 min-h-60 max-h-fit border-1 border-gray-300 shadow-md bg-white text-base rounded-[12px] p-6">
      <h3 className="font-medium mb-3">{cardData.name}</h3>
      {isRadio ? (
        <RadioGroup
        value={selected !== undefined ? selected.toString() : ""}
        onValueChange={handleRadioChange}
      >
        {cardData.symptoms.map((symptom) => (
          <Radio
            key={symptom.id}
            value={symptom.id.toString()}
            className={selected === symptom.id ? "text-teal-500" : "text-black"}
          >
            {symptom.symptom_name}
          </Radio>
        ))}
      </RadioGroup>
      ) : (
        <CheckboxGroup
          value={Array.isArray(selected) ? selected : []}
          onChange={handleCheckboxChange}
        >
          {cardData.symptoms.map((symptom) => (
            <Checkbox
              key={symptom.id}
              value={symptom.id.toString()}
              className={
                Array.isArray(selected) && selected.includes(symptom.id.toString())
                  ? "text-teal-500"
                  : "text-black"
              }
            >
              {symptom.symptom_name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}
    </div>
  );
}
