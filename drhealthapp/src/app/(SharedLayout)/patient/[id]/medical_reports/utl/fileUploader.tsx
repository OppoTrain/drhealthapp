// components/FileUploader.tsx
import { useState } from "react";

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  uploading: boolean;
}

export default function FileUploader({ onFileUpload, uploading }: FileUploaderProps) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(Array.from(e.target.files));
    }
  };

  const dropHandler = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      const files = Array.from(ev.dataTransfer.items)
        .filter(item => item.kind === "file")
        .map(item => item.getAsFile())
        .filter((file): file is File => file !== null);
      onFileUpload(files);
    }
  };

  const dragOverHandler = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  };

  return (
    <div
      className="w-[30%] flex flex-col items-center gap-6 my-14 p-4 bg-white h-60 mx-auto my-5 border-[3px] border-[#BDBDBD] border-dashed"
      onDrop={dropHandler}
      onDragOver={dragOverHandler}
    >
      <img
        src="/Icons/note_stack_add.png"
        alt="file upload icon"
        className="w-[56px] h-[56px]"
      />
      <label className="flex w-3/4 h-[50px] gap-2 bg-[#09868A] justify-center items-center rounded-[12px] cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={handleFileInput}
          multiple
          disabled={uploading}
        />
        <img
          src="/Icons/upload.png"
          alt="upload icon"
          className="w-[25px] h-[25px]"
        />
        <h3 className="text-white">Upload file</h3>
      </label>
      <h3>Drag & drop file to upload</h3>
    </div>
  );
}