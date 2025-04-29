"use client"
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import FileTemplaet from "./fileTemplate";
import { type FileObject } from "@supabase/storage-js"; // ✅ import this
import {Checkbox } from "@heroui/react";

interface InsertedFile {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  created_at: string;
}


function Page({ params }: { params: { id: string } }) {
    const [uploading, setUploading] = useState(false);
    const supabase= createClient()
    const [files, setFiles] = useState<FileObject[]>([]);
    const [schemaData, setSchemaData] = useState<InsertedFile[]>([]);

    useEffect(() => {
      const getSchemaData = async () => {
        const { data, error } = await supabase
          .from("Files")
          .select('*')
          .eq("user_id", params.id.toString()); 
    
        if (error) {
          console.error("Error fetching schema data:", error.message);
        } else if (data) {
          setSchemaData(data);
        }
      };
    
      getSchemaData(); 
    
    }, [params.id]); 

    const uploadFile = async (file: File) => {
        setUploading(true);
        const fileBath=`${params.id}/${file.name}`
        const { data, error } = await supabase
          .storage
          .from("files")
          .upload(fileBath, file);

          const {data:schema,error:filesError} = await supabase
          .from('Files')
          .insert([{
            user_id : params.id.toString(),
            file_name : file.name,
            file_size : file.size
          }])
        if (filesError) {
          console.error("Upload error:", filesError.message);
        } else {
          console.log("Upload successful:", schema);
          console.log(file.size)
        }
        setUploading(false);
      };

    function dropHandler(ev:any) {
        //console.log("File(s) dropped");
        const supabase= createClient()
        ev.preventDefault();
        if (ev.dataTransfer.items) {
          [...ev.dataTransfer.items].forEach((item, i) => {
            if (item.kind === "file") {
              const file = item.getAsFile();
              console.log(`… file[${i}].name = ${file.name}`);
              uploadFile(file);
            }
          });
        } else {
          // Use DataTransfer interface to access the file(s)
          [...ev.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
          });
        }
      }

      function dragOverHandler(ev:any) {
        console.log("File(s) in drop zone");
      
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
      }
      
    
      useEffect(() => {
        console.log("Updated files:", files);
      }, [files]);

    return (
        <div className="w-full">
            <div className="w-[30%]
                            flex
                            flex-col
                            items-center
                            gap-6
                            my-14
                            p-4
                            bg-[#FFFFFF] 
                            h-60 mx-[auto] 
                            my-5 
                            border-[3px] 
                            border-[#BDBDBD] 
                            border-dashed
                            "
                            onDrop={dropHandler}
                            onDragOver={dragOverHandler}>

                <img src="/Icons/note_stack_add.png" 
                    alt="file upload icon" 
                    className="w-[56px] 
                                h-[56px]"/>

                <button className="flex 
                                ld:w-2/4
                                md:w-3/4
                                sm:4/4
                                h-[50px] 
                                gap-2 
                                bg-[#09868A] 
                                justify-center 
                                items-center
                                rounded-[12px]">

                    <img src="/Icons/upload.png" 
                        alt="upload icon" 
                        className="w-[25px] 
                                    h-[25px]" />

                    <h3 className="text-white ">Upload file</h3>
                </button>

                <h3>Drage & drop file to upload</h3>
            </div>

            <div className="w-[90%] border border-black mx-auto">
                <div className="w-1/2 flex items-center w-72 border border-gray-300 bg-white rounded-[8px] px-4 py-2 space-x-2">
                        <img src="/Icons/search.png"/>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 outline-none w-[100%]"
                        />
                </div>

                <div className="w-[100%] mx-auto p-6">
                    <div>
                        <div className="w-[100%] grid grid-cols-4 ">
                            <Checkbox/>
                            <h3>Name</h3>
                            <h3>upload date</h3>
                            <h3>Action</h3>
                        </div>

                        <div className="w-[100%] mx-auto pt-4">
                          {
                            schemaData.map((file,index)=>(
                              <FileTemplaet key={index} fileData={file}/>
                            ))
                          }
                            
                            <hr className="border-t-2 border-gray-400 my-6" />
                        </div>
                    </div>
                </div>
                
            </div>
            
        </div> 
     );
}

export default Page;