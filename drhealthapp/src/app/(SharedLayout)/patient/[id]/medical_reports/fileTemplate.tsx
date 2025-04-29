"use client";

import { Checkbox } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";

interface InsertedFile {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    const sizeInKB = bytes / 1024;
    return `${sizeInKB.toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    const sizeInMB = bytes / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  } else {
    const sizeInGB = bytes / (1024 * 1024 * 1024);
    return `${sizeInGB.toFixed(2)} GB`;
  }
}

interface FileTemplateProps {
  fileData: InsertedFile;
  onDelete?: (fileId: string) => void; // Optional callback for delete
}

function FileTemplate({ fileData, onDelete }: FileTemplateProps) {
  const supabase = createClient();

  const handleDelete = async () => {
    try {
      // Delete file from storage
      const filePath = `${fileData.user_id}/${fileData.file_name}`;
      const { error: storageError } = await supabase
        .storage
        .from("files")
        .remove([filePath]);

      if (storageError) {
        throw new Error(storageError.message);
      }

      // Delete file metadata from database
      const { error: dbError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileData.id);

      if (dbError) {
        throw new Error(dbError.message);
      }

      // Trigger the onDelete callback if provided
      if (onDelete) {
        onDelete(fileData.id);
      }
    } catch (error: any) {
      console.error("Error deleting file:", error.message);
    }
  };

  return (
    <div className="grid grid-cols-4 items-center py-2">
      <Checkbox />
      <div className="flex items-center space-x-2">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
          />
        </svg>
        <div>
          <div className="font-medium text-gray-800">{fileData.file_name}</div>
          <div className="text-xs text-gray-500">
            {formatFileSize(fileData.file_size ?? 0)}
          </div>
        </div>
      </div>

      <div className="text-gray-600">{fileData.created_at}</div>

      <div className="flex justify-center">
        <button
          onClick={handleDelete}
          className="w-[50%] px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex justify-center items-center gap-2"
        >
          <img src="/Icons/delete.png" className="w-[16px] h-[17px]" alt="delete icon" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default FileTemplate;