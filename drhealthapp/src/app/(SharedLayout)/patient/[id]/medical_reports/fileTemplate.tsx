"use client";

// import { Checkbox } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

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
  onDelete: (id: string) => void;
}

function FileTemplate({ fileData, onDelete }: FileTemplateProps) {
  const supabase = createClient();

  return (
    <div className="w-full grid grid-cols-[2fr_1fr_1fr] items-center py-3 px-4 gap-4 rounded-lg hover:bg-gray-50 transition">
      <div className="flex items-center space-x-3">
        <svg
          className="w-5 h-5 text-gray-500 flex-shrink-0"
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
        <div className="min-w-0">
          <a href={`https://ydefblvrdypjtskvjnrh.supabase.co/storage/v1/object/public/files//${fileData.user_id}/${fileData.file_name}`} target="_blank" className="font-medium text-gray-800 truncate hover:text-blue-600">{fileData.file_name}</a>
          <div className="text-sm text-gray-500">{formatFileSize(fileData.file_size ?? 0)}</div>
        </div>
      </div>

      {/* Created Date */}
      <div className="text-sm text-gray-600 truncate">{fileData.created_at}</div>

      {/* Delete Button */}
      <div className="flex justify-end">
        <button
            onClick={() => onDelete(fileData.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <Image src="/Icons/delete.png" width={16} height={16} alt="delete icon" className="flex-shrink-0" />
          <span>Delete</span>
        </button>
        <button
            onClick={async () => {
              try {
                const { data, error } = await supabase
                  .storage
                  .from('files')
                  .download(`${fileData.user_id}/${fileData.file_name}`);
                
                if (error) {
                  console.error('Error downloading file:', error.message);
                  return;
                }

                if (data) {
                  // Create blob URL from the downloaded data
                  const blob = new Blob([data], { type: 'application/octet-stream' });
                  const url = window.URL.createObjectURL(blob);
                  
                  // Create download link
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = fileData.file_name;
                  document.body.appendChild(link);
                  link.click();
                  
                  // Cleanup
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(link);
                }
              } catch (err) {
                console.error('Failed to download file:', err);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}

export default FileTemplate;