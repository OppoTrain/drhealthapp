"use client"
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import FileTemplaet from "./fileTemplate";
import Image from "next/image";
// import { sup } from "framer-motion/client";

interface InsertedFile {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  created_at: string;
}


function Page({ params }: { params: { id: string } }) {
    // const [uploading, setUploading] = useState(false);
    const supabase= createClient()
    const [schemaData, setSchemaData] = useState<InsertedFile[]>([]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<InsertedFile[]>([]);

    const handleDelete = (id: string) => {
      setSchemaData((prev) => prev.filter((file) => file.id !== id));
      setResults((prev) => prev.filter((file) => file.id !== id));
      const deleteFile = async () => {
        const { error } = await supabase
          .from("Files")
          .delete()
          .eq("id", id);
        if (error) {
          console.error("Error deleting file:", error.message);
        } else {
          console.log("File deleted successfully");
        }
      }
      deleteFile();
    };
    

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
        // setUploading(true);
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
        // setUploading(false);
      };

    function dropHandler(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
        if (ev.dataTransfer.items) {
          Array.from(ev.dataTransfer.items).forEach((item, i) => {
            if (item.kind === "file") {
              const file = item.getAsFile();
              if (file) {
                console.log(`… file[${i}].name = ${file.name}`);
                uploadFile(file);
              }
            }
          });
        } else {
          Array.from(ev.dataTransfer.files).forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
          });
        }
      }

      function dragOverHandler(ev: React.DragEvent<HTMLDivElement>) {
        console.log("File(s) in drop zone");
              ev.preventDefault();
      }

      useEffect(() => {
        const delayDebounce = setTimeout(() => {
          if (query.trim() === '') {
            setResults([]);
            return;
          }
    
          const fetchResults = async () => {
            const { data, error } = await supabase
              .from('Files') // change to your table name
              .select('*')
              .ilike('file_name', `%${query}%`); // 'name' column
    
            if (!error) setResults(data);
          };

          console.log(results)
          fetchResults();
        }, 300); // debounce time
    
        return () => clearTimeout(delayDebounce);
      }, [query]);

      async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length === 0) {
          console.error("No files selected");
          return;
        }
      
        const fileArray = Array.from(files);
        for (const file of fileArray) {
          try {
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from("files")
              .upload(`${params.id}/${file.name}`, file);
      
            if (uploadError) {
              console.error(`Error uploading ${file.name}:`, uploadError.message);
              continue; 
            }
      
            console.log(`Uploaded ${file.name}:`, uploadData);
      
            const { error: insertError } = await supabase
              .from("Files")
              .insert({
                file_name: file.name,
                file_size: file.size,
                user_id: params.id,
              });
      
            if (insertError) {
              console.error(`Error inserting ${file.name} metadata:`, insertError.message);
            }
          } catch (error) {
            console.error(`Unexpected error processing ${file.name}:`, error);
          }
        }
      }
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

                <Image 
                    src="/Icons/note_stack_add.png" 
                    alt="file upload icon" 
                    width={56} 
                    height={56} 
                    className="w-[56px] h-[56px]" 
                />

                <label
                  htmlFor="file-upload"
                  className="flex 
                            ld:w-2/4
                            md:w-3/4
                            sm:w-full
                            h-[50px] 
                            gap-2 
                            bg-[#09868A] 
                            justify-center 
                            items-center
                            rounded-[12px]
                            cursor-pointer"
                >
                  <Image
                    src="/Icons/upload.png"
                    alt="upload icon"
                    width={25}
                    height={25}
                    className="w-[25px] h-[25px]"
                  />
                  <h3 className="text-white">Upload file</h3>
                </label>

                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <h3>Drage & drop file to upload</h3>
            </div>

            
              <div className="w-[90%] border border mx-auto">
              <div className="w-full max-w-md flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition">
                
                <div className="p-2 flex items-center ">
                  <Image
                    src="/Icons/search.png"
                    alt="search icon"
                    width={20}
                    height={20}
                    className="text-gray-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 px-3 py-2 text-sm outline-none bg-transparent placeholder-gray-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

                <div className="w-[100%] mx-auto p-6">
                    <div className="w-full grid grid-cols-[2fr_1fr_1fr] items-center py-3 px-4 gap-4 rounded-lg hover:bg-gray-50 transition">
                        {/* <Checkbox/> */}
                        <h3>Name</h3>
                        <h3>upload date</h3>
                        <h3>Action</h3>
                    </div>

                    <div className="w-full mx-auto pt-4">
                        {(results.length > 0 ? results : schemaData).map((file, index) => (
                          <FileTemplaet key={index} fileData={file} onDelete={handleDelete} />
                        ))}
                  </div>

                </div>
              </div>
                  
            </div> 
  );
}

export default Page;
