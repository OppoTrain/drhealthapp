// components/FileList.tsx
import { Checkbox } from "@heroui/react";
import FileTemplate from "../fileTemplate";

interface InsertedFile {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

interface FileListProps {
  fileData: InsertedFile[];
}

export default function FileList({ fileData }: FileListProps) {
  return (
    <div className="w-full mx-auto p-6">
      <div>
        <div className="w-full grid grid-cols-4">
          <Checkbox />
          <h3>Name</h3>
          <h3>Upload Date</h3>
          <h3>Action</h3>
        </div>
        <div className="w-full mx-auto pt-4">
          {fileData.map((file, index) => (
            <FileTemplate key={index} fileData={file} />
          ))}
          <hr className="border-t-2 border-gray-400 my-6" />
        </div>
      </div>
    </div>
  );
}