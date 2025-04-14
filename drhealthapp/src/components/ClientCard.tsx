import Image from "next/image";

interface ClientProps {
  patient: {
    patient_name: string;
    gender: string;
    birth_date: string;
    disases: string;
    body_mesurment?: {
      weight: number | null;
      height: number | null;
    };
  };
}

export default function ClientCard({ patient }: ClientProps) {
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
      </div>
    </div>
  );
}
